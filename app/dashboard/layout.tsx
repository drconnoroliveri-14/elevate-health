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

  // getUser() validates the JWT with Supabase Auth — safer than getSession()
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Use admin client so RLS never blocks manually-provisioned accounts.
  // User is already verified above; filtering by user.id keeps this secure.
  const [{ data: profileRows }, { data: moduleProgress }] = await Promise.all([
    supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .limit(1),
    supabaseAdmin
      .from("module_progress")
      .select("*")
      .eq("user_id", user.id)
      .order("module_number"),
  ]);

  const profile = (profileRows as Profile[] | null)?.[0] ?? null;

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
