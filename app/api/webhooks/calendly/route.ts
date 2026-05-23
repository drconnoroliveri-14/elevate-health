import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

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
      .select("id, email")
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

    // Mark consultation as booked
    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({ consultation_booked: true })
      .eq("id", profile.id);

    if (updateError) {
      console.error("[calendly webhook] Profile update error:", updateError.message);
    }

    // Log the event
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
