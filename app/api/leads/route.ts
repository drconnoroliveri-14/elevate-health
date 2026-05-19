import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, full_name, source } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("leads")
      .upsert(
        { email: email.toLowerCase().trim(), full_name: full_name ?? null, source: source ?? null },
        { onConflict: "email" }
      );

    if (error) {
      console.error("[leads] Supabase error:", error);
      return NextResponse.json({ error: "Could not save your details." }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("[leads] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
