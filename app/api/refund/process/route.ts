import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { supabaseAdmin } from "@/lib/supabase";
import { stripe } from "@/lib/stripe";
import { resend } from "@/lib/resend";

export const dynamic = "force-dynamic";

const FROM = "Dr. Connor Oliveri <droliveri@elevatehealthtampa.com>";
const REPLY_TO = "droliveri@elevatehealthtampa.com";

export async function POST() {
  // ── 1. Authenticate ───────────────────────────────────────────────────────
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── 2. Fetch profile ──────────────────────────────────────────────────────
  const { data: profileRows } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .limit(1);

  const profile = profileRows?.[0];
  if (!profile?.purchased_at) {
    return NextResponse.json({ error: "No purchase found for this account." }, { status: 400 });
  }

  // ── 3. Check qualification criteria ──────────────────────────────────────
  const { data: moduleProgressRows } = await supabaseAdmin
    .from("module_progress")
    .select("completed_at")
    .eq("user_id", user.id);

  const daysSincePurchase = Math.floor(
    (Date.now() - new Date(profile.purchased_at).getTime()) / 86_400_000
  );
  const modulesCompleted = (moduleProgressRows ?? []).filter((r) => r.completed_at != null).length;
  const loginDates: string[] = Array.isArray(profile.login_dates) ? profile.login_dates : [];
  const uniqueLoginDays = loginDates.length;

  if (daysSincePurchase < 90) {
    return NextResponse.json(
      { error: "Refund not yet available. Your 90-day guarantee window opens after day 90 of your membership." },
      { status: 403 }
    );
  }

  if (daysSincePurchase >= 120) {
    return NextResponse.json(
      { error: "Your refund window has closed. The 90-day money-back guarantee was available between days 90 and 119 of your membership." },
      { status: 403 }
    );
  }

  const daysRemainingInWindow = 120 - daysSincePurchase;

  if (modulesCompleted < 7 || uniqueLoginDays < 30) {
    return NextResponse.json(
      { error: `You do not yet meet all refund criteria. Please complete all 7 modules and log in for at least 30 days before requesting a refund. You have ${daysRemainingInWindow} ${daysRemainingInWindow === 1 ? "day" : "days"} remaining in your refund window.` },
      { status: 403 }
    );
  }

  // ── 4. Issue Stripe refund ────────────────────────────────────────────────
  let paymentIntentId: string | null = null;

  // Try to get the payment intent from the stored checkout session
  if (profile.stripe_session_id) {
    try {
      const session = await stripe.checkout.sessions.retrieve(profile.stripe_session_id);
      paymentIntentId = typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id ?? null;
    } catch (err) {
      console.error("[refund] Failed to retrieve Stripe session:", err);
    }
  }

  // Fallback: find latest payment intent via customer
  if (!paymentIntentId && profile.stripe_customer_id) {
    try {
      const paymentIntents = await stripe.paymentIntents.list({
        customer: profile.stripe_customer_id,
        limit: 1,
      });
      paymentIntentId = paymentIntents.data[0]?.id ?? null;
    } catch (err) {
      console.error("[refund] Failed to list payment intents:", err);
    }
  }

  if (!paymentIntentId) {
    return NextResponse.json(
      { error: "Could not locate your payment. Please contact info@elevatehealthtampa.com for a manual refund." },
      { status: 400 }
    );
  }

  try {
    await stripe.refunds.create({ payment_intent: paymentIntentId });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Stripe refund failed.";
    console.error("[refund] Stripe refund error:", msg);
    return NextResponse.json(
      { error: `Refund failed: ${msg}. Please contact info@elevatehealthtampa.com.` },
      { status: 400 }
    );
  }

  // ── 4. Send confirmation email ────────────────────────────────────────────
  const firstName = profile.full_name?.split(" ")[0] || "there";
  const recipientEmail: string = profile.email ?? user.email ?? "";

  await resend.emails.send({
    from: FROM,
    replyTo: REPLY_TO,
    to: recipientEmail,
    subject: "Your Elevate Health Refund Has Been Processed",
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1f2937">
        <p>Hi ${firstName},</p>
        <p>Your full refund has been processed. You will receive your money back within <strong>5–10 business days</strong> to your original payment method.</p>
        <p>Your account access has been removed.</p>
        <p>We are sorry the program did not work for you. If you ever want to try again, you are always welcome back.</p>
        <p style="margin-top:32px">Dr. Connor Oliveri<br/>Elevate Health</p>
      </div>
    `,
  }).catch((err) => console.error("[refund] Email send failed:", err));

  // ── 5. Delete user data ───────────────────────────────────────────────────
  // Order matters: child rows before parent rows, then auth user last.
  await supabaseAdmin.from("shopping_list_progress").delete().eq("user_id", user.id);
  await supabaseAdmin.from("module_progress").delete().eq("user_id", user.id);
  if (recipientEmail) {
    await supabaseAdmin.from("email_log").delete().eq("recipient_email", recipientEmail);
  }
  await supabaseAdmin.from("profiles").delete().eq("id", user.id);
  await supabaseAdmin.auth.admin.deleteUser(user.id);

  return NextResponse.json({ success: true });
}
