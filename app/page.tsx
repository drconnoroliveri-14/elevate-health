'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import EnrollSection from '@/app/components/EnrollSection';

const FULLSCRIPT_URL = 'https://us.fullscript.com/welcome/elevatehealth-75cdea33-a471-46ca-83c8-7e492b97030a';
const NAVY = '#1B3A6B';

const SUPPLEMENTS = [
  {
    name: 'Turmeric & Curcumin Complex',
    desc: 'Directly inhibits inflammatory pathways that cause chronic joint and spinal pain',
    icon: '🌿',
  },
  {
    name: 'Fish Oil / Omega-3',
    desc: 'Reduces systemic inflammation at the cellular level and decreases joint stiffness',
    icon: '🐟',
  },
  {
    name: 'Magnesium Glycinate',
    desc: 'Reduces muscle spasms, tension, and nighttime pain that disrupts sleep',
    icon: '💊',
  },
  {
    name: 'Collagen Peptides',
    desc: 'Provides building blocks for disc repair, joint cartilage, and connective tissue recovery',
    icon: '🦴',
  },
  {
    name: 'Vitamin D3 + K2',
    desc: 'Essential for bone density and strongly linked to reduction in chronic musculoskeletal pain',
    icon: '☀️',
  },
];

const TESTIMONIALS = [
  {
    name: 'Sarah M.',
    location: 'Tampa, FL',
    text: 'After 3 months on Dr. Oliveri\'s program, my back pain has dropped from a 7 to a 2. I finally sleep through the night.',
    stars: 5,
  },
  {
    name: 'James R.',
    location: 'St. Petersburg, FL',
    text: 'I was skeptical, but the combination of the rehab program and supplements made a noticeable difference within weeks. My neck stiffness is almost completely gone.',
    stars: 5,
  },
  {
    name: 'Linda K.',
    location: 'Clearwater, FL',
    text: 'The program was a game-changer for my muscle spasms. Dr. Oliveri\'s protocol is the missing piece I never knew I needed.',
    stars: 5,
  },
];

const FAQS = [
  {
    q: 'What is the Pain-Free Program?',
    a: 'The Elevate Pain-Free Program is a complete 7-module at-home chiropractic rehabilitation system developed by Dr. Connor Oliveri. You get instant dashboard access after purchase and can begin immediately.',
  },
  {
    q: 'How do I access the program after purchase?',
    a: 'Within minutes of purchase you will receive a welcome email with your personal login credentials. Log in at elevatehealthtampa.com/login to access your dashboard instantly.',
  },
  {
    q: 'What is the supplement protocol?',
    a: 'Dr. Oliveri has curated 5 practitioner-grade supplements that target the root causes of chronic pain — inflammation, muscle tension, and poor tissue recovery. Ordered through Fullscript and delivered to your door.',
  },
  {
    q: 'Can I do both the program AND the supplements?',
    a: 'Absolutely — and it is highly recommended. The program addresses movement dysfunction while the supplements address the biological drivers of inflammation. Together they produce the fastest results.',
  },
  {
    q: 'Is there a money-back guarantee on the program?',
    a: 'Yes. The Pain-Free Program comes with a 90-day money-back guarantee. Complete all 7 modules and log in for at least 30 days within your 90-day window to qualify.',
  },
  {
    q: 'What discount do I get on supplements?',
    a: 'Through Dr. Oliveri\'s Fullscript dispensary you save 15% on your first order and 10% on all future orders. Auto-refill subscribers save an additional 5%.',
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        className="w-full flex justify-between items-center p-5 text-left bg-white hover:bg-gray-50 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className="font-semibold text-gray-800 pr-4">{q}</span>
        <span className="text-teal-600 text-xl flex-shrink-0">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="px-5 pb-5 bg-white">
          <p className="text-gray-600 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function UnifiedLandingPage() {
  return (
    <main className="min-h-screen font-sans overflow-x-hidden">

      {/* ── NAV ── */}
      <nav className="bg-teal-900 px-4 sm:px-6 py-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <img
            src="/logo.PNG"
            alt="Elevate Health"
            style={{ height: '80px', width: 'auto', filter: 'brightness(0) invert(1)', flexShrink: 0 }}
          />
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <a
              href="#program"
              style={{
                backgroundColor: '#F5C842',
                color: '#1a1a1a',
                fontWeight: 'bold',
                borderRadius: '8px',
                textDecoration: 'none',
                textAlign: 'center',
              }}
              className="w-full sm:w-auto px-5 py-2.5 text-sm whitespace-nowrap"
            >
              Pain-Free Program — $97
            </a>
            <a
              href={FULLSCRIPT_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: NAVY,
                color: 'white',
                fontWeight: 'bold',
                borderRadius: '8px',
                textDecoration: 'none',
                textAlign: 'center',
              }}
              className="w-full sm:w-auto px-5 py-2.5 text-sm whitespace-nowrap"
            >
              View Supplement Protocol
            </a>
            <Link
              href="/login"
              style={{
                backgroundColor: '#FFFFFF',
                color: '#1a1a1a',
                fontWeight: 'bold',
                borderRadius: '8px',
                textDecoration: 'none',
                textAlign: 'center',
              }}
              className="hidden sm:inline px-5 py-2.5 text-sm whitespace-nowrap transition-colors hover:opacity-90"
            >
              Member Login
            </Link>
          </div>
        </div>
      </nav>

      {/* ── SPLIT HERO ── */}
      <section className="overflow-hidden">
        {/* Split layout — stacks vertically on mobile, side-by-side on sm+ */}
        <div className="flex flex-col sm:flex-row" style={{ minHeight: '80vh' }}>

          {/* LEFT — Pain-Free Program (teal) */}
          <div
            className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-16 py-14 sm:py-20"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative',
            }}
          >
            <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15,110,86,0.75)' }} />
            <div style={{ position: 'relative' }} className="flex flex-col">
              <span
                className="inline-block text-xs uppercase tracking-widest font-bold px-4 py-1.5 rounded-full mb-6 self-start"
                style={{ backgroundColor: '#F5C842', color: '#1a1a1a' }}
              >
                AT-HOME REHABILITATION
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-4">
                The Pain-Free Program
              </h2>
              <p className="text-green-100 text-base sm:text-lg mb-6 leading-relaxed max-w-md">
                7 chiropractor-designed modules to eliminate chronic neck and back pain from home in just 20 minutes a day
              </p>
              <ul className="space-y-3 mb-8">
                {['7 Video Modules', 'Lifetime Access', '90-Day Guarantee', 'Instant Access'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-white text-sm sm:text-base">
                    <span style={{ color: '#F5C842', fontWeight: 900, fontSize: '1.1rem' }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="#program"
                className="inline-block w-full sm:w-auto text-center font-black text-base sm:text-lg px-8 py-4 rounded-full shadow-xl transition-all hover:scale-105"
                style={{ backgroundColor: '#F5C842', color: '#1a1a1a' }}
              >
                Get Started — $97 →
              </a>
            </div>
          </div>

          {/* Gold dividing line (desktop only) */}
          <div
            className="hidden sm:block flex-shrink-0"
            style={{ width: '3px', backgroundColor: '#F5C842' }}
          />

          {/* RIGHT — Supplement Protocol (navy) */}
          <div
            className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-16 py-14 sm:py-20"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1200&q=80)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative',
            }}
          >
            <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(27,58,107,0.75)' }} />
            <div style={{ position: 'relative' }} className="flex flex-col">
              <span
                className="inline-block text-xs uppercase tracking-widest font-bold px-4 py-1.5 rounded-full mb-6 self-start"
                style={{ backgroundColor: '#E8EEF7', color: NAVY }}
              >
                CLINICIAN-CURATED SUPPLEMENTS
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-4">
                The Supplement Protocol
              </h2>
              <p className="text-blue-200 text-base sm:text-lg mb-6 leading-relaxed max-w-md">
                5 practitioner-grade supplements to fight inflammation, reduce muscle tension, and accelerate your pain recovery
              </p>
              <ul className="space-y-3 mb-8">
                {['5 Targeted Supplements', '15% First Order Discount', 'Ships to Your Door', 'Practitioner Grade'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-white text-sm sm:text-base">
                    <span style={{ color: '#93C5FD', fontWeight: 900, fontSize: '1.1rem' }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href={FULLSCRIPT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full sm:w-auto text-center font-black text-base sm:text-lg px-8 py-4 rounded-full shadow-xl transition-all hover:scale-105"
                style={{ border: '2px solid white', color: 'white', backgroundColor: 'transparent' }}
              >
                View Protocol →
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* ── MEET DR. OLIVERI ── */}
      <section className="bg-white py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-10 sm:gap-12">
          <div className="flex-shrink-0">
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden ring-4 ring-teal-500 shadow-2xl">
              <Image src="/5.jpg" alt="Dr. Connor Oliveri" fill className="object-cover" />
            </div>
          </div>
          <div>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-1">Meet Dr. Connor Oliveri, DC</h2>
            <p className="text-teal-600 font-semibold text-sm mb-5">Doctor of Chiropractic | Tampa, FL</p>
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-6">
              After years of treating patients with chronic neck and back pain, I developed two powerful tools to help my patients get lasting relief — a complete 7-module at-home rehabilitation program AND a clinician-curated supplement protocol to fight inflammation and accelerate recovery. Together they form the most complete at-home pain relief system available.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#program"
                className="inline-block w-full sm:w-auto bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-bold px-8 py-3 rounded-full shadow transition-all hover:scale-105 text-center"
              >
                View the Program →
              </a>
              <a
                href={FULLSCRIPT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full sm:w-auto font-bold px-8 py-3 rounded-full shadow transition-all hover:scale-105 hover:opacity-90 text-center"
                style={{ backgroundColor: NAVY, color: 'white' }}
              >
                View Supplement Protocol →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── PAIN-FREE PROGRAM ── */}
      <section id="program" className="bg-gray-50 py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-block bg-yellow-400 text-yellow-900 font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
              At-Home Rehabilitation Program
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">The Elevate Pain-Free Program</h2>
            <p className="text-gray-500 text-base sm:text-lg max-w-2xl mx-auto mb-5">
              A complete 7-module chiropractic rehabilitation system for chronic neck and back pain — done entirely from home in just 20 minutes a day
            </p>
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="text-gray-400 line-through text-xl">$378</span>
              <span className="text-teal-600 font-black text-3xl">$97</span>
            </div>
            <p className="text-red-500 font-semibold text-sm">Limited time offer — save $281 today</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-8">
            <ul className="space-y-3">
              {[
                '7 chiropractic care rehabilitation modules',
                'Lifetime access + all future updates',
                '90-day personal pain-free protocol',
                'Pain Tracking Journal ($47 value)',
                'Posture Correction Quick Reference Guide ($37 value)',
                '90-Day Posture Photo Tracker ($97 value)',
                '90-day money-back guarantee',
                'Secure checkout · Instant delivery',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-gray-700 text-sm sm:text-base">
                  <span className="text-green-500 font-black text-lg leading-none mt-0.5 flex-shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <EnrollSection />
        </div>
      </section>

      {/* ── SUPPLEMENT PROTOCOL ── */}
      <section className="bg-white py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span
              className="inline-block font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full mb-4"
              style={{ backgroundColor: '#E8EEF7', color: NAVY }}
            >
              Clinician-Curated Supplements
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">
              Dr. Oliveri&apos;s Pain Relief Supplement Protocol
            </h2>
            <p className="text-gray-500 text-base sm:text-lg max-w-2xl mx-auto">
              Five practitioner-grade supplements targeting the root causes of chronic pain — delivered directly to your door
            </p>
          </div>

          {/* 2×2 grid for first 4 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
            {SUPPLEMENTS.slice(0, 4).map((s) => (
              <div
                key={s.name}
                className="border-2 rounded-2xl p-5 hover:shadow-md transition-all"
                style={{ borderColor: NAVY }}
              >
                <div className="text-3xl mb-3">{s.icon}</div>
                <h3 className="font-black text-gray-900 mb-2">{s.name}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          {/* 5th card centered */}
          <div className="flex justify-center mb-10">
            <div className="w-full sm:w-1/2">
              <div
                className="border-2 rounded-2xl p-5 hover:shadow-md transition-all"
                style={{ borderColor: NAVY }}
              >
                <div className="text-3xl mb-3">{SUPPLEMENTS[4].icon}</div>
                <h3 className="font-black text-gray-900 mb-2">{SUPPLEMENTS[4].name}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{SUPPLEMENTS[4].desc}</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="font-semibold text-sm mb-5" style={{ color: NAVY }}>
              💰 Save 15% on your first order · 10% on all future orders
            </p>
            <a
              href={FULLSCRIPT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-full sm:w-auto font-black text-base sm:text-lg px-8 sm:px-10 py-4 rounded-full shadow-xl transition-all hover:scale-105 hover:opacity-90 text-center"
              style={{ backgroundColor: NAVY, color: 'white' }}
            >
              Order Supplements with 15% Discount →
            </a>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6" style={{ backgroundColor: '#E1F5EE' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900">Two Ways to End Your Pain</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Program card */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 flex flex-col">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-black text-gray-900 mb-4">The Rehabilitation Program</h3>
              <ol className="space-y-3 mb-6 flex-1">
                {[
                  'Purchase for $97',
                  'Receive instant dashboard access',
                  'Follow 7 modules at home',
                  'Become pain-free in 90 days',
                ].map((step, i) => (
                  <li key={step} className="flex items-start gap-3 text-gray-600 text-sm">
                    <span className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
              <a
                href="#program"
                className="inline-block w-full bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-black px-6 py-3 rounded-full shadow transition-all hover:scale-105 text-center text-sm"
              >
                Get Started — $97 →
              </a>
            </div>

            {/* Supplement card */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 flex flex-col">
              <div className="text-4xl mb-4">💊</div>
              <h3 className="text-xl font-black text-gray-900 mb-4">The Supplement Protocol</h3>
              <ol className="space-y-3 mb-6 flex-1">
                {[
                  'Click the link below',
                  'Create free Fullscript account',
                  "Order Dr. Oliveri's protocol",
                  'Supplements delivered to your door',
                ].map((step, i) => (
                  <li key={step} className="flex items-start gap-3 text-gray-600 text-sm">
                    <span
                      className="w-6 h-6 rounded-full text-white text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: NAVY }}
                    >
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
              <a
                href={FULLSCRIPT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full font-black px-6 py-3 rounded-full shadow transition-all hover:scale-105 hover:opacity-90 text-center text-sm"
                style={{ backgroundColor: NAVY, color: 'white' }}
              >
                View Protocol →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="bg-white py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900">What People are Saying...</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-gray-50 rounded-2xl p-6 border-t-4 border-teal-500">
                <div className="text-yellow-400 text-lg mb-3">{'★'.repeat(t.stars)}</div>
                <p className="text-gray-700 leading-relaxed mb-4 text-sm">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <p className="font-black text-gray-900 text-sm">{t.name}</p>
                  <p className="text-gray-400 text-xs">{t.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-gray-50 py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="bg-gradient-to-br from-teal-700 to-teal-900 py-16 sm:py-20 px-4 sm:px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Start Your Pain Relief Journey Today
          </h2>
          <p className="text-teal-200 text-base sm:text-lg mb-8">
            Choose the approach that works best for you — or combine both for maximum results.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="#program"
              className="inline-block w-full sm:w-auto bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-black text-base sm:text-lg px-8 py-4 rounded-full shadow-2xl transition-all hover:scale-105 text-center"
            >
              Get the Pain-Free Program — $97 →
            </a>
            <a
              href={FULLSCRIPT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-full sm:w-auto font-black text-base sm:text-lg px-8 py-4 rounded-full shadow-2xl transition-all hover:scale-105 hover:opacity-90 text-center"
              style={{ backgroundColor: NAVY, color: 'white' }}
            >
              View Supplement Protocol →
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-teal-950 py-12 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-6">
            <img
              src="/logo.PNG"
              alt="Elevate Health"
              style={{
                height: '60px',
                width: 'auto',
                filter: 'brightness(0) invert(1)',
                display: 'inline-block',
                marginBottom: '12px',
              }}
            />
          </div>
          <div className="border-t border-teal-800 pt-8 text-center">
            <p className="text-teal-500 text-xs leading-relaxed max-w-3xl mx-auto mb-4">
              These statements have not been evaluated by the Food and Drug Administration. These products are not intended to diagnose, treat, cure, or prevent any disease.
            </p>
            <p className="text-teal-600 text-xs mb-4">© 2026 Elevate Health. All rights reserved.</p>
            <div className="flex justify-center gap-6 text-teal-500 text-xs">
              <Link href="/privacy" className="hover:text-teal-300 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-teal-300 transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>

    </main>
  );
}
