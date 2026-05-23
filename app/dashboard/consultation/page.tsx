import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { supabaseAdmin } from "@/lib/supabase";
import type { Profile } from "@/types";

export default async function ConsultationPage() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profileRows } = await supabaseAdmin
    .from("profiles")
    .select("has_consultation, full_name")
    .eq("id", user.id)
    .limit(1);

  const profile = (profileRows as Pick<Profile, "has_consultation" | "full_name">[] | null)?.[0] ?? null;

  if (!profile?.has_consultation) {
    redirect("/dashboard");
  }

  const firstName = profile.full_name?.split(" ")[0] || "there";

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <span className="inline-flex items-center gap-1.5 bg-teal-50 text-teal-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
          Premium Add-On
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Consultation</h1>
      </div>

      {/* Confirmation banner */}
      <div className="bg-teal-500 rounded-2xl p-6 mb-8 text-white text-center">
        <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h2 className="text-xl font-bold mb-1">Your Consultation is Confirmed, {firstName}!</h2>
        <p className="text-teal-100 text-sm">
          You have secured a private 15-minute Pain Relief Consultation. Use the button below to choose your preferred time.
        </p>
      </div>

      {/* Doctor card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
          <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        </div>
        <div>
          <p className="font-bold text-gray-900 text-lg">Dr. Connor Oliveri, DC</p>
          <p className="text-gray-500 text-sm">Doctor of Chiropractic · Spinal Rehabilitation Specialist</p>
          <p className="text-teal-600 text-sm font-medium mt-1">15-Minute Private Pain Relief Consultation</p>
        </div>
      </div>

      {/* Book button */}
      <div className="text-center mb-8">
        <a
          href="https://calendly.com/drconnoroliveri/15min-pain-free-consultation"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-teal-500 hover:bg-teal-700 text-white font-bold text-lg px-10 py-5 rounded-2xl transition-colors shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5m-9-6h.008v.008H12V12zm0 3h.008v.008H12V15zm0 3h.008v.008H12V18zm3-6h.008v.008H15V12zm0 3h.008v.008H15V15zm0 3h.008v.008H15V18zm-6 0h.008v.008H9V18zm0-3h.008v.008H9V15z" />
          </svg>
          Book Your Session Now →
        </a>
        <p className="text-xs text-gray-400 mt-3">You will receive a Zoom link automatically after booking.</p>
      </div>

      {/* Two column info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
        {/* What to expect */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12V17.25z" />
            </svg>
            What to Expect
          </h3>
          <ul className="space-y-3">
            {[
              "Review your specific pain pattern and history",
              "Identify your primary movement and postural dysfunctions",
              "Receive a personalized protocol recommendation",
            ].map((point) => (
              <li key={point} className="flex items-start gap-3 text-sm text-gray-700">
                <svg className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                {point}
              </li>
            ))}
          </ul>
        </div>

        {/* How to prepare */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125V18.75m-7.5-10.5v10.5" />
            </svg>
            How to Prepare
          </h3>
          <ul className="space-y-3">
            {[
              "Have your Pain Tracking Journal ready",
              "Be in a quiet space with good lighting",
              "Wear comfortable clothing you can move in",
            ].map((point) => (
              <li key={point} className="flex items-start gap-3 text-sm text-gray-700">
                <svg className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Help note */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
        <p className="text-sm text-gray-500">
          Questions about your booking? Reply to your confirmation email or contact us at{" "}
          <span className="text-teal-600 font-medium">support@elevatehealth.com</span>
        </p>
      </div>
    </div>
  );
}
