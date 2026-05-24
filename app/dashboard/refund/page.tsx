import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { supabaseAdmin } from "@/lib/supabase";
import Link from "next/link";
import RefundForm from "./RefundForm";

export const dynamic = "force-dynamic";

function CheckIcon() {
  return (
    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

export default async function RefundPage() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profileRows }, { data: moduleProgressRows }] = await Promise.all([
    supabaseAdmin.from("profiles").select("purchased_at, login_dates").eq("id", user.id).limit(1),
    supabaseAdmin.from("module_progress").select("completed_at").eq("user_id", user.id),
  ]);

  const profile = profileRows?.[0];
  if (!profile?.purchased_at) redirect("/");

  const daysSincePurchase = Math.floor(
    (Date.now() - new Date(profile.purchased_at).getTime()) / 86_400_000
  );
  const modulesCompleted = (moduleProgressRows ?? []).filter((r) => r.completed_at != null).length;
  const loginDates: string[] = Array.isArray(profile.login_dates) ? profile.login_dates : [];
  const uniqueLoginDays = loginDates.length;

  const metDays = daysSincePurchase >= 90;
  const metModules = modulesCompleted >= 7;
  const metLogins = uniqueLoginDays >= 10;
  const allMet = metDays && metModules && metLogins;

  // All criteria met — show the refund form
  if (allMet) {
    return <RefundForm />;
  }

  // Past 90 days but criteria not met — window expired
  if (daysSincePurchase > 90) {
    return (
      <div className="max-w-lg mx-auto pt-4">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8">
          <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-amber-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-3 text-center">Guarantee Period Expired</h2>
          <p className="text-gray-600 text-sm leading-relaxed text-center">
            Your 90-day guarantee period has expired. Refunds are only available to members who completed the full program within 90 days.
          </p>
          <Link
            href="/dashboard"
            className="mt-6 block w-full text-center bg-teal-500 hover:bg-teal-700 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            Back to My Program
          </Link>
        </div>
      </div>
    );
  }

  // Within 90 days but criteria not yet met — show progress card
  const requirements = [
    {
      label: "Member for 90+ days",
      met: metDays,
      progress: `${daysSincePurchase} of 90 days complete`,
    },
    {
      label: "All 7 modules completed",
      met: metModules,
      progress: `${modulesCompleted} of 7 modules complete`,
    },
    {
      label: "Active for 10+ days",
      met: metLogins,
      progress: `${uniqueLoginDays} of 10 days logged in`,
    },
  ];

  return (
    <div className="max-w-lg mx-auto pt-4">
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-xl font-bold text-gray-900 mb-1">Refund Qualification Status</h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            To qualify for your 90-day money-back guarantee you must meet all three requirements below.
          </p>
        </div>

        <div className="p-6 space-y-4">
          {requirements.map((req) => (
            <div key={req.label} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50">
              {req.met ? <CheckIcon /> : <XIcon />}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800">{req.label}</p>
                <p className={`text-xs mt-0.5 ${req.met ? "text-green-600" : "text-gray-500"}`}>
                  {req.progress}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 pb-6">
          <p className="text-sm text-gray-500 mb-5 text-center">
            Keep going! Complete the requirements above to qualify for your refund.
          </p>
          <Link
            href="/dashboard"
            className="block w-full text-center bg-teal-500 hover:bg-teal-700 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            Back to My Program
          </Link>
        </div>
      </div>
    </div>
  );
}
