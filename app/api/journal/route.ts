import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

async function getAuthUser() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) console.error("[journal] auth.getUser error:", error.message);
  return user;
}

export async function GET() {
  const user = await getAuthUser();
  if (!user) { console.error("[journal GET] No authenticated user"); return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  console.log("[journal GET] user.id:", user.id);
  const { data, error } = await supabaseAdmin.from("pain_journal").select("*").eq("user_id", user.id).order("entry_date", { ascending: false });
  if (error) { console.error("[journal GET] Supabase error:", { message: error.message, code: error.code }); return NextResponse.json({ error: error.message }, { status: 500 }); }
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) { console.error("[journal POST] No authenticated user"); return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  let body: Record<string, unknown> = {};
  try { body = await req.json(); } catch (err) { console.error("[journal POST] JSON parse error:", err); return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 }); }
  const { entry_date, morning_neck, morning_mid_back, morning_lower_back, evening_neck, evening_mid_back, evening_lower_back, exercises_completed, notes } = body as { entry_date?: string; morning_neck?: number | null; morning_mid_back?: number | null; morning_lower_back?: number | null; evening_neck?: number | null; evening_mid_back?: number | null; evening_lower_back?: number | null; exercises_completed?: boolean | null; notes?: string | null; };
  if (!entry_date) return NextResponse.json({ error: "entry_date is required." }, { status: 400 });
  const row = { user_id: user.id, entry_date, morning_neck: morning_neck ?? null, morning_mid_back: morning_mid_back ?? null, morning_lower_back: morning_lower_back ?? null, evening_neck: evening_neck ?? null, evening_mid_back: evening_mid_back ?? null, evening_lower_back: evening_lower_back ?? null, exercises_completed: exercises_completed ?? null, notes: notes ?? null };
  const { data, error } = await supabaseAdmin.from("pain_journal").upsert(row, { onConflict: "user_id,entry_date" }).select().single();
  if (error) { console.error("[journal POST] Supabase upsert error:", { message: error.message, code: error.code }); return NextResponse.json({ error: `Database error: ${error.message}`, code: error.code }, { status: 500 }); }
  return NextResponse.json(data);
}