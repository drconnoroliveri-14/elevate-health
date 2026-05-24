"use client";

import Link from "next/link";
import Image from "next/image";
import EnrollSection from "@/app/components/EnrollSection";

const MODULES = [
  { num: 1, title: "Understanding Your Pain", desc: "The root causes of neck, mid back, and lower back pain. How posture, muscle imbalances, and movement patterns create chronic pain. Your baseline pain assessment." },
  { num: 2, title: "Neck Pain Relief Protocol", desc: "Step-by-step exercises to release neck tension, restore cervical mobility, and eliminate headaches caused by neck dysfunction." },
  { num: 3, title: "Mid Back Pain Relief Protocol", desc: "Thoracic mobility exercises, postural correction, and strengthening routines to eliminate mid back pain and improve breathing." },
  { num: 4, title: "Lower Back Pain Relief Protocol", desc: "Core activation, hip flexor release, and lumbar stabilization exercises proven to eliminate lower back pain." },
  { num: 5, title: "Posture Correction & Alignment", desc: "Full body postural assessment and correction. How to sit, stand, sleep, and move without creating pain." },
  { num: 6, title: "Strengthening for a Pain-Free Life", desc: "Progressive strengthening program to bulletproof your spine and prevent pain from returning." },
  { num: 7, title: "Your Personal 90-Day Pain-Free Protocol", desc: "Build your customized daily rehabilitation routine. Week-by-week implementation, pain tracking, and long-term maintenance." },
];

const BONUSES = [
  { title: "Pain Tracking Journal", value: "$47", desc: "Track your daily pain levels, exercises, and progress to stay on track and celebrate your wins." },
  { title: "Posture Correction Quick Reference Guide", value: "$37", desc: "One-page visual guide showing ideal sitting, standing, and sleeping posture to reinforce your daily habits." },
];

const TESTIMONIALS = [
  { quote: "I had chronic lower back pain for 6 years. After 8 weeks I was completely pain-free.", name: "Michael R.", age: 52 },
  { quote: "My neck pain from desk work is completely gone. I do 20 minutes a day.", name: "Sarah K.", age: 38 },
  { quote: "Avoided surgery thanks to this program. My orthopedic surgeon was shocked.", name: "David L.", age: 61 },
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

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export default function LandingPage() {
  return (
    <div className="min-h-screen font-sans">
      {/* ── NAV ── */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Image src="/logo.PNG" alt="Elevate Health" width={140} height={70} unoptimized style={{height: '70px', width: 'auto'}} />
          <button
            onClick={() => scrollToId("enroll")}
            className="text-sm font-bold px-5 py-2.5 rounded-lg transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#F5C842", color: "#1a1a1a" }}
          >
            Yes, I Want to Live Pain-Free →
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section
        className="relative text-white py-28 sm:py-36 px-4 sm:px-6 overflow-hidden"
        style={{
          isolation: "isolate",
          backgroundColor: "#085041",
          backgroundImage: "linear-gradient(135deg, rgba(8,80,65,0.87) 0%, rgba(15,110,86,0.82) 100%), url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&q=80')",
          backgroundSize: "auto, cover",
          backgroundPosition: "center, center",
          backgroundRepeat: "no-repeat, no-repeat",
        }}
      >
        <div className="relative max-w-4xl mx-auto text-center">
          {/* Headline */}
          <h1 className="mb-5">
            <span className="block text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white/90 mb-1">
              Finally End Your
            </span>
            <span className="relative inline-block text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight">
              Neck &amp; Back Pain.
              <span
                className="absolute left-0 w-full rounded-full"
                style={{ background: "#4ECCA3", height: "4px", bottom: "-6px" }}
              />
            </span>
          </h1>

          {/* Styled subtitle */}
          <p className="mb-8 mt-6">
            <span
              className="inline-block font-bold text-xl sm:text-2xl"
              style={{
                background: "#F5C842",
                color: "#1a1a1a",
                padding: "6px 16px",
                borderRadius: "999px",
                boxShadow: "0 4px 16px rgba(245,200,66,0.45)",
              }}
            >
              From Home, Without Surgery or Medication
            </span>
          </p>

          {/* Body copy */}
          <p className="text-base sm:text-lg text-teal-100/90 mb-10 leading-relaxed max-w-2xl mx-auto">
            The Elevate Pain-Free Program gives you a proven at-home rehabilitation system used by chiropractors — so you can eliminate neck, mid back, and lower back pain for good.
          </p>

          {/* Trust pill badges */}
          <ul className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
            {[
              "Developed by Licensed Chiropractors",
              "Step-by-step video exercises",
              "90-day pain-free guarantee",
            ].map((bullet) => (
              <li
                key={bullet}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium text-white"
                style={{ background: "rgba(255,255,255,0.18)" }}
              >
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  style={{ color: "#4ECCA3" }}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                {bullet}
              </li>
            ))}
          </ul>

          {/* Social proof */}
          <p className="text-sm font-semibold mb-5" style={{ color: "rgba(255,255,255,0.72)" }}>
            ★★★★★&nbsp; Trusted by 2,000+ people with chronic pain
          </p>

          {/* CTA with pulse ring */}
          <div className="relative inline-flex">
            <span
              className="absolute inset-0 rounded-2xl animate-ping opacity-25 pointer-events-none"
              style={{ background: "#F5C842" }}
            />
            <button
              onClick={() => scrollToId("enroll")}
              className="relative font-extrabold text-xl px-12 py-5 rounded-2xl shadow-2xl transition-transform hover:scale-105 active:scale-100 duration-150"
              style={{ background: "#F5C842", color: "#1a1a1a" }}
            >
              Yes, I Want to Live Pain-Free →
            </button>
          </div>
        </div>
      </section>

      {/* ── VSL ── */}
      <section
        style={{
          backgroundColor: "white",
          position: "relative",
          zIndex: 10,
          isolation: "isolate",
          transform: "translateZ(0)",
          overflow: "hidden",
          paddingTop: "64px",
          paddingBottom: "64px",
          paddingLeft: "16px",
          paddingRight: "16px",
        }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <div
            style={{
              position: "relative",
              paddingBottom: "56.25%",
              height: 0,
              overflow: "hidden",
              backgroundColor: "white",
              marginBottom: "24px",
            }}
          >
            <iframe
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
              src="https://www.youtube.com/embed/0U9BqwknHXM"
              title="Elevate Pain-Free Program"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <p className="text-gray-500 text-base">
            Join{" "}
            <strong className="text-gray-700">2,000+</strong> people who have
            already eliminated their neck and back pain
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
            The Elevate Pain-Free Program was developed in collaboration with licensed chiropractors and spinal health specialists — combining the latest evidence-based research with practical at-home exercises that actually work.
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
            90-Day Pain-Free Guarantee — Follow the program for 90 days. If you are not completely satisfied with your results, we will refund every penny. No questions asked.
          </p>
        </div>
      </section>

      {/* ── ENROLL ── */}
      <EnrollSection />

      {/* ── FOOTER ── */}
      <footer className="bg-teal-700 text-white py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Image src="/logo.PNG" alt="Elevate Health" width={140} height={70} unoptimized style={{height: '70px', width: 'auto', filter: 'brightness(0) invert(1)'}} />
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
