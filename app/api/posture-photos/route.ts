import { NextResponse } from "next/server";
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
    .from("posture_photos")
    .select("*")
    .eq("user_id", user.id)
    .order("photo_date", { ascending: false });

  if (error) {
    console.error("[posture-photos GET]", error);
    return NextResponse.json({ error: "Could not fetch photos." }, { status: 500 });
  }

  const photosWithUrls = await Promise.all(
    (data ?? []).map(async (photo) => {
      const { data: signed } = await supabaseAdmin.storage
        .from("posture-photos")
        .createSignedUrl(photo.photo_url, 3600);
      return { ...photo, signed_url: signed?.signedUrl ?? null };
    })
  );

  return NextResponse.json(photosWithUrls);
}
