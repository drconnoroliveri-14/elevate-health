"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const STEPS = [
  {
    num: 1,
    title: "Check your email",
    desc: "Your login credentials have been sent to your inbox. Check your spam folder if you don't see it within a few minutes.",
  },
  {
    num: 2,
    title: "Log in to your portal",
    desc: "Click the link in your email or visit /login with the credentials provided.",
  },
  {
    num: 3,
    title: "Start Module 1",
    desc: "Your first module is unlocked and ready to watch. The science of aging starts now.",
  },
];

function Spinner() {
  return (
    <div className="flex flex-col items-center gap-4 py-16">
      <svg
        className="animate-spin h-10 w-10 text-teal-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8H4z"
        />
      </svg>
      <p className="text-gray-500 text-sm">Confirming your purchase…</p>
    </div>
  );
}

function CheckIcon() {
  return (
    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
      <svg
        className="w-10 h-10 text-green-600"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.5 12.75l6 6 9-13.5"
        />
      </svg>
    </div>
  );
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [status, setStatus] = useState<"loading" | "verified" | "error">(
    "loading"
  );
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!sessionId) {
      setErrorMsg("No session ID found. Please contact support.");
      setStatus("error");
      return;
    }

    fetch(`/api/checkout/verify?session_id=${encodeURIComponent(sessionId)}`)
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Could not verify your purchase.");
        }
        setStatus("verified");
      })
      .catch((err: unknown) => {
        setErrorMsg(
          err instanceof Error ? err.message : "Verification failed."
        );
        setStatus("error");
      });
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-16">
      {/* Logo */}
      <Link href="/" className="mb-10">
        <span className="text-xl font-bold text-teal-500 tracking-tight">
          Elevate Health
        </span>
      </Link>

      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8 sm:p-12">
        {status === "loading" && <Spinner />}

        {status === "error" && (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              Verification Issue
            </h1>
            <p className="text-gray-500 mb-6">{errorMsg}</p>
            <p className="text-sm text-gray-400">
              If you were charged, please contact{" "}
              <a
                href="mailto:support@elevatehealth.com"
                className="text-teal-600 hover:underline"
              >
                support@elevatehealth.com
              </a>{" "}
              and we&apos;ll sort it out immediately.
            </p>
          </div>
        )}

        {status === "verified" && (
          <>
            <CheckIcon />
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-3">
              You&apos;re in!
            </h1>
            <p className="text-center text-gray-600 text-lg mb-10">
              Check your email for login details.
            </p>

            {/* Steps */}
            <div className="flex flex-col sm:flex-row gap-5 mb-10">
              {STEPS.map((step) => (
                <div
                  key={step.num}
                  className="flex-1 bg-teal-50 border border-teal-100 rounded-xl p-5"
                >
                  <div className="w-8 h-8 rounded-full bg-teal-500 text-white text-sm font-bold flex items-center justify-center mb-3">
                    {step.num}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>

            <Link
              href="/login"
              className="block w-full text-center bg-teal-500 hover:bg-teal-700 text-white font-semibold py-3.5 rounded-xl transition-colors"
            >
              Go to Login →
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <svg
            className="animate-spin h-8 w-8 text-teal-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
