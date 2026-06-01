import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const { data: profileRows } = await supabaseAdmin.from("profiles").select("role").eq("id", user.id).limit(1);
  const profile = profileRows?.[0] ?? null;
  if (profile?.role !== "admin") return NextResponse.json({ error: "Forbidden." }, { status: 403 });

  const [
    { data: purchasedProfiles }, { count: totalLeads }, { data: allProgress }, { data: allLeads }, { data: recentPurchases }, { data: studentProfiles },
  ] = await Promise.all([
    supabaseAdmin.from("profiles").select("id, full_name, email, purchased_at").not("purchased_at", "is", null),
    supabaseAdmin.from("leads").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("module_progress").select("user_id, completed_at").not("completed_at", "is", null),
    supabaseAdmin.from("leads").select("email, full_name, created_at, purchased").order("created_at", { ascending: false }),
    supabaseAdmin.from("profiles").select("full_name, email, purchased_at").not("purchased_at", "is", null).order("purchased_at", { ascending: false }).limit(10),
    supabaseAdmin.from("profiles").select("id, full_name, email").not("purchased_at", "is", null),
  ]);

  const totalStudents = purchasedProfiles?.length ?? 0;
  const totalRevenue = totalStudents * 997;

  const completedByUser: Record<string, number> = {};
  for (const row of allProgress ?? []) completedByUser[row.user_id] = (completedByUser[row.user_id] ?? 0) + 1;

  const studentIds = (purchasedProfiles ?? []).map((p) => p.id);
  const completionRates = studentIds.map((id) => ((completedByUser[id] ?? 0) / 7) * 100);
  const avgCompletionRate = completionRates.length > 0 ? Math.round(completionRates.reduce((a, b) => a + b, 0) / completionRates.length) : 0;

  const lastActiveLookup: Record<string, string> = {};
  const { data: allProgressFull } = await supabaseAdmin.from("module_progress").select("user_id, completed_at, first_accessed_at, unlocked_at").in("user_id", studentIds);
  for (const row of allProgressFull ?? []) {
    const timestamps = [row.completed_at, row.first_accessed_at, row.unlocked_at].filter(Boolean) as string[];
    if (!timestamps.length) continue;
    const latest = timestamps.sort().at(-1)!;
    if (!lastActiveLookup[row.user_id] || latest > lastActiveLookup[row.user_id]) lastActiveLookup[row.user_id] = latest;
  }

  const studentProgress = (studentProfiles ?? []).map((s) => ({
    full_name: s.full_name ?? s.email, email: s.email, modules_completed: completedByUser[s.id] ?? 0, last_active: lastActiveLookup[s.id] ?? null,
  }));

  return NextResponse.json({ total_revenue: totalRevenue, total_students: totalStudents, total_leads: totalLeads ?? 0, avg_completion_rate: avgCompletionRate, recent_purchases: recentPurchases ?? [], leads: allLeads ?? [], student_progress: studentProgress }, { status: 200 });
}