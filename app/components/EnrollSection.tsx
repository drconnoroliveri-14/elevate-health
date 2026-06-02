"use client";

import { useState } from "react";

const INCLUDES = [
  "7 chiropractic care rehabilitation modules",
  "Lifetime access + all future updates",
  "90-day personal pain-free protocol",
  "Pain Tracking Journal ($47 value)",
  "Posture Correction Quick Reference Guide ($37 value)",
  "90-Day Posture Photo Tracker ($97 value)",
  "90-day pain-free guarantee",
  "Secure checkout · Instant delivery",
];

const UPSELLS = [
  {
    id: "upsell1" as const,
    title: "Nutrition for Inflammation & Pain Relief Mini Course",
    description: "Discover the exact foods that fight spinal inflammation and accelerate your pain relief — a perfect complement to your rehabilitation program.",
    price: 47,
    badge: "Most Popular",
    badgeColor: "bg-teal-100 text-teal-700",
  },
  {
    id: "upsell2" as const,
    title: "1-on-1 15-Minute Virtual Consultation",
    description: "Get a private video call with Dr. Oliveri to review your specific pain pattern and get a personalized protocol recommendation.",
    price: 197,
    badge: "High Value",
    badgeColor: "bg-orange-100 text-orange-700",
  },
];

function Spinner() {
  return (
    <svg className="animate-spin h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

export default function EnrollSection() {
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [upsell1, setUpsell1] = useState(false);
  const [upsell2, setUpsell2] = useState(false);
  const total = 97 + (upsell1 ? 47 : 0) + (upsell2 ? 197 : 0);

  async function handleCheckout() {
    setCheckoutError("");
    setCheckoutLoading(true);
    try {
      const upsells: string[] = [];
      if (upsell1) upsells.push("upsell1");
      if (upsell2) upsells.push("upsell2");
      const res = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ upsells }) });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "Could not start checkout.");
      window.location.href = data.url;
    } catch (err: unknown) {
      setCheckoutError(err instanceof Error ? err.message : "Could not start checkout.");
      setCheckoutLoading(false);
    }
  }

  return (
    <section id="enroll" className="bg-white py-20 px-4 sm:px-6" style={{ scrollMarginTop: "80px" }}>
      <div className="max-w-xl mx-auto">
        <div id="pricing-card" className="bg-white border-2 border-teal-500 rounded-2xl shadow-xl p-8 scroll-mt-24">
          <p className="text-center text-sm font-semibold text-teal-600 uppercase tracking-widest mb-2">Elevate Pain-Free Program</p>
          <div className="text-center mb-2">
            <span className="text-2xl text-gray-400 line-through mr-2">$378</span>
            <span className="text-6xl font-bold text-teal-500">$97</span>
          </div>
          <p className="text-center text-orange-600 text-sm font-semibold mb-2">Limited time offer — save $281 today.</p>
          <p className="text-center text-gray-400 text-sm mb-6">One-time payment</p>
          <ul className="space-y-3 mb-8">
            {INCLUDES.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-gray-700">
                <svg className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                {item}
              </li>
            ))}
          </ul>
          <div className="mb-6">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Enhance Your Results — Add to Your Order</p>
            <div className="flex flex-col gap-3">
              {UPSELLS.map(({ id, title, description, price, badge, badgeColor }) => {
                const checked = id === "upsell1" ? upsell1 : upsell2;
                const toggle = id === "upsell1" ? () => setUpsell1((v) => !v) : () => setUpsell2((v) => !v);
                return (
                  <div key={id} onClick={toggle} className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all select-none ${checked ? "border-teal-500 bg-teal-50" : "border-gray-200 bg-white hover:border-gray-300"}`}>
                    <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${checked ? "border-teal-500 bg-teal-500" : "border-gray-400 bg-white"}`}>
                      {checked && <CheckIcon />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-sm text-gray-900 leading-snug">{title}</span>
                        <span className="text-sm font-bold text-teal-600 flex-shrink-0">+${price}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">{description}</p>
                      <span className={`inline-block mt-1.5 text-xs font-semibold px-2 py-0.5 rounded-full ${badgeColor}`}>{badge}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6 text-sm">
            <p className="font-semibold text-gray-700 mb-3">Order Summary</p>
            <div className="flex justify-between text-gray-600 mb-2"><span>Elevate Pain-Free Program</span><span className="font-medium">$97</span></div>
            {upsell1 && <div className="flex justify-between text-gray-600 mb-2"><span>Nutrition Mini Course</span><span className="font-medium">+$47</span></div>}
            {upsell2 && <div className="flex justify-between text-gray-600 mb-2"><span>Virtual Consultation</span><span className="font-medium">+$197</span></div>}
            <div className="border-t border-gray-300 mt-3 pt-3 flex justify-between items-center">
              <span className="font-bold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-teal-600">${total}</span>
            </div>
          </div>
          {checkoutError && <p className="text-red-600 text-sm text-center mb-4">{checkoutError}</p>}
          <button onClick={handleCheckout} disabled={checkoutLoading} className="w-full bg-teal-500 hover:bg-teal-700 disabled:opacity-60 text-white font-bold text-lg py-4 rounded-xl transition-colors flex items-center justify-center gap-2">
            {checkoutLoading ? <><Spinner /> Redirecting…</> : `Complete Purchase — $${total}`}
          </button>
          <div className="mt-5 rounded-xl p-4" style={{ backgroundColor: "#E1F5EE" }}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { step: 1, emoji: "📧", title: "Check Your Email", subtitle: "Your login credentials are sent instantly after purchase. If you added a Virtual Consultation, your booking link will also be included." },
                { step: 2, emoji: "🔐", title: "Access Your Dashboard", subtitle: "Log in to your personal pain-free portal. If you added the Nutrition for Inflammation course, it will be waiting for you in your dashboard." },
                { step: 3, emoji: "🎯", title: "Start Module 1", subtitle: "Begin your at-home rehabilitation immediately." },
              ].map(({ step, emoji, title, subtitle }) => (
                <div key={step} className="flex flex-col items-center text-center gap-1.5">
                  <div className="w-7 h-7 rounded-full bg-teal-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{step}</div>
                  <p className="text-sm font-bold text-gray-900">{emoji} {title}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{subtitle}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="text-center text-xs text-gray-400 mt-4">One-time payment · Lifetime access · Instant delivery · Secure checkout</p>
          <p className="text-center text-sm mt-3"><a href="/login" className="text-teal-600 hover:underline">Already a member? Log in to your dashboard →</a></p>
        </div>
      </div>
    </section>
  );
}