import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { supabaseAdmin } from "@/lib/supabase";

async function getAuthUser() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function GET() {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from("pain_journal")
    .select("*")
    .eq("user_id", user.id)
    .order("entry_date", { ascending: false });

  if (error) {
    console.error("[journal GET]", error);
    return NextResponse.json({ error: "Could not fetch entries." }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { entry_date, neck_pain, mid_back_pain, lower_back_pain, notes } = body;

  if (!entry_date) {
    return NextResponse.json({ error: "entry_date is required." }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("pain_journal")
    .upsert(
      {
        user_id: user.id,
        entry_date,
        neck_pain: neck_pain ?? null,
        mid_back_pain: mid_back_pain ?? null,
        lower_back_pain: lower_back_pain ?? null,
        notes: notes ?? null,
      },
      { onConflict: "user_id,entry_date" }
    )
    .select()
    .single();

  if (error) {
    console.error("[journal POST]", error);
    return NextResponse.json({ error: "Could not save entry." }, { status: 500 });
  }

  return NextResponse.json(data);
}
