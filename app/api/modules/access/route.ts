import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: { module_number?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const moduleNumber = Number(body.module_number);
  if (!Number.isInteger(moduleNumber) || moduleNumber < 1 || moduleNumber > 7) {
    return NextResponse.json(
      { error: "module_number must be 1–7." },
      { status: 400 }
    );
  }

  const userId = session.user.id;

  // Fetch this module's progress row
  const { data: progress } = await supabaseAdmin
    .from("module_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("module_number", moduleNumber)
    .maybeSingle();

  const fetchAll = () =>
    supabaseAdmin
      .from("module_progress")
      .select("*")
      .eq("user_id", userId)
      .order("module_number");

  // No row → not yet scheduled (locked)
  if (!progress) {
    const { data: allProgress } = await fetchAll();
    return NextResponse.json({
      locked: true,
      locked_until: null,
      module: null,
      all_progress: allProgress ?? [],
    });
  }

  const now = new Date();
  const unlockDate = new Date(progress.unlocked_at);

  // Future unlock date → locked
  if (unlockDate > now) {
    const { data: allProgress } = await fetchAll();
    return NextResponse.json({
      locked: true,
      locked_until: progress.unlocked_at,
      module: progress,
      all_progress: allProgress ?? [],
    });
  }

  // First access — stamp it and schedule the next module's unlock
  if (!progress.first_accessed_at) {
    await supabaseAdmin
      .from("module_progress")
      .update({ first_accessed_at: now.toISOString() })
      .eq("user_id", userId)
      .eq("module_number", moduleNumber);

    if (moduleNumber < 7) {
      const nextUnlock = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      const { data: existing } = await supabaseAdmin
        .from("module_progress")
        .select("id")
        .eq("user_id", userId)
        .eq("module_number", moduleNumber + 1)
        .maybeSingle();

      if (!existing) {
        await supabaseAdmin.from("module_progress").insert({
          user_id: userId,
          module_number: moduleNumber + 1,
          unlocked_at: nextUnlock.toISOString(),
        });
      }
    }
  }

  // Return fresh data
  const { data: updatedModule } = await supabaseAdmin
    .from("module_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("module_number", moduleNumber)
    .single();

  const { data: allProgress } = await fetchAll();

  return NextResponse.json({
    locked: false,
    locked_until: null,
    module: updatedModule,
    all_progress: allProgress ?? [],
  });
}
