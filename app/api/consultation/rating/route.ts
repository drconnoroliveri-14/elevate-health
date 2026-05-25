import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { rating?: unknown; feedback?: unknown } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const rating = typeof body.rating === "number" ? body.rating : null;
  const feedback = typeof body.feedback === "string" ? body.feedback.trim() : null;

  if (!rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating must be between 1 and 5." }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from("consultation_ratings").insert({
    user_id: user.id,
    rating,
    feedback: feedback || null,
  });

  if (error) {
    console.error("[consultation/rating] Insert error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await supabaseAdmin.from("profiles").update({ consultation_rated: true }).eq("id", user.id);

  return NextResponse.json({ ok: true });
}
