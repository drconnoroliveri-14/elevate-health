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

  // Fetch current module's progress row
  const { data: progress, error: progressError } = await supabaseAdmin
    .from("module_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("module_number", moduleNumber)
    .maybeSingle();

  console.log(`[modules/access] progress row:`, JSON.stringify(progress), "error:", JSON.stringify(progressError));

  // Surface admin query errors instead of silently treating them as "no row"
  if (progressError) {
    console.error("[modules/access] supabaseAdmin query failed:", progressError);
    return NextResponse.json({ error: "Database error.", locked: true }, { status: 500 });
  }

  // No row yet → locked (no scheduled unlock date known)
  if (!progress) {
    console.log(`[modules/access] no progress row found for userId=${userId} module=${moduleNumber} — locked`);
    return NextResponse.json({
      locked: true,
      locked_until: null,
      module: null,
      all_progress: await fetchAll(),
    });
  }

  // Unlock date is in the future → locked (null/missing = treat as already unlocked)
  // Guard against Invalid Date — Postgres "+00" suffix without colon may parse oddly.
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

  // ── Module is accessible ─────────────────────────────────────────────────

  // Stamp first access
  if (!progress.first_accessed_at) {
    await supabaseAdmin
      .from("module_progress")
      .update({ first_accessed_at: now.toISOString() })
      .eq("user_id", userId)
      .eq("module_number", moduleNumber);
  }

  // Schedule / unlock the next module (modules 1–6 only)
  if (moduleNumber < 7) {
    const { data: nextProgress } = await supabaseAdmin
      .from("module_progress")
      .select("id, unlocked_at")
      .eq("user_id", userId)
      .eq("module_number", moduleNumber + 1)
      .maybeSingle();

    if (!nextProgress) {
      // Check if the previous module was accessed 7+ days ago
      let nextUnlockAt: string;

      if (moduleNumber > 1) {
        const { data: prevProgress } = await supabaseAdmin
          .from("module_progress")
          .select("first_accessed_at")
          .eq("user_id", userId)
          .eq("module_number", moduleNumber - 1)
          .maybeSingle();

        const prevAccessed = prevProgress?.first_accessed_at
          ? new Date(prevProgress.first_accessed_at)
          : null;

        if (
          prevAccessed &&
          now.getTime() - prevAccessed.getTime() >= SEVEN_DAYS_MS
        ) {
          // 7-day window already elapsed — next module unlocks immediately
          nextUnlockAt = now.toISOString();
        } else {
          nextUnlockAt = new Date(now.getTime() + SEVEN_DAYS_MS).toISOString();
        }
      } else {
        // Module 1 has no predecessor — schedule module 2 for 7 days from now
        nextUnlockAt = new Date(now.getTime() + SEVEN_DAYS_MS).toISOString();
      }

      await supabaseAdmin.from("module_progress").insert({
        user_id: userId,
        module_number: moduleNumber + 1,
        unlocked_at: nextUnlockAt,
      });
    }
  }

  // Return fresh data
  const { data: updatedModule } = await supabaseAdmin
    .from("module_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("module_number", moduleNumber)
    .single();

  return NextResponse.json({
    locked: false,
    locked_until: null,
    module: updatedModule,
    all_progress: await fetchAll(),
  });
}
