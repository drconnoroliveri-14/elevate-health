import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { supabaseAdmin } from "@/lib/supabase";
import type { Profile, ModuleProgress } from "@/types";
import DashboardShell from "./DashboardShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profileRows }, { data: moduleProgress }] = await Promise.all([
    supabaseAdmin.from("profiles").select("*").eq("id", user.id).limit(1),
    supabaseAdmin.from("module_progress").select("*").eq("user_id", user.id).order("module_number"),
  ]);

  const profile = (profileRows as Profile[] | null)?.[0] ?? null;

  if (!profile?.purchased_at) redirect("/");

  const today = new Date().toISOString().split("T")[0];
  const currentLoginDates: string[] = Array.isArray(profile.login_dates) ? profile.login_dates : [];
  const newLoginDates = currentLoginDates.includes(today) ? currentLoginDates : [...currentLoginDates, today];

  const { data: loginUpdateData, error: loginUpdateError } = await supabaseAdmin
    .from("profiles")
    .update({ last_login: new Date().toISOString(), login_dates: newLoginDates })
    .eq("id", user.id)
    .select("login_dates")
    .single();

  if (loginUpdateError) {
    console.error("[dashboard/layout] login_dates update failed:", loginUpdateError);
  } else {
    console.log("[dashboard/layout] login_dates updated successfully:", loginUpdateData?.login_dates);
  }

  return (
    <DashboardShell
      profile={profile}
      moduleProgress={(moduleProgress as ModuleProgress[]) ?? []}
      userEmail={user.email ?? ""}
    >
      {children}
    </DashboardShell>
  );
}
