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
    description:
      "Discover the exact foods that fight spinal inflammation and accelerate your pain relief — a perfect complement to your rehabilitation program.",
    price: 47,
    badge: "Most Popular",
    badgeColor: "bg-teal-100 text-teal-700",
  },
  {
    id: "upsell2" as const,
    title: "1-on-1 15-Minute Virtual Consultation",
    description:
      "Get a private video call with Dr. Oliveri to review your specific pain pattern and get a personalized protocol recommendation.",
    price: 197,
    badge: "High Value",
    badgeColor: "bg-orange-100 text-orange-700",
  },
];

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function Spinner() {
  return (
    <svg
      className="animate-spin h-5 w-5 text-white inline-block"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
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
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadLoading, setLeadLoading] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [leadError, setLeadError] = useState("");

  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  const [upsell1, setUpsell1] = useState(false);
  const [upsell2, setUpsell2] = useState(false);

  const total = 97 + (upsell1 ? 47 : 0) + (upsell2 ? 197 : 0);

  async function handleLeadSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLeadError("");
    setLeadLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: leadName,
          email: leadEmail,
          source: "landing-page",
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong. Please try again.");
      }
      setLeadCaptured(true);
      setTimeout(() => scrollToId("pricing-card"), 300);
    } catch (err: unknown) {
      setLeadError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLeadLoading(false);
    }
  }

  async function handleCheckout() {
    setCheckoutError("");
    setCheckoutLoading(true);
    try {
      const upsells: string[] = [];
      if (upsell1) upsells.push("upsell1");
      if (upsell2) upsells.push("upsell2");

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: leadEmail, full_name: leadName, upsells }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "Could not start checkout.");
      window.location.href = data.url;
    } catch (err: unknown) {
      setCheckoutError(err instanceof Error ? err.message : "Could not start checkout.");
      setCheckoutLoading(false);
    }
  }

  return (
    <section id="enroll" className="bg-white py-20 px-4 sm:px-6">
      <div className="max-w-xl mx-auto">
        {/* Lead capture */}
        {!leadCaptured ? (
          <div className="bg-teal-50 border border-teal-200 rounded-2xl p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-1 text-center">
              Get Instant Access — Start Pain-Free Today
            </h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Enter your details to unlock your free Back Pain Relief Guide — then enroll below.
            </p>
            <form onSubmit={handleLeadSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Full Name"
                value={leadName}
                onChange={(e) => setLeadName(e.target.value)}
                required
                className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={leadEmail}
                onChange={(e) => setLeadEmail(e.target.value)}
                required
                className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              {leadError && <p className="text-red-600 text-sm">{leadError}</p>}
              <button
                type="submit"
                disabled={leadLoading}
                className="bg-teal-500 hover:bg-teal-700 disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {leadLoading ? (
                  <><Spinner /> Sending…</>
                ) : (
                  "Get My Free Back Pain Relief Guide"
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-teal-50 border border-teal-500 rounded-2xl p-5 mb-8 text-center">
            <p className="text-teal-700 font-semibold">
              ✓ Your guide is on its way! Now unlock the full program below.
            </p>
          </div>
        )}

        {/* Pricing card */}
        <div id="pricing-card" className="bg-white border-2 border-teal-500 rounded-2xl shadow-xl p-8">
          <p className="text-center text-sm font-semibold text-teal-600 uppercase tracking-widest mb-2">
            Elevate Pain-Free Program
          </p>
          <div className="text-center mb-2">
            <span className="text-2xl text-gray-400 line-through mr-2">$378</span>
            <span className="text-6xl font-bold text-teal-500">$97</span>
          </div>
          <p className="text-center text-orange-600 text-sm font-semibold mb-2">
            Limited time offer — save $281 today.
          </p>
          <p className="text-center text-gray-400 text-sm mb-6">One-time payment</p>

          {/* Includes list */}
          <ul className="space-y-3 mb-8">
            {INCLUDES.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-gray-700">
                <svg
                  className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                {item}
              </li>
            ))}
          </ul>

          {/* Upsell cards */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
              Enhance Your Results — Add to Your Order
            </p>
            <div className="flex flex-col gap-3">
              {UPSELLS.map(({ id, title, description, price, badge, badgeColor }) => {
                const checked = id === "upsell1" ? upsell1 : upsell2;
                const toggle = id === "upsell1" ? () => setUpsell1((v) => !v) : () => setUpsell2((v) => !v);
                return (
                  <div
                    key={id}
                    onClick={toggle}
                    className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all select-none ${
                      checked
                        ? "border-teal-500 bg-teal-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    {/* Checkbox */}
                    <div
                      className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        checked ? "border-teal-500 bg-teal-500" : "border-gray-400 bg-white"
                      }`}
                    >
                      {checked && <CheckIcon />}
                    </div>
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-sm text-gray-900 leading-snug">{title}</span>
                        <span className="text-sm font-bold text-teal-600 flex-shrink-0">+${price}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">{description}</p>
                      <span className={`inline-block mt-1.5 text-xs font-semibold px-2 py-0.5 rounded-full ${badgeColor}`}>
                        {badge}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order summary */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6 text-sm">
            <p className="font-semibold text-gray-700 mb-3">Order Summary</p>
            <div className="flex justify-between text-gray-600 mb-2">
              <span>Elevate Pain-Free Program</span>
              <span className="font-medium">$97</span>
            </div>
            {upsell1 && (
              <div className="flex justify-between text-gray-600 mb-2">
                <span>Nutrition Mini Course</span>
                <span className="font-medium">+$47</span>
              </div>
            )}
            {upsell2 && (
              <div className="flex justify-between text-gray-600 mb-2">
                <span>Virtual Consultation</span>
                <span className="font-medium">+$197</span>
              </div>
            )}
            <div className="border-t border-gray-300 mt-3 pt-3 flex justify-between items-center">
              <span className="font-bold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-teal-600">${total}</span>
            </div>
          </div>

          {checkoutError && (
            <p className="text-red-600 text-sm text-center mb-4">{checkoutError}</p>
          )}

          <button
            onClick={handleCheckout}
            disabled={checkoutLoading}
            className="w-full bg-teal-500 hover:bg-teal-700 disabled:opacity-60 text-white font-bold text-lg py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {checkoutLoading ? (
              <><Spinner /> Redirecting…</>
            ) : (
              `Complete Purchase — $${total}`
            )}
          </button>

          {/* What happens next */}
          <div className="mt-5 rounded-xl p-4" style={{ background: "#E1F5EE" }}>
            <p className="text-center text-xs font-semibold text-teal-700 uppercase tracking-wider mb-4">What happens after purchase</p>
            <div className="flex flex-col sm:flex-row gap-4">
              {[
                { emoji: "📧", title: "Check Your Email", sub: "Your login credentials are sent instantly after purchase. If you added a Virtual Consultation, your booking link will also be included." },
                { emoji: "🔐", title: "Access Your Dashboard", sub: "Log in to your personal pain-free portal. If you added the Nutrition for Inflammation course, it will be waiting for you in your dashboard." },
                { emoji: "🎯", title: "Start Module 1", sub: "Begin your at-home rehabilitation immediately" },
              ].map((step, i) => (
                <div key={step.title} className="flex-1 flex flex-col items-center text-center gap-1">
                  <div className="w-7 h-7 rounded-full bg-teal-500 text-white text-xs font-bold flex items-center justify-center mb-1 flex-shrink-0">
                    {i + 1}
                  </div>
                  <span className="text-lg leading-none">{step.emoji}</span>
                  <p className="text-sm font-bold text-gray-800 leading-snug">{step.title}</p>
                  <p className="text-xs text-gray-500 leading-snug">{step.sub}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-4">
            One-time payment · Lifetime access · Instant delivery · Secure checkout
          </p>
          <p className="text-center text-sm mt-3">
            <a href="/login" className="text-teal-600 hover:underline">
              Already a member? Log in to your dashboard →
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
