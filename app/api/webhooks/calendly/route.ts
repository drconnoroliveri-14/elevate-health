import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { resend } from "@/lib/resend";

export const dynamic = "force-dynamic";

const FROM = "Dr. Connor Oliveri <droliveri@elevatehealthtampa.com>";
const REPLY_TO = "droliveri@elevatehealthtampa.com";

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
      .select("id, email, full_name")
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

      // Send cancellation email
      const html = `
        <p>Hi ${firstName},</p>
        <p>Your 15-minute consultation with Dr. Oliveri has been cancelled. Please use the link below to reschedule at a time that works for you.</p>
        <p><strong>Booking Link:</strong><br>
        <a href="https://calendly.com/drconnoroliveri/15min-pain-free-consultation">https://calendly.com/drconnoroliveri/15min-pain-free-consultation</a></p>
        <p>If you have any questions please contact us at <a href="mailto:droliveri@elevatehealthtampa.com">droliveri@elevatehealthtampa.com</a></p>
        <p>— Dr. Connor Oliveri &amp; The Elevate Health Team</p>
      `.trim();
      const text = `Hi ${firstName},

Your 15-minute consultation with Dr. Oliveri has been cancelled. Please use the link below to reschedule at a time that works for you.

Booking Link: https://calendly.com/drconnoroliveri/15min-pain-free-consultation

If you have any questions please contact us at droliveri@elevatehealthtampa.com

— Dr. Connor Oliveri & The Elevate Health Team`;

      const { error: emailError } = await resend.emails.send({
        from: FROM,
        replyTo: REPLY_TO,
        to: email,
        subject: "Your Consultation Has Been Cancelled",
        html,
        text,
      });

      if (emailError) {
        console.error("[calendly webhook] Cancellation email error:", emailError);
      }

      await supabaseAdmin.from("email_log").insert({
        recipient_email: email,
        email_type: "consultation_cancelled",
        status: emailError ? "failed" : "sent",
      });

      return NextResponse.json({ ok: true }, { status: 200 });
    }

    // ── Booking (invitee.created or any other event) ──────────────────────────
    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({ consultation_booked: true, consultation_cancelled: false })
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
    // Always return 200 so Calendly does not retry
    return NextResponse.json({ ok: true }, { status: 200 });
  }
}
