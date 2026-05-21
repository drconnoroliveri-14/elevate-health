import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase";
import { resend } from "@/lib/resend";
import {
  welcomeEmail,
  day3Email,
  day14Email,
  day90Email,
} from "@/lib/emails";

// Next.js App Router does not pre-parse the body; we read it raw here.
export const dynamic = "force-dynamic";

// Resend shared sender — works without domain verification.
// Swap to "Elevate Health <hello@mail.elevatehealth.com>" once that domain is verified in Resend.
const FROM = "Elevate Health <onboarding@resend.dev>";

function daysFromNow(days: number): string {
  return new Date(Date.now() + days * 86_400_000).toISOString();
}

async function logEmail(
  recipientEmail: string,
  emailType: string,
  status: "sent" | "failed"
) {
  await supabaseAdmin.from("email_log").insert({
    recipient_email: recipientEmail,
    email_type: emailType,
    status,
  });
}

export async function POST(req: NextRequest) {
  // Read raw body for signature verification
  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header." },
      { status: 400 }
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("[stripe-webhook] Signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    // Acknowledge but ignore events we don't handle
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  const email = session.customer_details?.email;
  const fullName = session.customer_details?.name ?? "";
  const firstName = fullName.split(" ")[0] ?? "";
  const stripeCustomerId =
    typeof session.customer === "string" ? session.customer : "";
  const stripeSessionId = session.id;

  if (!email) {
    console.error("[stripe-webhook] No customer email in session:", session.id);
    return NextResponse.json({ received: true });
  }

  const now = new Date().toISOString();

  // ── 1. Generate a temporary password — no special chars that break login forms
  const tempPassword = `Elevate${stripeSessionId.slice(-8)}!`;

  // ── 2. Create Supabase auth user ─────────────────────────────────────────
  let userId: string;

  const { data: createData, error: createError } =
    await supabaseAdmin.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
    });

  if (createError) {
    if (
      createError.message?.toLowerCase().includes("already") ||
      createError.status === 422
    ) {
      // User exists — look up their ID from profiles
      const { data: existingProfile } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      if (!existingProfile?.id) {
        console.error(
          "[stripe-webhook] User already exists but not in profiles:",
          email
        );
        return NextResponse.json({ received: true });
      }
      userId = existingProfile.id;
    } else {
      console.error("[stripe-webhook] createUser error:", createError);
      return NextResponse.json({ received: true });
    }
  } else {
    userId = createData.user.id;
  }

  // ── 3. Upsert profile ────────────────────────────────────────────────────
  await supabaseAdmin.from("profiles").upsert(
    {
      id: userId,
      email,
      full_name: fullName,
      role: "student",
      stripe_customer_id: stripeCustomerId,
      stripe_session_id: stripeSessionId,
      purchased_at: now,
    },
    { onConflict: "id" }
  );

  // ── 4. Unlock Module 1 ───────────────────────────────────────────────────
  await supabaseAdmin.from("module_progress").upsert(
    {
      user_id: userId,
      module_number: 1,
      unlocked_at: now,
    },
    { onConflict: "user_id,module_number" }
  );

  // ── 5. Mark lead as purchased ────────────────────────────────────────────
  await supabaseAdmin
    .from("leads")
    .update({ purchased: true })
    .eq("email", email);

  // ── 6. Send welcome email ────────────────────────────────────────────────
  const welcome = welcomeEmail({ firstName, email, tempPassword });
  const { error: welcomeErr } = await resend.emails.send({
    from: FROM,
    to: email,
    subject: welcome.subject,
    html: welcome.html,
  });
  if (welcomeErr) console.error("[stripe-webhook] Welcome email failed:", welcomeErr);
  await logEmail(email, "welcome", welcomeErr ? "failed" : "sent");

  // ── 7. Schedule Day 3, 14, 90 follow-up emails ──────────────────────────
  const scheduleEmail = async (
    type: string,
    subject: string,
    html: string,
    daysDelay: number
  ) => {
    const { error } = await resend.emails.send({
      from: FROM,
      to: email,
      subject,
      html,
      scheduledAt: daysFromNow(daysDelay),
    });
    await logEmail(email, type, error ? "failed" : "sent");
    if (error) console.error(`[stripe-webhook] Schedule ${type}:`, error);
  };

  const d3 = day3Email(firstName);
  const d14 = day14Email(firstName);
  const d90 = day90Email(firstName);

  await Promise.all([
    scheduleEmail("post_day3", d3.subject, d3.html, 3),
    scheduleEmail("post_day14", d14.subject, d14.html, 14),
    scheduleEmail("post_day90", d90.subject, d90.html, 90),
  ]);

  return NextResponse.json({ received: true }, { status: 200 });
}
