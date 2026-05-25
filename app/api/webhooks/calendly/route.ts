import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { resend } from "@/lib/resend";

export const dynamic = "force-dynamic";

const FROM = "Dr. Connor Oliveri <droliveri@elevatehealthtampa.com>";
const REPLY_TO = "droliveri@elevatehealthtampa.com";

const COMPLETION_EVENTS = new Set([
  "invitee_no_show.created",
]);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const eventType: string | undefined = body?.event;

    // Calendly sends the invitee email at different paths depending on event type
    const email: string | undefined =
      body?.payload?.invitee?.email ??
      body?.payload?.email;

    if (!email) {
      console.warn("[calendly webhook] No invitee email found in payload");
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    // Find the matching profile by email
    const { data: profileRows, error: lookupError } = await supabaseAdmin
      .from("profiles")
      .select("id, email, full_name, consultation_count")
      .eq("email", email)
      .limit(1);

    if (lookupError) {
      console.error("[calendly webhook] Profile lookup error:", lookupError.message);
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    const profile = profileRows?.[0];

    if (!profile) {
      console.warn("[calendly webhook] No profile found for email:", email);
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    const firstName = profile.full_name?.split(" ")[0] || "there";

    // ── Cancellation ─────────────────────────────────────────────────────────
    if (eventType === "invitee.canceled") {
      const { error: updateError } = await supabaseAdmin
        .from("profiles")
        .update({ consultation_booked: false, consultation_cancelled: true })
        .eq("id", profile.id);

      if (updateError) {
        console.error("[calendly webhook] Cancellation update error:", updateError.message);
      }

      const html = `
        <p>Hi ${firstName},</p>
        <p>Your 15-minute consultation with Dr. Oliveri has been cancelled. We are sorry for the inconvenience. You have two options to rebook:</p>
        <p><strong>Option 1 — Rebook through your dashboard:</strong><br>
        Log in to your dashboard at <a href="https://www.elevatehealthtampa.com/dashboard/consultation">https://www.elevatehealthtampa.com/dashboard/consultation</a> and click the booking button there.</p>
        <p><strong>Option 2 — Book directly:</strong><br>
        Use this link to choose a new time immediately: <a href="https://calendly.com/drconnoroliveri/15min-pain-free-consultation">https://calendly.com/drconnoroliveri/15min-pain-free-consultation</a></p>
        <p>If you have any questions please contact us at <a href="mailto:info@elevatehealthtampa.com">info@elevatehealthtampa.com</a></p>
        <p>— Dr. Connor Oliveri &amp; The Elevate Health Team</p>
      `.trim();
      const text = `Hi ${firstName},

Your 15-minute consultation with Dr. Oliveri has been cancelled. We are sorry for the inconvenience. You have two options to rebook:

Option 1 — Rebook through your dashboard: Log in to your dashboard at https://www.elevatehealthtampa.com/dashboard/consultation and click the booking button there.

Option 2 — Book directly: Use this link to choose a new time immediately: https://calendly.com/drconnoroliveri/15min-pain-free-consultation

If you have any questions please contact us at info@elevatehealthtampa.com

— Dr. Connor Oliveri & The Elevate Health Team`;

      const { error: emailError } = await resend.emails.send({
        from: FROM,
        replyTo: REPLY_TO,
        to: email,
        subject: "Your Consultation Has Been Cancelled",
        html,
        text,
      });

      if (emailError) console.error("[calendly webhook] Cancellation email error:", emailError);

      await supabaseAdmin.from("email_log").insert({
        recipient_email: email,
        email_type: "consultation_cancelled",
        status: emailError ? "failed" : "sent",
      });

      return NextResponse.json({ ok: true }, { status: 200 });
    }

    // ── Completion (no-show or meeting finished) ──────────────────────────────
    if (eventType && COMPLETION_EVENTS.has(eventType)) {
      const now = new Date().toISOString();
      const newCount = (profile.consultation_count ?? 0) + 1;

      const { error: updateError } = await supabaseAdmin
        .from("profiles")
        .update({
          consultation_completed: true,
          consultation_completed_at: now,
          consultation_booked: false,
          consultation_rated: false,
          consultation_count: newCount,
        })
        .eq("id", profile.id);

      if (updateError) {
        console.error("[calendly webhook] Completion update error:", updateError.message);
      }

      const html = `
        <p>Hi ${firstName},</p>
        <p>Thank you for your consultation with Dr. Oliveri today. We hope it was helpful.</p>
        <p>If you would like to book another session you can do so directly from your dashboard at <a href="https://www.elevatehealthtampa.com/dashboard/consultation">https://www.elevatehealthtampa.com/dashboard/consultation</a>.</p>
        <p>If you have any follow-up questions please email <a href="mailto:info@elevatehealthtampa.com">info@elevatehealthtampa.com</a>.</p>
        <p>— Dr. Connor Oliveri &amp; The Elevate Health Team</p>
      `.trim();
      const text = `Hi ${firstName},

Thank you for your consultation with Dr. Oliveri today. We hope it was helpful.

If you would like to book another session you can do so directly from your dashboard at https://www.elevatehealthtampa.com/dashboard/consultation.

If you have any follow-up questions please email info@elevatehealthtampa.com.

— Dr. Connor Oliveri & The Elevate Health Team`;

      const { error: emailError } = await resend.emails.send({
        from: FROM,
        replyTo: REPLY_TO,
        to: email,
        subject: "Thank you for your consultation with Dr. Oliveri",
        html,
        text,
      });

      if (emailError) console.error("[calendly webhook] Completion email error:", emailError);

      await supabaseAdmin.from("email_log").insert({
        recipient_email: email,
        email_type: "consultation_completed",
        status: emailError ? "failed" : "sent",
      });

      return NextResponse.json({ ok: true }, { status: 200 });
    }

    // ── Booking (invitee.created or any other event) ──────────────────────────
    // Do NOT reset consultation_rated — leave it until the next completion increments the count.
    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({
        consultation_booked: true,
        consultation_cancelled: false,
        consultation_completed: false,
      })
      .eq("id", profile.id);

    if (updateError) {
      console.error("[calendly webhook] Profile update error:", updateError.message);
    }

    await supabaseAdmin.from("email_log").insert({
      recipient_email: email,
      email_type: "consultation_booked",
      status: updateError ? "failed" : "sent",
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("[calendly webhook] Unexpected error:", err);
    return NextResponse.json({ ok: true }, { status: 200 });
  }
}
