import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase";
import { resend } from "@/lib/resend";
import {
  welcomeEmail,
  day3Email,
  day14Email,
  day30Email,
  day90Email,
} from "@/lib/emails";

// Next.js App Router does not pre-parse the body; we read it raw here.
export const dynamic = "force-dynamic";

const FROM = "Dr. Connor Oliveri <droliveri@elevatehealthtampa.com>";
const REPLY_TO = "droliveri@elevatehealthtampa.com";

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

  const rawSession = event.data.object as Stripe.Checkout.Session;

  // Retrieve with line items expanded so we can detect upsell purchases
  const session = await stripe.checkout.sessions.retrieve(rawSession.id, {
    expand: ["line_items"],
  });

  // ── Dashboard upgrade (post-purchase upsell) ─────────────────────────────
  // These sessions are created by /api/upgrades/checkout for existing students.
  // Just update the profile flag — no new user creation, no welcome email.
  if (session.metadata?.source === "dashboard_upgrade") {
    const { userId, upgrade } = session.metadata;
    if (userId && (upgrade === "nutrition" || upgrade === "consultation")) {
      const field = upgrade === "nutrition" ? "has_nutrition_course" : "has_consultation";
      await supabaseAdmin.from("profiles").update({ [field]: true }).eq("id", userId);
    }
    return NextResponse.json({ received: true });
  }

  const lineItemPriceIds = (session.line_items?.data ?? []).map(
    (item) => item.price?.id
  );
  const hasNutritionCourse =
    !!process.env.STRIPE_UPSELL_1_PRICE_ID &&
    lineItemPriceIds.includes(process.env.STRIPE_UPSELL_1_PRICE_ID);
  const hasConsultation =
    !!process.env.STRIPE_UPSELL_2_PRICE_ID &&
    lineItemPriceIds.includes(process.env.STRIPE_UPSELL_2_PRICE_ID);

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
      const { data: existingRows } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .eq("email", email)
        .limit(1);
      const existingProfile = existingRows?.[0] ?? null;

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
      ...(hasNutritionCourse && { has_nutrition_course: true }),
      ...(hasConsultation && { has_consultation: true }),
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
    replyTo: REPLY_TO,
    to: email,
    subject: welcome.subject,
    html: welcome.html,
  });
  if (welcomeErr) console.error("[stripe-webhook] Welcome email failed:", welcomeErr);
  await logEmail(email, "welcome", welcomeErr ? "failed" : "sent");

  // ── 7. Consultation confirmation email (if purchased) ───────────────────
  if (hasConsultation) {
    const consultHtml = `
      <p>Hi ${firstName || "there"},</p>
      <p>Congratulations on securing your private 15-minute Pain Relief Consultation with Dr. Oliveri.</p>
      <p>Click the link below to choose your preferred time.</p>
      <p><strong>Booking Link:</strong><br>
      <a href="https://calendly.com/drconnoroliveri/15min-pain-free-consultation">https://calendly.com/drconnoroliveri/15min-pain-free-consultation</a></p>
      <p>You will receive a Zoom link automatically after booking.</p>
      <p>If you have any questions reply to this email. We look forward to speaking with you.</p>
      <p>— Dr. Oliveri &amp; The Elevate Health Team</p>
    `.trim();
    const { error: consultErr } = await resend.emails.send({
      from: FROM,
      replyTo: REPLY_TO,
      to: email,
      subject: "Your 1-on-1 Consultation is Confirmed — Here is How to Book",
      html: consultHtml,
    });
    await logEmail(email, "consultation_confirmation", consultErr ? "failed" : "sent");
    if (consultErr) console.error("[stripe-webhook] Consultation email failed:", consultErr);
  }

  // ── 8. Schedule Day 3, 14, 90 follow-up emails ──────────────────────────
  const scheduleEmail = async (
    type: string,
    subject: string,
    html: string,
    daysDelay: number
  ) => {
    const { error } = await resend.emails.send({
      from: FROM,
      replyTo: REPLY_TO,
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
  const d30 = day30Email(firstName);
  const d90 = day90Email(firstName);

  await Promise.all([
    scheduleEmail("post_day3", d3.subject, d3.html, 3),
    scheduleEmail("post_day14", d14.subject, d14.html, 14),
    scheduleEmail("post_day30", d30.subject, d30.html, 30),
    scheduleEmail("post_day90", d90.subject, d90.html, 90),
  ]);

  return NextResponse.json({ received: true }, { status: 200 });
}
