'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const FULLSCRIPT_URL = 'https://us.fullscript.com/u/plans/TXVsdGlQYXRpZW50UGxhbi0xNzMzMTg=';

const SUPPLEMENTS = [
  {
    name: 'Turmeric & Curcumin Complex',
    benefit: 'Powerful anti-inflammatory support for joints and spine',
    icon: '🌿',
    why: 'Clinically studied to reduce inflammatory markers — the root driver of most chronic pain.',
  },
  {
    name: 'Omega-3 Fish Oil',
    benefit: 'Reduces systemic inflammation and supports nerve health',
    icon: '🐟',
    why: 'EPA and DHA help calm nerve pain and protect disc and joint tissue.',
  },
  {
    name: 'Magnesium Glycinate',
    benefit: 'Relieves muscle tension, spasms, and promotes deep sleep',
    icon: '💊',
    why: 'Most chronic pain patients are deficient in magnesium — the #1 muscle relaxation mineral.',
  },
  {
    name: 'Collagen Peptides',
    benefit: 'Rebuilds cartilage, discs, tendons, and connective tissue',
    icon: '🦴',
    why: 'Type I & II collagen directly supports spinal disc regeneration and joint cushioning.',
  },
  {
    name: 'Vitamin D3 + K2',
    benefit: 'Strengthens bones and regulates calcium for spinal health',
    icon: '☀️',
    why: 'Low Vitamin D is linked to chronic musculoskeletal pain and slow recovery.',
  },
];

const WHY_FULLSCRIPT = [
  {
    icon: '💰',
    title: 'Exclusive Patient Discounts',
    desc: 'Save 15% on your first order and 10% on all future orders through Dr. Oliveri’s dispensary. Auto-refill subscribers save an additional 5%.',
  },
  {
    icon: '🏥',
    title: 'Practitioner Grade',
    desc: 'Only professional-grade brands available exclusively through licensed practitioners — the same quality used in clinical settings.',
  },
  {
    icon: '🔬',
    title: '3rd Party Tested',
    desc: 'Every product is independently tested for purity, potency, and accuracy of label claims before it reaches you.',
  },
  {
    icon: '🚚',
    title: 'Ships to Your Door',
    desc: 'Orders ship directly to your home with fast, discreet delivery. Free shipping available on qualifying orders.',
  },
];

const TESTIMONIALS = [
  {
    name: 'Sarah M.',
    location: 'Tampa, FL',
    text: 'After 3 months on Dr. Oliveri\'s supplement protocol alongside his rehab program, my back pain has dropped from a 7 to a 2. I finally sleep through the night.',
    stars: 5,
  },
  {
    name: 'James R.',
    location: 'St. Petersburg, FL',
    text: 'I was skeptical about supplements but the combination of Turmeric and Fish Oil made a noticeable difference within weeks. My neck stiffness is almost completely gone.',
    stars: 5,
  },
  {
    name: 'Linda K.',
    location: 'Clearwater, FL',
    text: 'The magnesium alone was a game-changer for my muscle spasms. Dr. Oliveri\'s protocol is the missing piece I never knew I needed.',
    stars: 5,
  },
];

const FAQS = [
  {
    q: 'Do I need to be a current patient to order?',
    a: 'No. Anyone can create a free Fullscript account using Dr. Oliveri\'s practitioner link and access the curated protocol at a discount.',
  },
  {
    q: 'Are these supplements safe to take together?',
    a: 'Yes. Dr. Oliveri specifically selected these five supplements because they work synergistically with no known negative interactions. As always, consult your physician if you are on prescription medications.',
  },
  {
    q: 'How long until I feel a difference?',
    a: 'Most patients notice reduced muscle tension and improved sleep within 2–3 weeks of starting Magnesium. Anti-inflammatory benefits from Turmeric and Fish Oil typically build over 4–8 weeks of consistent use.',
  },
  {
    q: 'Why Fullscript instead of Amazon or a health food store?',
    a: 'Fullscript carries only professional-grade brands that meet strict quality standards. Many supplements sold on Amazon are underdosed, mislabeled, or contaminated. Your health is worth the difference.',
  },
  {
    q: 'Is there a subscription or auto-ship?',
    a: 'Fullscript offers optional auto-refill with an additional 5% discount on top of your patient pricing, but it is completely optional. You can order one-time whenever you need a refill.',
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

function SupplementCard({ s }: { s: typeof SUPPLEMENTS[number] }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="text-4xl mb-4">{s.icon}</div>
      <h3 className="text-lg font-black text-gray-900 mb-1">{s.name}</h3>
      <p className="text-teal-700 font-semibold text-sm mb-3">{s.benefit}</p>
      <p className="text-gray-500 text-sm leading-relaxed">{s.why}</p>
    </div>
  );
}

export default function SupplementsPage() {
  return (
    <main className="min-h-screen font-sans overflow-x-hidden">

      {/* ── NAV ── */}
      <nav className="bg-teal-900 px-4 sm:px-6 py-3 sm:py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <img
            src="/logo.PNG"
            alt="Elevate Health"
            style={{ height: 'clamp(48px, 10vw, 80px)', width: 'auto', filter: 'brightness(0) invert(1)', flexShrink: 0 }}
          />
          <a
            href={FULLSCRIPT_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              backgroundColor: '#F5C842',
              color: '#1a1a1a',
              fontWeight: 'bold',
              borderRadius: '8px',
              textDecoration: 'none',
              textAlign: 'center',
              lineHeight: '1.3',
            }}
            className="text-xs sm:text-sm px-3 py-2 sm:px-6 sm:py-3"
          >
            View Full Protocol →
          </a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/scoliosis.jpeg"
            alt="Spine background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-teal-900/80" />
        </div>
        <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto w-full">
          <span className="inline-block bg-yellow-400 text-yellow-900 font-bold text-xs sm:text-sm uppercase tracking-widest px-3 sm:px-4 py-1.5 rounded-full mb-6">
            Clinician-Curated Supplements for Pain Relief
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-tight mb-6" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.5)' }}>
            <span className="block">Supplements to End Your</span>
            <span className="block">Chronic Pain Naturally.</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-teal-100 mb-4 max-w-2xl mx-auto">
            The exact 5-supplement protocol Dr. Oliveri uses in his clinical practice — now available to you at an exclusive patient discount through Fullscript.
          </p>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-teal-200 mb-8">
            <span>✓ Professional-Grade Only</span>
            <span>✓ Third-Party Tested</span>
            <span>✓ Exclusive Patient Pricing</span>
          </div>
          <a
            href={FULLSCRIPT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full sm:w-auto bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-black text-base sm:text-lg px-6 sm:px-10 py-4 rounded-full shadow-xl transition-all hover:scale-105"
          >
            Access My Protocol on Fullscript →
          </a>
          <div className="mt-6 flex justify-center items-center gap-1 text-yellow-400">
            {'★★★★★'}
            <span className="text-teal-200 text-sm ml-2">500+ patients trust this protocol</span>
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
            <p className="text-teal-600 font-semibold uppercase tracking-widest text-sm mb-2">Your Doctor</p>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">Dr. Connor Oliveri, DC</h2>
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-4">
              Dr. Oliveri is a Doctor of Chiropractic specializing in non-surgical spinal rehabilitation, serving patients throughout the Tampa Bay area. After years of helping patients recover from chronic neck and back pain, he developed this supplement protocol to address the nutritional deficiencies that keep most people stuck in a cycle of pain.
            </p>
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-6">
              &ldquo;Rehabilitation alone only gets you so far. When you pair the right exercise protocol with targeted nutritional support, patients heal faster and stay pain-free longer. These are the five supplements I recommend to virtually every patient I see.&rdquo;
            </p>
            <a
              href={FULLSCRIPT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-full sm:w-auto bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-bold px-8 py-3 rounded-full shadow transition-all hover:scale-105 text-center"
            >
              View the Full Protocol →
            </a>
          </div>
        </div>
      </section>

      {/* ── THE PROTOCOL ── */}
      <section className="bg-gray-50 py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-teal-600 font-semibold uppercase tracking-widest text-sm mb-2">The Protocol</p>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">5 Supplements. One Goal: Less Pain.</h2>
            <p className="text-gray-500 text-base sm:text-lg max-w-2xl mx-auto">Each supplement was chosen for a specific reason. Together they target inflammation, nerve health, muscle tension, tissue repair, and bone density.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            {SUPPLEMENTS.slice(0, 4).map((s) => (
              <SupplementCard key={s.name} s={s} />
            ))}
          </div>

          <div className="flex justify-center mb-12">
            <div className="w-full sm:w-1/2">
              <SupplementCard s={SUPPLEMENTS[4]} />
            </div>
          </div>

          <div className="text-center">
            <a
              href={FULLSCRIPT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-full sm:w-auto bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-black text-base sm:text-lg px-6 sm:px-10 py-4 rounded-full shadow-xl transition-all hover:scale-105 text-center"
            >
              Order All 5 Supplements at a Discount →
            </a>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="bg-white py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-teal-600 font-semibold uppercase tracking-widest text-sm mb-2">How It Works</p>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900">Three Steps to Get Started</h2>
          </div>
          <div className="relative">
            <div className="hidden sm:block absolute left-8 top-8 bottom-8 w-0.5 bg-teal-100" />
            <div className="space-y-8">
              {[
                { n: 1, title: 'Create Your Free Fullscript Account', desc: 'Click the button below to access Dr. Oliveri\'s practitioner storefront on Fullscript. Creating an account is free and takes less than 2 minutes.' },
                { n: 2, title: 'Select Your Supplements', desc: 'Browse the curated protocol and add whichever supplements you need to your cart. Your patient discount is applied automatically at checkout.' },
                { n: 3, title: 'Receive & Start Your Protocol', desc: 'Your order ships directly to your door. Follow the simple dosing guide included with each product and track your progress over the coming weeks.' },
              ].map((step) => (
                <div key={step.n} className="flex gap-4 sm:gap-6 items-start">
                  <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-teal-600 text-white flex items-center justify-center text-xl sm:text-2xl font-black shadow-lg">
                    {step.n}
                  </div>
                  <div className="pt-2 sm:pt-3">
                    <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY FULLSCRIPT ── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6" style={{ backgroundColor: '#E1F5EE' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-teal-600 font-semibold uppercase tracking-widest text-sm mb-2">Why Fullscript</p>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900">Professional Quality. Patient Pricing.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {WHY_FULLSCRIPT.map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-6 shadow-sm flex gap-4 items-start">
                <span className="text-3xl flex-shrink-0">{item.icon}</span>
                <div>
                  <h3 className="text-lg font-black text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="bg-white py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-teal-600 font-semibold uppercase tracking-widest text-sm mb-2">Results</p>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900">Real Patients. Real Relief.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
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
            <p className="text-teal-600 font-semibold uppercase tracking-widest text-sm mb-2">FAQ</p>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900">Common Questions</h2>
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
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Ready to Start Feeling Better?</h2>
          <p className="text-teal-200 text-base sm:text-lg mb-8">Join hundreds of patients who have added Dr. Oliveri&apos;s supplement protocol to their recovery and started living with less pain.</p>
          <a
            href={FULLSCRIPT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full sm:w-auto bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-black text-lg sm:text-xl px-6 sm:px-12 py-5 rounded-full shadow-2xl transition-all hover:scale-105 text-center"
          >
            Access My Protocol — Save 15% Today →
          </a>
          <p className="text-teal-300 text-sm mt-4">Free shipping on qualifying orders. No subscription required.</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-teal-950 py-12 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <img
              src="/logo.PNG"
              alt="Elevate Health"
              style={{ height: 'clamp(48px, 10vw, 80px)', width: 'auto', filter: 'brightness(0) invert(1)', marginBottom: '16px' }}
            />
            <p className="text-teal-400 text-sm">Tampa Bay&apos;s Premier Spinal Rehabilitation Clinic</p>
          </div>
          <div className="border-t border-teal-800 pt-8 text-center">
            <p className="text-teal-500 text-xs leading-relaxed max-w-3xl mx-auto mb-4">
              *These statements have not been evaluated by the Food and Drug Administration. These products are not intended to diagnose, treat, cure, or prevent any disease. Always consult with a qualified healthcare provider before starting any new supplement regimen, especially if you are pregnant, nursing, have a medical condition, or are taking medications.
            </p>
            <p className="text-teal-600 text-xs mb-4">© {new Date().getFullYear()} Elevate Health Tampa. All rights reserved.</p>
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
