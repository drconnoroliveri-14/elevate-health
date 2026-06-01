import Link from "next/link";

const LAST_UPDATED = "May 2025";
const CONTACT_EMAIL = "privacy@elevatehealth.com";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (<section className="mb-10"><h2 className="text-xl font-bold text-gray-900 mb-3">{title}</h2><div className="text-gray-600 leading-relaxed space-y-3">{children}</div></section>);
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-teal-700 text-white px-4 sm:px-8 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/"><img src="/logo.PNG" alt="Elevate Health" style={{height: '70px', width: 'auto'}} /></Link>
          <Link href="/" className="text-sm text-teal-200 hover:text-white transition-colors">← Back to Home</Link>
        </div>
      </nav>
      <main className="max-w-3xl mx-auto px-4 sm:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-400 mb-10">Last updated: {LAST_UPDATED}</p>
        <p className="text-gray-600 leading-relaxed mb-8">Elevate Health (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard data when you use our website and the Elevate Pain-Free Program.</p>
        <Section title="1. Information We Collect"><p>We collect the following categories of personal information:</p><ul className="list-disc list-inside space-y-1 ml-2"><li><strong>Account information:</strong> your name and email address when you register or purchase.</li><li><strong>Payment information:</strong> billing details processed securely by Stripe. We never store full card numbers.</li><li><strong>Course activity:</strong> modules accessed, completion status, and progress timestamps.</li><li><strong>Lead data:</strong> name and email if you opt in to our free back pain relief guide before purchasing.</li><li><strong>Usage data:</strong> browser type, IP address, and page views collected automatically.</li></ul></Section>
        <Section title="2. How We Use Your Information"><p>We use your information to create and manage your student account, deliver course content, process payments, send transactional emails, and improve our platform. We do not sell, rent, or trade your personal information to third parties.</p></Section>
        <Section title="3. Data Storage and Security"><p>Your data is stored on servers provided by Supabase located in the United States. We implement TLS/SSL encryption, row-level security, and bcrypt-hashed passwords.</p></Section>
        <Section title="4. Third-Party Services"><p>We work with Stripe (payments), Supabase (database/auth), Resend (email), and Vercel (hosting). Each provider is contractually obligated to protect your data.</p></Section>
        <Section title="5. Cookies"><p>We use essential cookies to maintain your authenticated session. We do not use tracking or advertising cookies.</p></Section>
        <Section title="6. Your Rights"><p>You may request access, correction, deletion, portability of your data, or opt-out from marketing emails. Contact us at <a href={`mailto:${CONTACT_EMAIL}`} className="text-teal-600 hover:underline">{CONTACT_EMAIL}</a>. We will respond within 30 days.</p></Section>
        <Section title="7. Data Retention"><p>We retain your account data for as long as your account is active. If you request deletion, we will remove your data within 30 days, except where required by law.</p></Section>
        <Section title="8. Contact Us"><p><strong>Elevate Health</strong><br />Email: <a href={`mailto:${CONTACT_EMAIL}`} className="text-teal-600 hover:underline">{CONTACT_EMAIL}</a></p></Section>
      </main>
      <footer className="bg-teal-700 text-white py-8 px-4">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="font-bold">Elevate Health</span>
          <div className="flex gap-6 text-sm text-teal-200"><Link href="/" className="hover:text-white transition-colors">Home</Link><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></div>
        </div>
      </footer>
    </div>
  );
}