import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { resend } from "@/lib/resend";
import { nurtureEmail1 } from "@/lib/emails";

const FROM = "Elevate Health <hello@mail.elevatehealth.com>";

export async function POST(req: NextRequest) {
  let email: string;
  let fullName: string | undefined;
  let source: string | undefined;

  try {
    const body = await req.json();
    email = typeof body.email === "string" ? body.email.toLowerCase().trim() : "";
    fullName = typeof body.full_name === "string" ? body.full_name.trim() : undefined;
    source = typeof body.source === "string" ? body.source : "landing_page";
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  // Upsert lead — duplicate emails resolve gracefully (200 either way)
  const { error: upsertError } = await supabaseAdmin
    .from("leads")
    .upsert(
      { email, full_name: fullName ?? null, source: source ?? "landing_page", purchased: false },
      { onConflict: "email" }
    );

  if (upsertError) {
    console.error("[leads] Supabase upsert:", upsertError);
    return NextResponse.json({ error: "Could not save your details." }, { status: 500 });
  }

  // Send Email 1 of the pre-purchase nurture sequence
  const firstName = fullName?.split(" ")[0] ?? "";
  const emailContent = nurtureEmail1(firstName);

  const { error: sendError } = await resend.emails.send({
    from: FROM,
    to: email,
    subject: emailContent.subject,
    html: emailContent.html,
  });

  if (sendError) {
    console.error("[leads] Resend error (non-fatal):", sendError);
    // Non-fatal: lead was saved; email failure shouldn't block the response
  }

  // Log the email attempt
  await supabaseAdmin.from("email_log").insert({
    recipient_email: email,
    email_type: "nurture_1",
    status: sendError ? "failed" : "sent",
  });

  return NextResponse.json({ success: true }, { status: 200 });
}
