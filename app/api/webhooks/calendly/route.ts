import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { resend } from "@/lib/resend";

export const dynamic = "force-dynamic";
const FROM = "Dr. Connor Oliveri <droliveri@elevatehealthtampa.com>";
const REPLY_TO = "droliveri@elevatehealthtampa.com";
const COMPLETION_EVENTS = new Set(["invitee_no_show.created"]);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const eventType: string | undefined = body?.event;
    const email: string | undefined = body?.payload?.invitee?.email ?? body?.payload?.email;
    if (!email) { console.warn("[calendly webhook] No invitee email found in payload"); return NextResponse.json({ ok: true }, { status: 200 }); }
    const { data: profileRows, error: lookupError } = await supabaseAdmin.from("profiles").select("id, email, full_name, consultation_count").eq("email", email).limit(1);
    if (lookupError) { console.error("[calendly webhook] Profile lookup error:", lookupError.message); return NextResponse.json({ ok: true }, { status: 200 }); }
    const profile = profileRows?.[0];
    if (!profile) { console.warn("[calendly webhook] No profile found for email:", email); return NextResponse.json({ ok: true }, { status: 200 }); }
    const firstName = profile.full_name?.split(" ")[0] || "there";

    if (eventType === "invitee.canceled") {
      await supabaseAdmin.from("profiles").update({ consultation_booked: false, consultation_cancelled: true }).eq("id", profile.id);
      const html = `<p>Hi ${firstName},</p><p>Your 15-minute consultation with Dr. Oliveri has been cancelled. You can rebook at <a href="https://calendly.com/drconnoroliveri/15min-pain-free-consultation">https://calendly.com/drconnoroliveri/15min-pain-free-consultation</a></p><p>— Dr. Connor Oliveri &amp; The Elevate Health Team</p>`;
      const { error: emailError } = await resend.emails.send({ from: FROM, replyTo: REPLY_TO, to: email, subject: "Your Consultation Has Been Cancelled", html, text: `Hi ${firstName}, your consultation has been cancelled. Rebook at https://calendly.com/drconnoroliveri/15min-pain-free-consultation` });
      await supabaseAdmin.from("email_log").insert({ recipient_email: email, email_type: "consultation_cancelled", status: emailError ? "failed" : "sent" });
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    if (eventType && COMPLETION_EVENTS.has(eventType)) {
      const now = new Date().toISOString();
      const newCount = (profile.consultation_count ?? 0) + 1;
      await supabaseAdmin.from("profiles").update({ consultation_completed: true, consultation_completed_at: now, consultation_booked: false, consultation_rated: false, consultation_count: newCount }).eq("id", profile.id);
      const html = `<p>Hi ${firstName},</p><p>Thank you for your consultation with Dr. Oliveri today.</p><p>— Dr. Connor Oliveri &amp; The Elevate Health Team</p>`;
      const { error: emailError } = await resend.emails.send({ from: FROM, replyTo: REPLY_TO, to: email, subject: "Thank you for your consultation with Dr. Oliveri", html, text: `Hi ${firstName}, thank you for your consultation today.` });
      await supabaseAdmin.from("email_log").insert({ recipient_email: email, email_type: "consultation_completed", status: emailError ? "failed" : "sent" });
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    const { error: updateError } = await supabaseAdmin.from("profiles").update({ consultation_booked: true, consultation_cancelled: false, consultation_completed: false }).eq("id", profile.id);
    await supabaseAdmin.from("email_log").insert({ recipient_email: email, email_type: "consultation_booked", status: updateError ? "failed" : "sent" });
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) { console.error("[calendly webhook] Unexpected error:", err); return NextResponse.json({ ok: true }, { status: 200 }); }
}