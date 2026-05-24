import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// Diagnostic endpoint: GET /api/journal/test
// Returns full Supabase diagnostics — auth status, table existence check, and a test upsert.
// Remove or restrict this route once the issue is resolved.
export async function GET() {
  const results: Record<string, unknown> = {};

  // 1. Check auth
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

  if (!user) {
    results.note = "Not authenticated — test upsert will use a placeholder user_id that will fail FK constraint. Sign in first.";
  }

  const testUserId = user?.id ?? "00000000-0000-0000-0000-000000000000";
  const testDate = "1970-01-01";

  // 2. Try selecting from pain_journal (checks table exists)
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

  // 3. Try upsert with test data
  const { data: upsertData, error: upsertError } = await supabaseAdmin
    .from("pain_journal")
    .upsert(
      {
        user_id: testUserId,
        entry_date: testDate,
        neck_pain: 0,
        mid_back_pain: 0,
        lower_back_pain: 0,
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

  // 4. Clean up test row if it was created
  if (upsertData?.id) {
    const { error: deleteError } = await supabaseAdmin
      .from("pain_journal")
      .delete()
      .eq("id", upsertData.id);
    results.cleanup = { success: !deleteError, error: deleteError?.message ?? null };
  }

  // 5. Check env vars (masked)
  results.env = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? "set" : "MISSING",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "set" : "MISSING",
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? "set" : "MISSING",
  };

  return NextResponse.json(results, { status: 200 });
}
