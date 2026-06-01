"use client";
import { useState } from "react";

export default function ConsultationRatingForm() {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!rating) return;
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/consultation/rating", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ rating, feedback }) });
      if (!res.ok) { const data = await res.json(); setError(data.error ?? "Something went wrong."); setLoading(false); return; }
      setSubmitted(true);
    } catch { setError("Something went wrong. Please try again."); setLoading(false); }
  }

  if (submitted) return <div className="text-center py-4"><p className="text-teal-700 font-semibold text-sm">Thank you for your feedback! ✓</p></div>;

  return (
    <div>
      <p className="text-sm font-semibold text-gray-700 mb-2 text-center">How was your consultation?</p>
      <div className="flex justify-center gap-1 mb-4">
        {[1,2,3,4,5].map((star) => (
          <button key={star} type="button" onClick={() => setRating(star)} onMouseEnter={() => setHovered(star)} onMouseLeave={() => setHovered(0)} className="focus:outline-none transition-transform hover:scale-110" aria-label={`${star} star`}>
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill={(hovered || rating) >= star ? "#F59E0B" : "none"} stroke={(hovered || rating) >= star ? "#F59E0B" : "#D1D5DB"} strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>
          </button>
        ))}
      </div>
      <div className="mb-4">
        <label className="text-sm font-semibold text-gray-700 block mb-1.5 text-center">Any additional feedback?</label>
        <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} rows={3} placeholder="Share your thoughts…" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none" />
      </div>
      {error && <p className="text-red-500 text-xs mb-3 text-center">{error}</p>}
      <div className="text-center">
        <button onClick={handleSubmit} disabled={!rating || loading} className="bg-teal-500 hover:bg-teal-700 disabled:opacity-50 text-white font-semibold px-8 py-2.5 rounded-xl text-sm transition-colors">{loading ? "Submitting…" : "Submit Feedback"}</button>
      </div>
    </div>
  );
}