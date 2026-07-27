'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import EnrollSection from '@/app/components/EnrollSection';

const MODULES = [
  { num: 1, title: 'Understanding Your Pain', desc: 'Discover the three root causes of chronic neck and back pain — muscle imbalances, movement pattern dysfunction, and postural collapse — and why most treatments fail to address them.' },
  { num: 2, title: 'Neck Pain Relief Protocol', desc: 'A targeted sequence of cervical spine exercises to reduce neck tension, restore range of motion, and eliminate the nerve compression that causes radiating pain and headaches.' },
  { num: 3, title: 'Mid Back Pain Relief Protocol', desc: 'Thoracic mobility and strengthening exercises to correct the mid-back stiffness caused by prolonged sitting, poor posture, and desk work.' },
  { num: 4, title: 'Lower Back Pain Relief Protocol', desc: 'The McGill Big Three and supporting exercises to stabilize the lumbar spine, relieve disc pressure, and eliminate the lower back pain that limits your daily life.' },
  { num: 5, title: 'Posture Correction & Alignment', desc: 'A full-body alignment system to retrain your posture from the ground up — addressing foot pronation, pelvic tilt, shoulder rounding, and forward head posture simultaneously.' },
  { num: 6, title: 'Strengthening for a Pain-Free Life', desc: 'A progressive functional strength protocol to build the deep stabilizer muscles that keep you pain-free long after the program — so the pain never comes back.' },
  { num: 7, title: 'Your Personal 90-Day Pain-Free Protocol', desc: 'Your complete customized 90-day maintenance protocol, combining all seven modules into a daily practice that fits your schedule and keeps you pain-free for life.' },
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
    text: 'I was skeptical at first, but the program made a noticeable difference within weeks. My neck stiffness is almost completely gone.',
    stars: 5,
  },
  {
    name: 'Linda K.',
    location: 'Clearwater, FL',
    text: 'The program was a game-changer for my muscle spasms. Dr. Oliveri\'s protocol is the missing piece I never knew I needed.',
    stars: 5,
  },
];

const BONUSES = [
  {
    icon: '📓',
    title: 'Pain Tracking Journal',
    value: '$47',
    desc: 'A daily pain scoring system to document your progress, identify triggers, and see exactly how far you have come from day 1 to day 90.',
  },
  {
    icon: '📐',
    title: 'Posture Correction Quick Reference Guide',
    value: '$37',
    desc: 'A printable at-a-glance guide with the key alignment cues for every exercise — so you always know exactly what to do.',
  },
  {
    icon: '📸',
    title: '90-Day Posture Photo Tracker',
    value: '$97',
    desc: 'Upload before-and-after posture photos directly in your dashboard and watch your alignment transform over your 90-day protocol.',
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
    q: 'How long does the program take each day?',
    a: 'Each module is designed to be completed in about 20 minutes. You can progress at your own pace — most people complete all 7 modules within the first two weeks and then follow the 90-day protocol.',
  },
  {
    q: 'Is there a money-back guarantee?',
    a: 'Yes. The Pain-Free Program comes with a 90-day money-back guarantee. Complete all 7 modules and log in for at least 30 days within your 90-day window to qualify for a full refund.',
  },
  {
    q: 'Do I need any equipment?',
    a: 'Most exercises require no equipment at all. A few modules use a foam roller or resistance band — affordable items available on Amazon for under $30 total.',
  },
  {
    q: 'Is this program right for my type of pain?',
    a: 'The program is designed for chronic neck pain, mid back pain, and lower back pain including disc issues, muscle spasms, posture-related pain, and nerve impingement. If you have had recent surgery please consult your physician before starting.',
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen font-sans overflow-x-hidden">

      {/* ── NAV ── */}
      <nav className="bg-teal-900 px-4 sm:px-6 py-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex-shrink-0">
            <Link href="/">
              <img
                src="/logo.PNG"
                alt="Elevate Health"
                style={{ height: '80px', width: 'auto', filter: 'brightness(0) invert(1)' }}
              />
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <Link
              href="/login"
              className="w-full sm:w-auto px-5 py-2.5 text-sm font-bold rounded-lg text-center transition-colors hover:opacity-90"
              style={{ backgroundColor: '#FFFFFF', color: '#1a1a1a', textDecoration: 'none' }}
            >
              Member Login
            </Link>
            <a
              href="#enroll"
              className="w-full sm:w-auto px-5 py-2.5 text-sm font-bold rounded-lg text-center whitespace-nowrap transition-all hover:scale-105"
              style={{ backgroundColor: '#F5C842', color: '#1a1a1a', textDecoration: 'none' }}
            >
              Yes, I Want Access to the Modules →
            </a>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section
        className="relative flex items-center justify-center text-center px-4 sm:px-6 py-20 sm:py-28 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0c5e48 0%, #0F6E56 50%, #1a8a6e 100%)' }}
      >
        {/* Background image at low opacity */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/scoliosis.jpeg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.12,
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto">
          <span
            className="inline-block text-xs uppercase tracking-widest font-bold px-4 py-1.5 rounded-full mb-6"
            style={{ backgroundColor: '#F5C842', color: '#1a1a1a' }}
          >
            Developed by Licensed Chiropractors
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
            Finally End Your<br />Neck &amp; Back Pain.
          </h1>
          <div className="flex justify-center mb-6">
            <span
              className="inline-block text-sm sm:text-base font-bold px-5 py-2 rounded-full"
              style={{ backgroundColor: '#F5C842', color: '#1a1a1a' }}
            >
              From Home, Without Surgery or Medication
            </span>
          </div>
          <p className="text-green-100 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-8">
            The Elevate Pain-Free Program gives you a proven at-home rehabilitation system used by chiropractors — so you can eliminate neck, mid back, and lower back pain for good.
          </p>
          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {[
              'Developed by Licensed Chiropractors',
              'Step-by-step video exercises',
              '90-day pain-free guarantee',
            ].map((badge) => (
              <span key={badge} className="inline-flex items-center gap-1.5 bg-white/15 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                <span className="text-yellow-400">✓</span> {badge}
              </span>
            ))}
          </div>
          {/* Star rating */}
          <p className="text-yellow-400 font-semibold text-sm mb-8">
            ★★★★★ <span className="text-green-200">Trusted by 2,000+ people with chronic pain</span>
          </p>
          <a
            href="#enroll"
            className="inline-block font-black text-lg px-10 py-5 rounded-full shadow-2xl transition-all hover:scale-105"
            style={{ backgroundColor: '#F5C842', color: '#1a1a1a' }}
          >
            Yes, I Want Access to the Modules →
          </a>
        </div>
      </section>

      {/* ── VSL VIDEO ── */}
      <section className="bg-gray-900 py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute inset-0 w-full h-full rounded-2xl shadow-2xl"
              src="https://www.youtube.com/embed/92oXxshiqFM"
              title="Elevate Pain-Free Program"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* ── THE PROCESS ── */}
      <section className="bg-gray-50 py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                title: 'Purchase the Program',
                desc: 'Complete your secure checkout for $97. Within minutes you will receive a welcome email with your personal login credentials and everything you need to get started immediately.',
              },
              {
                step: 2,
                title: 'Log In and Access Your Dashboard',
                desc: 'Use your login credentials to access your personal dashboard at elevatehealthtampa.com/login. All 7 modules, your bonuses, and any add-ons you selected are waiting for you instantly.',
              },
              {
                step: 3,
                title: 'Become Pain-Free',
                desc: 'Follow the 7 modules at your own pace — just 20 minutes a day from home. Apply the 90-day protocol and eliminate your neck and back pain for good.',
              },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex flex-col items-center text-center">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-white font-black text-xl mb-4 shadow-lg"
                  style={{ backgroundColor: '#0F6E56' }}
                >
                  {step}
                </div>
                <h3 className="font-black text-gray-900 text-lg mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
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
              After years of treating patients with chronic neck and back pain, I developed the Elevate Pain-Free Program to give my patients a complete at-home rehabilitation system they could follow on their own schedule — without expensive clinic visits, surgery, or medication.
            </p>
            <a
              href="#enroll"
              className="inline-block font-bold px-8 py-3 rounded-full shadow transition-all hover:scale-105 text-center"
              style={{ backgroundColor: '#F5C842', color: '#1a1a1a' }}
            >
              View the Program →
            </a>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="bg-gray-50 py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900">What People are Saying</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-6 border-t-4 border-teal-500 shadow-sm">
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

      {/* ── 7 MODULES ── */}
      <section className="bg-white py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block bg-yellow-400 text-yellow-900 font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
              Inside the Program
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900">7 Chiropractic Rehabilitation Modules</h2>
            <p className="text-gray-500 text-base sm:text-lg mt-3 max-w-2xl mx-auto">
              Every module is a complete step in your recovery — building on the last until you are fully pain-free.
            </p>
          </div>
          <div className="space-y-4">
            {MODULES.map((m) => (
              <div key={m.num} className="flex items-start gap-4 bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: '#0F6E56' }}
                >
                  {m.num}
                </div>
                <div>
                  <h3 className="font-black text-gray-900 mb-1">{m.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FREE BONUSES ── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6" style={{ backgroundColor: '#E1F5EE' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block bg-yellow-400 text-yellow-900 font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
              Included Free
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900">Free Bonuses</h2>
            <p className="text-gray-600 text-base sm:text-lg mt-3">
              Included with your program at no extra charge — total bonus value $181
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {BONUSES.map((b) => (
              <div key={b.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
                <div className="text-4xl mb-3">{b.icon}</div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-black text-gray-900 text-base leading-tight">{b.title}</h3>
                  <span className="inline-block bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5">
                    {b.value} value
                  </span>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed flex-1">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GUARANTEE ── */}
      <section className="bg-white py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
            style={{ backgroundColor: '#0F6E56' }}
          >
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">90-Day Money-Back Guarantee</h2>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
            If you complete all 7 modules, log in for at least 30 days, and follow the 90-day protocol — and you are not satisfied with your results — request a full refund from your dashboard between days 90 and 120. No questions asked.
          </p>
        </div>
      </section>

      {/* ── ENROLL ── */}
      <section id="enroll" className="bg-gray-50 py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-block bg-yellow-400 text-yellow-900 font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
              Instant Access
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

      {/* ── FAQ ── */}
      <section className="bg-white py-16 sm:py-20 px-4 sm:px-6">
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

      {/* ── FOOTER ── */}
      <footer className="bg-teal-950 py-12 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-center">
          <Link href="/">
            <img
              src="/logo.PNG"
              alt="Elevate Health"
              style={{
                height: '60px',
                width: 'auto',
                filter: 'brightness(0) invert(1)',
                display: 'inline-block',
                marginBottom: '16px',
              }}
            />
          </Link>
          <div className="border-t border-teal-800 pt-6">
            <p className="text-teal-600 text-xs mb-4">© {new Date().getFullYear()} Elevate Health. All rights reserved.</p>
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
