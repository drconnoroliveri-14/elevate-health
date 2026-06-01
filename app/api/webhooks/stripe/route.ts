import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase";
import { resend } from "@/lib/resend";
import { welcomeEmail, day3Email, day14Email, day30Email, day90Email } from "@/lib/emails";

export const dynamic = "force-dynamic";
const FROM = "Dr. Connor Oliveri <droliveri@elevatehealthtampa.com>";
const REPLY_TO = "droliveri@elevatehealthtampa.com";

function daysFromNow(days: number): string {
  return new Date(Date.now() + days * 86_400_000).toISOString();
}

async function logEmail(recipientEmail: string, emailType: string, status: "sent" | "failed") {
  await supabaseAdmin.from("email_log").insert({ recipient_email: recipientEmail, email_type: emailType, status });
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing stripe-signature header." }, { status: 400 });

  let event: Stripe.Event;
  try { event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET!); } catch (err) { console.error("[stripe-webhook] Signature verification failed:", err); return NextResponse.json({ error: "Invalid signature." }, { status: 400 }); }

  if (event.type !== "checkout.session.completed") return NextResponse.json({ received: true });

  const rawSession = event.data.object as Stripe.Checkout.Session;
  const session = await stripe.checkout.sessions.retrieve(rawSession.id, { expand: ["line_items"] });

  if (session.metadata?.source === "dashboard_upgrade") {
    const { userId, upgrade } = session.metadata;
    if (userId && (upgrade === "nutrition" || upgrade === "consultation")) {
      const field = upgrade === "nutrition" ? "has_nutrition_course" : "has_consultation";
      await supabaseAdmin.from("profiles").update({ [field]: true }).eq("id", userId);
    }
    return NextResponse.json({ received: true });
  }

  if (session.metadata?.source === "dashboard_rebooking") {
    const { userId } = session.metadata;
    if (userId) await supabaseAdmin.from("profiles").update({ consultation_booked: false }).eq("id", userId);
    return NextResponse.json({ received: true });
  }

  const lineItemPriceIds = (session.line_items?.data ?? []).map((item) => item.price?.id);
  const hasNutritionCourse = !!process.env.STRIPE_UPSELL_1_PRICE_ID && lineItemPriceIds.includes(process.env.STRIPE_UPSELL_1_PRICE_ID);
  const hasConsultation = !!process.env.STRIPE_UPSELL_2_PRICE_ID && lineItemPriceIds.includes(process.env.STRIPE_UPSELL_2_PRICE_ID);

  const email = session.customer_details?.email;
  const fullName = session.customer_details?.name ?? "";
  const firstName = fullName.split(" ")[0] ?? "";
  const stripeCustomerId = typeof session.customer === "string" ? session.customer : "";
  const stripeSessionId = session.id;

  if (!email) { console.error("[stripe-webhook] No customer email in session:", session.id); return NextResponse.json({ received: true }); }

  const now = new Date().toISOString();
  const tempPassword = `Elevate${stripeSessionId.slice(-8)}!`;

  let userId: string;
  const { data: createData, error: createError } = await supabaseAdmin.auth.admin.createUser({ email, password: tempPassword, email_confirm: true });

  if (createError) {
    if (createError.message?.toLowerCase().includes("already") || createError.status === 422) {
      const { data: existingRows } = await supabaseAdmin.from("profiles").select("id").eq("email", email).limit(1);
      const existingProfile = existingRows?.[0] ?? null;
      if (!existingProfile?.id) { console.error("[stripe-webhook] User already exists but not in profiles:", email); return NextResponse.json({ received: true }); }
      userId = existingProfile.id;
    } else { console.error("[stripe-webhook] createUser error:", createError); return NextResponse.json({ received: true }); }
  } else { userId = createData.user.id; }

  await supabaseAdmin.from("profiles").upsert({ id: userId, email, full_name: fullName, role: "student", stripe_customer_id: stripeCustomerId, stripe_session_id: stripeSessionId, purchased_at: now, ...(hasNutritionCourse && { has_nutrition_course: true }), ...(hasConsultation && { has_consultation: true }) }, { onConflict: "id" });
  await supabaseAdmin.from("module_progress").upsert({ user_id: userId, module_number: 1, unlocked_at: now }, { onConflict: "user_id,module_number" });
  await supabaseAdmin.from("leads").update({ purchased: true }).eq("email", email);

  const welcome = welcomeEmail({ firstName, email, tempPassword });
  const { error: welcomeErr } = await resend.emails.send({ from: FROM, replyTo: REPLY_TO, to: email, subject: welcome.subject, html: welcome.html, text: welcome.text });
  if (welcomeErr) console.error("[stripe-webhook] Welcome email failed:", welcomeErr);
  await logEmail(email, "welcome", welcomeErr ? "failed" : "sent");

  if (hasConsultation) {
    const { error: consultErr } = await resend.emails.send({ from: FROM, replyTo: REPLY_TO, to: email, subject: "Your 1-on-1 Consultation is Confirmed — Here is How to Book", html: `<p>Hi ${firstName || "there"},</p><p>Congratulations on securing your private 15-minute Pain Relief Consultation with Dr. Oliveri.</p><p>Booking Link: <a href="https://calendly.com/drconnoroliveri/15min-pain-free-consultation">https://calendly.com/drconnoroliveri/15min-pain-free-consultation</a></p><p>— Dr. Connor Oliveri &amp; The Elevate Health Team</p>`, text: `Hi ${firstName || "there"}, book your consultation at https://calendly.com/drconnoroliveri/15min-pain-free-consultation` });
    await logEmail(email, "consultation_confirmation", consultErr ? "failed" : "sent");
  }

  const d3 = day3Email(firstName); const d14 = day14Email(firstName); const d30 = day30Email(firstName); const d90 = day90Email(firstName);
  await Promise.all([
    resend.emails.send({ from: FROM, replyTo: REPLY_TO, to: email, subject: d3.subject, html: d3.html, text: d3.text, scheduledAt: daysFromNow(3) }).then(({ error }) => logEmail(email, "post_day3", error ? "failed" : "sent")),
    resend.emails.send({ from: FROM, replyTo: REPLY_TO, to: email, subject: d14.subject, html: d14.html, text: d14.text, scheduledAt: daysFromNow(14) }).then(({ error }) => logEmail(email, "post_day14", error ? "failed" : "sent")),
    resend.emails.send({ from: FROM, replyTo: REPLY_TO, to: email, subject: d30.subject, html: d30.html, text: d30.text, scheduledAt: daysFromNow(30) }).then(({ error }) => logEmail(email, "post_day30", error ? "failed" : "sent")),
    resend.emails.send({ from: FROM, replyTo: REPLY_TO, to: email, subject: d90.subject, html: d90.html, text: d90.text, scheduledAt: daysFromNow(90) }).then(({ error }) => logEmail(email, "post_day90", error ? "failed" : "sent")),
  ]);

  return NextResponse.json({ received: true }, { status: 200 });
}