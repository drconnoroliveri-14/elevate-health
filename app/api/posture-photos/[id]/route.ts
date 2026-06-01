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

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Fetch the record first to get the storage path
  const { data: photo, error: fetchError } = await supabaseAdmin
    .from("posture_photos")
    .select("photo_url")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (fetchError || !photo) {
    return NextResponse.json({ error: "Photo not found." }, { status: 404 });
  }

  // Delete from storage
  await supabaseAdmin.storage.from("posture-photos").remove([photo.photo_url]);

  // Delete from DB
  const { error: dbError } = await supabaseAdmin
    .from("posture_photos")
    .delete()
    .eq("id", params.id)
    .eq("user_id", user.id);

  if (dbError) {
    console.error("[posture-photos DELETE]", dbError);
    return NextResponse.json({ error: "Could not delete photo." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
