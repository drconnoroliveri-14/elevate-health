import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { error } = await supabaseAdmin
    .from("profiles")
    .update({ password_changed: true })
    .eq("id", user.id);

  if (error) {
    console.error("[profile/password-changed] update error:", error);
    return NextResponse.json({ error: "Could not update profile." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
