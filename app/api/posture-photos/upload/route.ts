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

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }

  const file = formData.get("photo") as File | null;
  const view_type = formData.get("view_type") as string | null;
  const photo_date = formData.get("photo_date") as string | null;
  const day_number = formData.get("day_number") ? Number(formData.get("day_number")) : null;
  const notes = (formData.get("notes") as string | null) || null;

  if (!file || !view_type || !photo_date) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  if (!["front", "side", "back"].includes(view_type)) {
    return NextResponse.json({ error: "Invalid view_type." }, { status: 400 });
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const storagePath = `${user.id}/${photo_date}-${view_type}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();

  const { error: uploadError } = await supabaseAdmin.storage
    .from("posture-photos")
    .upload(storagePath, arrayBuffer, {
      contentType: file.type || "image/jpeg",
      upsert: true,
    });

  if (uploadError) {
    console.error("[posture-photos upload]", uploadError);
    return NextResponse.json({ error: "Storage upload failed." }, { status: 500 });
  }

  const { data, error: dbError } = await supabaseAdmin
    .from("posture_photos")
    .upsert(
      {
        user_id: user.id,
        photo_url: storagePath,
        photo_date,
        day_number,
        view_type,
        notes,
      },
      { onConflict: "user_id,photo_date,view_type" }
    )
    .select()
    .single();

  if (dbError) {
    console.error("[posture-photos db insert]", dbError);
    return NextResponse.json({ error: "Could not save photo record." }, { status: 500 });
  }

  const { data: signed } = await supabaseAdmin.storage
    .from("posture-photos")
    .createSignedUrl(storagePath, 3600);

  return NextResponse.json({ ...data, signed_url: signed?.signedUrl ?? null });
}
