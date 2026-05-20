"use client";

import { useState } from "react";
import Link from "next/link";

const MODULES = [
  {
    num: 1,
    title: "The Science of Aging",
    desc: "Understand hallmarks of aging, cellular senescence, and how to establish your baseline biological age.",
  },
  {
    num: 2,
    title: "Nutrition for Longevity",
    desc: "Senolytic foods, time-restricted eating, autophagy protocols, and anti-inflammatory nutrition.",
  },
  {
    num: 3,
    title: "Movement & VO2 Max",
    desc: "Why VO2 max is the #1 longevity biomarker and how to build it with Zone 2 and HIIT.",
  },
  {
    num: 4,
    title: "Sleep Architecture & HRV",
    desc: "Deep sleep optimization, HRV tracking, and circadian rhythm tuning.",
  },
  {
    num: 5,
    title: "Hormones, Peptides & Supplements",
    desc: "Optimize key hormones and learn which supplements actually work.",
  },
  {
    num: 6,
    title: "Biomarker Testing & Tracking",
    desc: "The 12 biomarkers every longevity-focused person should track and how to act on results.",
  },
  {
    num: 7,
    title: "Your Personal 90-Day Protocol",
    desc: "Build your customized longevity stack with week-by-week implementation.",
  },
];

const BONUSES = [
  {
    title: "Biomarker Tracking Spreadsheet",
    value: "$197",
    desc: "Pre-built spreadsheet to log and visualize all 12 longevity biomarkers over time.",
  },
  {
    title: "Supplement Stack Reference Guide",
    value: "$97",
    desc: "Evidence-based breakdown of the top longevity supplements with dosing protocols.",
  },
];

const TESTIMONIALS = [
  {
    quote: "I dropped 6 years off my biological age in 4 months.",
    name: "Marcus T.",
    age: 54,
  },
  {
    quote: "My doctor couldn't believe my bloodwork.",
    name: "Sandra L.",
    age: 61,
  },
  { quote: "Worth 10x the price.", name: "James R.", age: 48 },
];

const INCLUDES = [
  "7 science-backed video modules",
  "Lifetime access + all future updates",
  "90-day personal protocol",
  "Biomarker Tracking Spreadsheet ($197 value)",
  "Supplement Stack Reference Guide ($97 value)",
  "90-day money-back guarantee",
  "Secure checkout · Instant delivery",
];

function StarRow() {
  return (
    <div className="flex gap-0.5 mb-3" aria-label="5 stars">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className="w-5 h-5 text-yellow-400 fill-current"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function ShieldIcon() {
  return (
    <svg
      className="w-14 h-14 text-teal-500 mx-auto mb-4"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
      />
    </svg>
  );
}

function Spinner() {
  return (
    <svg
      className="animate-spin h-5 w-5 text-white inline-block"
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
  );
}

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export default function LandingPage() {
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadLoading, setLeadLoading] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [leadError, setLeadError] = useState("");

  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

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
      setLeadError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLeadLoading(false);
    }
  }

  async function handleCheckout() {
    setCheckoutError("");
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.url)
        throw new Error(data.error || "Could not start checkout.");
      window.location.href = data.url;
    } catch (err: unknown) {
      setCheckoutError(
        err instanceof Error ? err.message : "Could not start checkout."
      );
      setCheckoutLoading(false);
    }
  }

  return (
    <div className="min-h-screen font-sans">
      {/* ── NAV ── */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <img src="/logo.PNG" alt="Elevate Health" style={{height: '70px', width: 'auto'}} />
          <button
            onClick={() => scrollToId("enroll")}
            className="bg-teal-500 hover:bg-teal-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
          >
            Join the Program
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="bg-teal-700 text-white py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Add 10+ Healthy Years to Your Life&nbsp;— Starting This Week
          </h1>
          <p className="text-lg sm:text-xl text-teal-50 mb-10 leading-relaxed">
            The Elevate Longevity Program reveals the 5 biomarkers silently
            aging you faster — and gives you the exact protocol to reverse them.
          </p>
          <ul className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            {[
              "7 science-backed video modules",
              "Lifetime access — learn at your pace",
              "90-day money-back guarantee",
            ].map((bullet) => (
              <li
                key={bullet}
                className="flex items-center gap-2 text-teal-50 font-medium"
              >
                <svg
                  className="w-5 h-5 text-green-400 flex-shrink-0"
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
                {bullet}
              </li>
            ))}
          </ul>
          <button
            onClick={() => scrollToId("enroll")}
            className="bg-white text-teal-700 hover:bg-teal-50 font-bold text-lg px-10 py-4 rounded-xl shadow-lg transition-colors"
          >
            Yes, I Want to Live Longer →
          </button>
        </div>
      </section>

      {/* ── VSL ── */}
      <section className="bg-white py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-xl mb-6 bg-gray-900 flex flex-col items-center justify-center gap-4">
            <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center">
              <svg className="w-10 h-10 text-white opacity-80" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <p className="text-white/60 text-sm font-medium tracking-wide">Your Sales Video Goes Here</p>
          </div>
          <p className="text-gray-500 text-base">
            Join{" "}
            <strong className="text-gray-700">2,000+</strong> people who&apos;ve
            already reversed their biological age
          </p>
        </div>
      </section>

      {/* ── SOCIAL PROOF ── */}
      <section className="bg-teal-50 py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-center text-2xl font-bold text-gray-900 mb-10">
            What Our Students Say
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="bg-white rounded-2xl p-6 shadow-sm flex flex-col"
              >
                <StarRow />
                <p className="text-gray-800 italic flex-1 mb-4">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <p className="text-sm font-semibold text-gray-600">
                  — {t.name}, {t.age}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT'S INSIDE ── */}
      <section className="bg-white py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Everything You Get Inside the Program
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
            {MODULES.map((m) => (
              <div
                key={m.num}
                className="flex gap-4 bg-gray-50 rounded-xl p-5 border border-gray-100"
              >
                <span className="flex-shrink-0 w-9 h-9 rounded-full bg-teal-500 text-white text-sm font-bold flex items-center justify-center">
                  {m.num}
                </span>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">{m.title}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {m.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <h3 className="text-xl font-bold text-gray-800 mb-5 text-center">
            Plus These Free Bonuses
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {BONUSES.map((b) => (
              <div
                key={b.title}
                className="flex gap-4 bg-teal-50 border border-teal-200 rounded-xl p-5"
              >
                <span className="flex-shrink-0 text-teal-500">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z"
                    />
                  </svg>
                </span>
                <div>
                  <p className="font-bold text-gray-900">
                    {b.title}{" "}
                    <span className="line-through text-gray-400 font-normal text-sm">
                      {b.value}
                    </span>{" "}
                    <span className="text-teal-600 font-semibold text-sm">
                      FREE
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AUTHORITY ── */}
      <section className="bg-white border-t border-gray-100 py-14 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-gray-700 text-lg leading-relaxed">
            The Elevate Longevity Program was built by a team of functional
            medicine doctors, longevity researchers, and health optimization
            coaches — combining the latest peer-reviewed science with practical,
            implementable protocols.
          </p>
        </div>
      </section>

      {/* ── GUARANTEE ── */}
      <section className="bg-gray-50 py-16 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <ShieldIcon />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            90-Day Full Money-Back Guarantee
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Try the entire program. If you don&apos;t feel measurably younger,
            more energized, and sharper within 90 days, we&apos;ll refund every
            penny. No questions asked.
          </p>
        </div>
      </section>

      {/* ── ENROLL ── */}
      <section id="enroll" className="bg-white py-20 px-4 sm:px-6">
        <div className="max-w-xl mx-auto">
          {/* Lead capture */}
          {!leadCaptured ? (
            <div className="bg-teal-50 border border-teal-200 rounded-2xl p-8 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-1 text-center">
                Get Your Free Longevity Guide
              </h3>
              <p className="text-sm text-gray-500 text-center mb-6">
                Enter your details to unlock the guide — then enroll below.
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
                {leadError && (
                  <p className="text-red-600 text-sm">{leadError}</p>
                )}
                <button
                  type="submit"
                  disabled={leadLoading}
                  className="bg-teal-500 hover:bg-teal-700 disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {leadLoading ? (
                    <>
                      <Spinner /> Sending…
                    </>
                  ) : (
                    "Get My Free Longevity Guide"
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
          <div
            id="pricing-card"
            className="bg-white border-2 border-teal-500 rounded-2xl shadow-xl p-8"
          >
            <p className="text-center text-sm font-semibold text-teal-600 uppercase tracking-widest mb-2">
              Elevate Longevity Program
            </p>
            <p className="text-center text-6xl font-bold text-teal-500 mb-2">
              $997
            </p>
            <p className="text-center text-gray-400 text-sm mb-8">
              One-time payment
            </p>

            <ul className="space-y-3 mb-8">
              {INCLUDES.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm text-gray-700"
                >
                  <svg
                    className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5"
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
                  {item}
                </li>
              ))}
            </ul>

            {checkoutError && (
              <p className="text-red-600 text-sm text-center mb-4">
                {checkoutError}
              </p>
            )}

            <button
              onClick={handleCheckout}
              disabled={checkoutLoading}
              className="w-full bg-teal-500 hover:bg-teal-700 disabled:opacity-60 text-white font-bold text-lg py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {checkoutLoading ? (
                <>
                  <Spinner /> Redirecting…
                </>
              ) : (
                "Complete Purchase →"
              )}
            </button>

            <p className="text-center text-xs text-gray-400 mt-4">
              One-time payment · Lifetime access · Instant delivery · Secure
              checkout
            </p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-teal-700 text-white py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <img src="/logo.PNG" alt="Elevate Health" style={{height: '70px', width: 'auto'}} />
          <p className="text-teal-200 text-sm">
            © {new Date().getFullYear()} Elevate Health. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-teal-200">
            <Link
              href="/privacy"
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
