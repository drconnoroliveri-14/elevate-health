import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/auth-helpers-nextjs";
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

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) redirect("/login");

  const [{ data: profile }, { data: moduleProgress }] = await Promise.all([
    supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single(),
    supabase
      .from("module_progress")
      .select("*")
      .eq("user_id", session.user.id)
      .order("module_number"),
  ]);

  return (
    <DashboardShell
      profile={profile as Profile | null}
      moduleProgress={(moduleProgress as ModuleProgress[]) ?? []}
      userEmail={session.user.email ?? ""}
    >
      {children}
    </DashboardShell>
  );
}
