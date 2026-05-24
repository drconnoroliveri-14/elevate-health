import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { supabaseAdmin } from "@/lib/supabase";

// Next.js App Router streams multipart natively — no bodyParser config needed.
export const dynamic = "force-dynamic";

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
  // ── 1. Auth check ────────────────────────────────────────────────────────
  const user = await getAuthUser();
  if (!user) {
    console.error("[posture-upload] No authenticated user");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  console.log("[posture-upload] user.id:", user.id);

  // ── 2. Parse multipart form ───────────────────────────────────────────────
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch (err) {
    console.error("[posture-upload] formData parse error:", err);
    return NextResponse.json({ error: "Could not parse form data." }, { status: 400 });
  }

  const file = formData.get("photo") as File | null;
  const view_type = formData.get("view_type") as string | null;
  const photo_date = formData.get("photo_date") as string | null;
  const day_number = formData.get("day_number") ? Number(formData.get("day_number")) : null;
  const notes = (formData.get("notes") as string | null) || null;

  console.log("[posture-upload] fields:", {
    hasFile: !!file,
    fileName: file?.name,
    fileSize: file?.size,
    fileType: file?.type,
    view_type,
    photo_date,
    day_number,
  });

  if (!file || !view_type || !photo_date) {
    const missing = [!file && "photo", !view_type && "view_type", !photo_date && "photo_date"].filter(Boolean);
    console.error("[posture-upload] Missing fields:", missing);
    return NextResponse.json({ error: `Missing required fields: ${missing.join(", ")}` }, { status: 400 });
  }

  if (!["front", "side", "back"].includes(view_type)) {
    console.error("[posture-upload] Invalid view_type:", view_type);
    return NextResponse.json({ error: `Invalid view_type: ${view_type}` }, { status: 400 });
  }

  // ── 3. Read file buffer ───────────────────────────────────────────────────
  let arrayBuffer: ArrayBuffer;
  try {
    arrayBuffer = await file.arrayBuffer();
  } catch (err) {
    console.error("[posture-upload] arrayBuffer error:", err);
    return NextResponse.json({ error: "Could not read file data." }, { status: 400 });
  }
  console.log("[posture-upload] buffer size:", arrayBuffer.byteLength, "bytes");

  if (arrayBuffer.byteLength === 0) {
    console.error("[posture-upload] Empty file buffer");
    return NextResponse.json({ error: "Uploaded file is empty." }, { status: 400 });
  }

  // ── 4. Upload to Supabase Storage ─────────────────────────────────────────
  const storagePath = `${user.id}/${photo_date}-${view_type}.jpg`;
  console.log("[posture-upload] uploading to storage path:", storagePath);

  const { data: storageData, error: uploadError } = await supabaseAdmin.storage
    .from("posture-photos")
    .upload(storagePath, arrayBuffer, {
      contentType: "image/jpeg",
      upsert: true,
    });

  if (uploadError) {
    console.error("[posture-upload] Storage upload error:", {
      message: uploadError.message,
      name: uploadError.name,
      cause: (uploadError as { cause?: unknown }).cause,
    });
    return NextResponse.json(
      { error: `Storage upload failed: ${uploadError.message}` },
      { status: 500 }
    );
  }
  console.log("[posture-upload] storage upload ok:", storageData?.path);

  // ── 5. Insert DB record ───────────────────────────────────────────────────
  const { data, error: dbError } = await supabaseAdmin
    .from("posture_photos")
    .upsert(
      { user_id: user.id, photo_url: storagePath, photo_date, day_number, view_type, notes },
      { onConflict: "user_id,photo_date,view_type" }
    )
    .select()
    .single();

  if (dbError) {
    console.error("[posture-upload] DB upsert error:", {
      message: dbError.message,
      code: dbError.code,
      details: dbError.details,
    });
    return NextResponse.json(
      { error: `Database error: ${dbError.message}` },
      { status: 500 }
    );
  }

  // ── 6. Generate signed URL ────────────────────────────────────────────────
  const { data: signed, error: signedErr } = await supabaseAdmin.storage
    .from("posture-photos")
    .createSignedUrl(storagePath, 3600);

  if (signedErr) {
    console.error("[posture-upload] Signed URL error:", signedErr.message);
  }

  console.log("[posture-upload] success for", storagePath);
  return NextResponse.json({ ...data, signed_url: signed?.signedUrl ?? null });
}
