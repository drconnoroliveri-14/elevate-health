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
  const metLogins = uniqueLoginDays >= 30;
  const allMet = metDays && metModules && metLogins;

  const tooEarly = daysSincePurchase < 90;
  const inRefundWindow = daysSincePurchase >= 90 && daysSincePurchase < 120;
  const windowClosed = daysSincePurchase >= 120;

  const daysRemainingInWindow = Math.max(0, 120 - daysSincePurchase);
  const windowCloseDate = new Date(new Date(profile.purchased_at).getTime() + 120 * 86_400_000)
    .toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

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
      label: "Active for 30+ days",
      met: metLogins,
      progress: `${uniqueLoginDays} of 30 days logged in`,
    },
  ];

  // ── State 1: Too early (days 0–89) ────────────────────────────────────────
  if (tooEarly) {
    const windowOpenDate = new Date(new Date(profile.purchased_at).getTime() + 90 * 86_400_000)
      .toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

    const requirementsWithDates = [
      {
        label: "Member for 90+ days",
        met: metDays,
        progress: `${daysSincePurchase} of 90 days complete. Refund window opens on ${windowOpenDate}.`,
      },
      {
        label: "All 7 modules completed",
        met: metModules,
        progress: `${modulesCompleted} of 7 modules complete`,
      },
      {
        label: "Active for 30+ days",
        met: metLogins,
        progress: `${uniqueLoginDays} of 30 days logged in`,
      },
    ];

    return (
      <div className="max-w-lg mx-auto pt-4">
        <div className="bg-blue-50 border border-blue-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-blue-100 flex items-start gap-4">
            <span className="text-3xl flex-shrink-0">🛡️</span>
            <div>
              <h1 className="text-xl font-bold text-gray-900 mb-2">Refund Not Yet Available</h1>
              <p className="text-sm text-gray-600 leading-relaxed">
                Thank you for being part of the Elevate Pain-Free Program. Our 90-day money-back guarantee is designed to give you the full program experience before evaluating your results. Your refund window will open on <strong>{windowOpenDate}</strong> provided you have completed all 7 modules and logged in for at least 30 days. Here is your current progress toward qualifying:
              </p>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {requirementsWithDates.map((req) => (
              <div key={req.label} className="flex items-center gap-4 p-4 rounded-xl bg-white border border-blue-100">
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
              Complete the program fully and your refund option will be available between days 90 and 120 of your membership if needed.
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

  // ── State 3: Window permanently closed (day 120+) ─────────────────────────
  if (windowClosed) {
    return (
      <div className="max-w-lg mx-auto pt-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-5">
            <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">Refund Window Has Closed</h2>
          <p className="text-gray-600 text-sm leading-relaxed text-center mb-6">
            Thank you for being part of the Elevate Pain-Free Program. Our 90-day money-back guarantee was available between days 90 and 119 of your membership — a window designed to give you time to complete the full program and evaluate your results. Unfortunately that window has now passed and we are unable to process refund requests at this time.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed text-center mb-6">
            We genuinely want you to succeed and get the results you came here for. If you are still experiencing challenges with the program please reach out to us and our team will personally help you get back on track. We believe in this program and we believe in you.
          </p>
          <div className="flex flex-col gap-3">
            <a
              href="mailto:info@elevatehealthtampa.com"
              className="block w-full text-center bg-teal-500 hover:bg-teal-700 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Contact Support
            </a>
            <Link
              href="/dashboard"
              className="block w-full text-center bg-teal-50 hover:bg-teal-100 text-teal-700 font-semibold py-3 rounded-xl transition-colors"
            >
              Back to My Program
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── State 2a: Window open + all criteria met ──────────────────────────────
  if (inRefundWindow && allMet) {
    return (
      <div className="max-w-lg mx-auto pt-4">
        <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-4 mb-6 flex items-center gap-3">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          <p className="text-green-800 font-semibold text-sm">You qualify for a refund</p>
        </div>
        <RefundForm />
      </div>
    );
  }

  // ── State 2b: Window open + criteria NOT met ──────────────────────────────
  return (
    <div className="max-w-lg mx-auto pt-4">
      <div className="bg-amber-50 border border-amber-300 rounded-xl px-5 py-4 mb-6 flex items-start gap-3">
        <span className="text-amber-500 text-lg flex-shrink-0">⚠️</span>
        <p className="text-amber-800 font-semibold text-sm">
          Your refund window is open but closes in {daysRemainingInWindow} {daysRemainingInWindow === 1 ? "day" : "days"}
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-xl font-bold text-gray-900 mb-1">Complete Your Requirements to Qualify</h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            You are in your refund eligibility window which closes on {windowCloseDate}. Please complete the following requirements before that date to qualify:
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
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-5">
            <p className="text-sm text-amber-800 text-center">
              You have <strong>{daysRemainingInWindow} {daysRemainingInWindow === 1 ? "day" : "days"}</strong> remaining to complete the requirements and submit your refund request.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="block w-full text-center bg-teal-500 hover:bg-teal-700 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            Back to My Program — Let us help you succeed
          </Link>
        </div>
      </div>
    </div>
  );
}
