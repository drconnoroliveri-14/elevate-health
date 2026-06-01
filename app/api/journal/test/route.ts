import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// Diagnostic endpoint: GET /api/journal/test
// Returns full Supabase diagnostics — auth status, table existence, and a test upsert.
export async function GET() {
  const results: Record<string, unknown> = {};

  // 1. Auth check
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  results.auth = {
    authenticated: !!user,
    userId: user?.id ?? null,
    authError: authError ? { message: authError.message } : null,
  };

  const testUserId = user?.id ?? "00000000-0000-0000-0000-000000000000";
  const testDate = "1970-01-01";

  // 2. Table existence check
  const { data: selectData, error: selectError } = await supabaseAdmin
    .from("pain_journal")
    .select("id")
    .limit(1);

  results.tableCheck = {
    success: !selectError,
    rowsFetched: selectData?.length ?? 0,
    error: selectError ? {
      message: selectError.message,
      code: selectError.code,
      details: selectError.details,
      hint: selectError.hint,
    } : null,
  };

  // 3. Test upsert with actual column names
  const { data: upsertData, error: upsertError } = await supabaseAdmin
    .from("pain_journal")
    .upsert(
      {
        user_id: testUserId,
        entry_date: testDate,
        morning_neck: 0,
        morning_mid_back: 0,
        morning_lower_back: 0,
        evening_neck: 0,
        evening_mid_back: 0,
        evening_lower_back: 0,
        exercises_completed: false,
        notes: "diagnostic test row",
      },
      { onConflict: "user_id,entry_date" }
    )
    .select()
    .single();

  results.upsertTest = {
    success: !upsertError,
    insertedId: upsertData?.id ?? null,
    error: upsertError ? {
      message: upsertError.message,
      code: upsertError.code,
      details: upsertError.details,
      hint: upsertError.hint,
    } : null,
  };

  // 4. Clean up test row
  if (upsertData?.id) {
    const { error: deleteError } = await supabaseAdmin
      .from("pain_journal")
      .delete()
      .eq("id", upsertData.id);
    results.cleanup = { success: !deleteError, error: deleteError?.message ?? null };
  }

  // 5. Env var check
  results.env = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? "set" : "MISSING",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "set" : "MISSING",
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? "set" : "MISSING",
  };

  return NextResponse.json(results, { status: 200 });
}
