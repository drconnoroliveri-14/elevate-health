import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { supabaseAdmin } from "@/lib/supabase";
import type { Profile } from "@/types";
import RebookButton from "./RebookButton";
import ConsultationRatingForm from "./ConsultationRatingForm";
import PurchaseConsultationButton from "./PurchaseConsultationButton";

function formatCompletedAt(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

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
    .select("has_consultation, consultation_booked, consultation_cancelled, consultation_completed, consultation_completed_at, consultation_rated, full_name")
    .eq("id", user.id)
    .limit(1);

  const profile = (profileRows as Pick<Profile, "has_consultation" | "consultation_booked" | "consultation_cancelled" | "consultation_completed" | "consultation_completed_at" | "consultation_rated" | "full_name">[] | null)?.[0] ?? null;

  const hasConsultation = !!profile?.has_consultation;

  // State priority: completed > cancelled > booked > not-yet-booked
  const isCompleted = hasConsultation && !!profile.consultation_completed;
  const wasCancelled = hasConsultation && !isCompleted && !!profile.consultation_cancelled;
  const alreadyBooked = hasConsultation && !isCompleted && !wasCancelled && !!profile.consultation_booked;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <span className="inline-flex items-center gap-1.5 bg-teal-50 text-teal-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
          Premium Add-On
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Consultation</h1>
      </div>

      {!hasConsultation ? (
        /* ── Purchase prompt ── */
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm mb-8">
          <div className="bg-gradient-to-r from-orange-500 to-orange-700 p-6 text-white relative">
            <span className="absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full bg-orange-100 text-orange-700">
              High Value
            </span>
            <div className="text-4xl mb-3">🎯</div>
            <h2 className="text-xl font-bold">Book a 1-on-1 Consultation with Dr. Oliveri</h2>
          </div>
          <div className="p-6">
            <p className="text-gray-600 text-sm leading-relaxed mb-5">
              Get a private 15-minute video call with Dr. Oliveri to review your specific pain pattern and receive a personalized protocol recommendation.
            </p>
            <ul className="space-y-2.5 mb-6">
              {[
                "Review your specific pain pattern",
                "Identify your primary muscle imbalances",
                "Get a personalized protocol recommendation",
                "Direct access to Dr. Oliveri",
              ].map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm text-gray-700">
                  <svg className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  {b}
                </li>
              ))}
            </ul>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl font-black text-teal-600">$197</span>
              <span className="text-gray-400 text-sm">one-time · instant access</span>
            </div>
            <PurchaseConsultationButton />
            <p className="text-xs text-gray-400 text-center mt-3">
              You will receive a booking link via email immediately after purchase.
            </p>
          </div>
        </div>
      ) : isCompleted ? (
        /* ── Completed state ── */
        <>
          {/* Completion card */}
          <div className="mb-6 bg-teal-50 border border-teal-200 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Consultation Completed! ✓</h3>
            <p className="text-gray-500 text-sm mb-6">
              Your consultation with Dr. Oliveri
              {profile.consultation_completed_at
                ? ` on ${formatCompletedAt(profile.consultation_completed_at)}`
                : ""}
              {" "}has been completed.
            </p>
            {profile.consultation_rated ? (
              <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
                <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                Thank you for your feedback!
              </div>
            ) : (
              <ConsultationRatingForm />
            )}
          </div>

          {/* Rebook card — emphasized with gold border */}
          <div className="bg-amber-50 border-2 border-yellow-400 rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">Ready for Your Next Session?</h3>
            <p className="text-gray-600 text-sm text-center mb-5">
              Book another 15-minute consultation with Dr. Oliveri to continue your progress.
            </p>
            <RebookButton />
          </div>
        </>
      ) : (
        /* ── Doctor card (only shown when not completed) ── */
        <>
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

          {wasCancelled ? (
            /* ── Cancelled state ── */
            <div className="mb-8 bg-amber-50 border border-amber-300 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Your Consultation Was Cancelled</h3>
              <p className="text-gray-600 text-sm mb-6 max-w-sm mx-auto">
                Your previously scheduled consultation has been cancelled. We are sorry for the inconvenience. You can book a new time directly below.
              </p>
              <a
                href="https://calendly.com/drconnoroliveri/15min-pain-free-consultation"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-teal-500 hover:bg-teal-700 text-white font-bold text-lg px-10 py-5 rounded-2xl transition-colors shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
                </svg>
                Book a New Time →
              </a>
            </div>
          ) : alreadyBooked ? (
            /* ── Booked state ── */
            <div className="mb-8 bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Your Consultation is Booked!</h3>
              <p className="text-gray-500 text-sm mb-5">
                Check your email for your Zoom link and calendar confirmation.
              </p>
              <div className="bg-white border border-green-200 rounded-xl p-4 text-left mb-6 max-w-sm mx-auto">
                <p className="text-xs text-gray-500 leading-relaxed">
                  <span className="font-semibold text-gray-700">Need to reschedule?</span> Please request a new appointment time through your calendar invite and our team will move it to a time that works for you. You can also email{" "}
                  <a href="mailto:droliveri@elevatehealthtampa.com" className="text-teal-600 hover:underline">droliveri@elevatehealthtampa.com</a>
                </p>
              </div>
              <a
                href="mailto:droliveri@elevatehealthtampa.com"
                className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                Email Dr. Oliveri
              </a>
            </div>
          ) : (
            /* ── Not yet booked state ── */
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
          )}
        </>
      )}

      {/* Two column info — always visible */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
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

      {/* Standard rebook card for booked/cancelled states (not completed — completed gets the gold one above) */}
      {(alreadyBooked || wasCancelled) && (
        <div className="bg-teal-50 border border-teal-200 rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-bold text-teal-800 mb-2 text-center">Need Another Consultation?</h3>
          <p className="text-teal-700 text-sm text-center mb-5">
            Purchase an additional 15-minute Pain Relief Consultation with Dr. Oliveri for $197. After payment you will be able to book your next session immediately.
          </p>
          <RebookButton />
        </div>
      )}

      {/* Help note */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
        <p className="text-sm text-gray-500">
          Questions about your booking? Reply to your confirmation email or contact us at{" "}
          <a href="mailto:droliveri@elevatehealthtampa.com" className="text-teal-600 font-medium hover:underline">droliveri@elevatehealthtampa.com</a>
        </p>
      </div>
    </div>
  );
}
