"use client";

import { useState } from "react";
import Link from "next/link";

const CONFIRM_TEXT = "CONFIRM-REFUND";

const LOSSES = [
  "All 7 rehabilitation video modules",
  "Your module completion progress",
  "Your free bonuses (Pain Tracking Journal & Posture Guide)",
  "Nutrition for Inflammation & Pain Relief Mini Course (if purchased)",
  "Your 1-on-1 Virtual Consultation slot (if purchased)",
  "Your account and all stored data — permanently",
];

export default function RefundForm() {
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const confirmed = confirmText === CONFIRM_TEXT;

  async function handleRefund() {
    if (!confirmed) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/refund/process", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Refund failed. Please contact support.");
      setDone(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please contact support.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="max-w-lg mx-auto pt-4">
        <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Refund Processed</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Your refund has been processed. You will receive your money back within{" "}
            <strong>5–10 business days</strong>. A confirmation email has been sent.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto pt-4">
      <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-5">
        You have met all requirements for your 90-day money-back guarantee.
      </p>

      {/* Warning banner */}
      <div className="bg-red-50 border border-red-300 rounded-2xl p-5 mb-6 flex gap-4">
        <svg className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
        <div>
          <p className="font-bold text-red-800 text-sm mb-1">Are you sure?</p>
          <p className="text-red-700 text-sm">
            This will permanently delete your account and all progress. This action cannot be undone.
          </p>
        </div>
      </div>

      {/* What they lose */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6">
        <p className="font-semibold text-gray-900 mb-3 text-sm">You will permanently lose access to:</p>
        <ul className="space-y-2">
          {LOSSES.map((loss) => (
            <li key={loss} className="flex items-start gap-3 text-sm text-gray-700">
              <svg className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              {loss}
            </li>
          ))}
        </ul>
      </div>

      {/* Confirmation input */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-5">
        <label htmlFor="confirm" className="block text-sm font-medium text-gray-700 mb-2">
          Type <span className="font-mono font-bold text-red-600">{CONFIRM_TEXT}</span> to proceed
        </label>
        <input
          id="confirm"
          type="text"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder="CONFIRM-REFUND"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-col gap-3">
        <button
          onClick={handleRefund}
          disabled={!confirmed || loading}
          className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              Processing Refund…
            </>
          ) : (
            "Process My Refund"
          )}
        </button>

        <Link
          href="/dashboard"
          className="w-full bg-teal-500 hover:bg-teal-700 text-white font-semibold py-3 rounded-xl transition-colors text-center"
        >
          Cancel — Keep My Access
        </Link>
      </div>
    </div>
  );
}
