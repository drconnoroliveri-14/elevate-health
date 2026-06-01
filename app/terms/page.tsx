import Link from "next/link";

const LAST_UPDATED = "May 2025";
const CONTACT_EMAIL = "support@elevatehealth.com";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (<section className="mb-10"><h2 className="text-xl font-bold text-gray-900 mb-3">{title}</h2><div className="text-gray-600 leading-relaxed space-y-3">{children}</div></section>);
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-teal-700 text-white px-4 sm:px-8 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/"><img src="/logo.PNG" alt="Elevate Health" style={{height: '70px', width: 'auto'}} /></Link>
          <Link href="/" className="text-sm text-teal-200 hover:text-white transition-colors">← Back to Home</Link>
        </div>
      </nav>
      <main className="max-w-3xl mx-auto px-4 sm:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-400 mb-10">Last updated: {LAST_UPDATED}</p>
        <p className="text-gray-600 leading-relaxed mb-8">Please read these Terms of Service (&ldquo;Terms&rdquo;) carefully before purchasing or accessing the Elevate Pain-Free Program. By completing a purchase or using our platform, you agree to be bound by these Terms.</p>
        <Section title="1. Acceptance of Terms"><p>These Terms constitute a legally binding agreement between you and Elevate Health. We reserve the right to update these Terms at any time.</p></Section>
        <Section title="2. Product Description"><p>The Elevate Pain-Free Program is a digital educational course consisting of 7 video modules covering at-home rehabilitation for neck, mid back, and lower back pain. Upon purchase, you receive lifetime access to all course content.</p></Section>
        <Section title="3. Payment and Refund Policy"><p><strong>Price:</strong> One-time payment of <strong>$97 USD</strong>. <strong>90-Day Money-Back Guarantee:</strong> Complete all 7 modules and log in for at least 30 days within days 90–120 of your membership for a full refund. Contact <a href={`mailto:${CONTACT_EMAIL}`} className="text-teal-600 hover:underline">{CONTACT_EMAIL}</a>.</p></Section>
        <Section title="4. Medical Disclaimer"><p><strong>The Elevate Pain-Free Program is for educational purposes only. It is not intended to diagnose, treat, cure, or prevent any disease or medical condition.</strong> Always consult a qualified healthcare provider before beginning any new exercise or rehabilitation program.</p></Section>
        <Section title="5. Intellectual Property"><p>All course content is the exclusive intellectual property of Elevate Health. Your purchase grants a personal, non-transferable licence for private, non-commercial use only.</p></Section>
        <Section title="6. Contact"><p><strong>Elevate Health</strong><br />Email: <a href={`mailto:${CONTACT_EMAIL}`} className="text-teal-600 hover:underline">{CONTACT_EMAIL}</a></p></Section>
      </main>
      <footer className="bg-teal-700 text-white py-8 px-4">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="font-bold">Elevate Health</span>
          <div className="flex gap-6 text-sm text-teal-200"><Link href="/" className="hover:text-white transition-colors">Home</Link><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></div>
        </div>
      </footer>
    </div>
  );
}