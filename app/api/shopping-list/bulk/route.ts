import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { userId, keys, checked } = await req.json().catch(() => ({}));
  if (!userId || !Array.isArray(keys)) {
    return NextResponse.json({ error: "Missing fields." }, { status: 400 });
  }

  const now = new Date().toISOString();
  const rows = (keys as string[]).map((item_key) => ({
    user_id: userId,
    item_key,
    checked: !!checked,
    updated_at: now,
  }));

  const { error } = await supabaseAdmin
    .from("shopping_list_progress")
    .upsert(rows, { onConflict: "user_id,item_key" });

  if (error) {
    console.error("[shopping-list/bulk POST]", error);
    return NextResponse.json({ error: "Could not save." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
