"use client";
import { useState } from "react";

export default function RebookButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRebook() {
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/upgrades/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ upgrade: "consultation_rebooking" }) });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Something went wrong. Please try again."); setLoading(false); return; }
      window.location.href = data.url;
    } catch { setError("Something went wrong. Please try again."); setLoading(false); }
  }

  return (
    <div className="text-center">
      <button onClick={handleRebook} disabled={loading} className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-700 disabled:opacity-60 text-white font-bold px-8 py-4 rounded-xl transition-colors shadow-md">
        {loading ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Processing…</> : <>Book Another Consultation — $197 →</>}
      </button>
      {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
    </div>
  );
}