import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json([], { status: 200 });

  const { data, error } = await supabaseAdmin
    .from("shopping_list_progress")
    .select("item_key, checked")
    .eq("user_id", userId);

  if (error) {
    console.error("[shopping-list GET]", error);
    return NextResponse.json([], { status: 200 });
  }

  return NextResponse.json(data ?? [], { status: 200 });
}

export async function POST(req: NextRequest) {
  const { userId, item_key, checked } = await req.json().catch(() => ({}));
  if (!userId || !item_key) {
    return NextResponse.json({ error: "Missing fields." }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("shopping_list_progress")
    .upsert(
      { user_id: userId, item_key, checked, updated_at: new Date().toISOString() },
      { onConflict: "user_id,item_key" }
    );

  if (error) {
    console.error("[shopping-list POST]", error);
    return NextResponse.json({ error: "Could not save." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
