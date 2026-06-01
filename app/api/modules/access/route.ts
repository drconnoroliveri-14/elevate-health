import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { supabaseAdmin } from "@/lib/supabase";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export async function POST(req: NextRequest) {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
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

  const userId = user.id;
  const now = new Date();

  console.log(`[modules/access] userId=${userId} module=${moduleNumber} now=${now.toISOString()}`);

  const fetchAll = async () => {
    const { data } = await supabaseAdmin
      .from("module_progress")
      .select("*")
      .eq("user_id", userId)
      .order("module_number");
    return data ?? [];
  };

  const { data: progressRows, error: progressError } = await supabaseAdmin
    .from("module_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("module_number", moduleNumber)
    .limit(1);
  const progress = progressRows?.[0] ?? null;

  console.log(`[modules/access] progress row:`, JSON.stringify(progress), "error:", JSON.stringify(progressError));

  if (progressError) {
    console.error("[modules/access] supabaseAdmin query failed:", progressError);
    return NextResponse.json({ error: "Database error.", locked: true }, { status: 500 });
  }

  if (!progress) {
    console.log(`[modules/access] no progress row found for userId=${userId} module=${moduleNumber} — locked`);
    return NextResponse.json({
      locked: true,
      locked_until: null,
      module: null,
      all_progress: await fetchAll(),
    });
  }

  const unlockedAt = progress.unlocked_at ? new Date(progress.unlocked_at) : null;
  const unlockedAtValid = unlockedAt && !isNaN(unlockedAt.getTime());
  const isStillLocked = unlockedAtValid && unlockedAt > now;

  console.log(`[modules/access] unlocked_at="${progress.unlocked_at}" parsed=${unlockedAt?.toISOString() ?? "null"} valid=${unlockedAtValid} isStillLocked=${isStillLocked}`);

  if (isStillLocked) {
    return NextResponse.json({
      locked: true,
      locked_until: progress.unlocked_at,
      module: progress,
      all_progress: await fetchAll(),
    });
  }

  if (!progress.first_accessed_at) {
    await supabaseAdmin
      .from("module_progress")
      .update({ first_accessed_at: now.toISOString() })
      .eq("user_id", userId)
      .eq("module_number", moduleNumber);
  }

  if (moduleNumber < 7) {
    const { data: nextRows } = await supabaseAdmin
      .from("module_progress")
      .select("id, unlocked_at")
      .eq("user_id", userId)
      .eq("module_number", moduleNumber + 1)
      .limit(1);
    const nextProgress = nextRows?.[0] ?? null;

    if (!nextProgress) {
      let nextUnlockAt: string;

      if (moduleNumber > 1) {
        const { data: prevRows } = await supabaseAdmin
          .from("module_progress")
          .select("first_accessed_at")
          .eq("user_id", userId)
          .eq("module_number", moduleNumber - 1)
          .limit(1);
        const prevProgress = prevRows?.[0] ?? null;

        const prevAccessed = prevProgress?.first_accessed_at
          ? new Date(prevProgress.first_accessed_at)
          : null;

        if (
          prevAccessed &&
          now.getTime() - prevAccessed.getTime() >= SEVEN_DAYS_MS
        ) {
          nextUnlockAt = now.toISOString();
        } else {
          nextUnlockAt = new Date(now.getTime() + SEVEN_DAYS_MS).toISOString();
        }
      } else {
        nextUnlockAt = new Date(now.getTime() + SEVEN_DAYS_MS).toISOString();
      }

      await supabaseAdmin.from("module_progress").insert({
        user_id: userId,
        module_number: moduleNumber + 1,
        unlocked_at: nextUnlockAt,
      });
    }
  }

  const { data: updatedRows } = await supabaseAdmin
    .from("module_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("module_number", moduleNumber)
    .limit(1);
  const updatedModule = updatedRows?.[0] ?? null;

  return NextResponse.json({
    locked: false,
    locked_until: null,
    module: updatedModule,
    all_progress: await fetchAll(),
  });
}
