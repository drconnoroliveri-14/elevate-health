import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: { module_number?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const moduleNumber = Number(body.module_number);
  if (!Number.isInteger(moduleNumber) || moduleNumber < 1 || moduleNumber > 7) {
    return NextResponse.json(
      { error: "module_number must be 1–7." },
      { status: 400 }
    );
  }

  const { error } = await supabaseAdmin
    .from("module_progress")
    .update({ completed_at: new Date().toISOString() })
    .eq("user_id", user.id)
    .eq("module_number", moduleNumber)
    .is("completed_at", null);

  if (error) {
    console.error("[modules/complete]", error);
    return NextResponse.json(
      { error: "Could not mark module complete." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
