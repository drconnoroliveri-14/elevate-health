import Link from "next/link";
import Image from "next/image";

const LAST_UPDATED = "May 2025";
const CONTACT_EMAIL = "info@elevatehealthtampa.com";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold text-gray-900 mb-3">{title}</h2>
      <div className="text-gray-600 leading-relaxed space-y-3">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="bg-teal-700 text-white px-4 sm:px-8 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/">
            <Image src="/logo.PNG" alt="Elevate Health" width={140} height={70} unoptimized style={{height: '70px', width: 'auto'}} />
          </Link>
          <Link
            href="/"
            className="text-sm text-teal-200 hover:text-white transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Privacy Policy
        </h1>
        <p className="text-sm text-gray-400 mb-10">
          Last updated: {LAST_UPDATED}
        </p>

        <p className="text-gray-600 leading-relaxed mb-8">
          Elevate Health (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) is committed to protecting your
          personal information. This Privacy Policy explains how we collect, use,
          and safeguard data when you use our website and the Elevate Pain-Free
          Program.
        </p>

        <Section title="1. Information We Collect">
          <p>We collect the following categories of personal information:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>
              <strong>Account information:</strong> your name and email address
              when you register or purchase.
            </li>
            <li>
              <strong>Payment information:</strong> billing details processed
              securely by Stripe. We never store full card numbers.
            </li>
            <li>
              <strong>Course activity:</strong> modules accessed, completion
              status, and progress timestamps to deliver your drip schedule.
            </li>
            <li>
              <strong>Lead data:</strong> name and email if you opt in to our
              free back pain relief guide before purchasing.
            </li>
            <li>
              <strong>Usage data:</strong> browser type, IP address, and page
              views collected automatically for security and analytics.
            </li>
          </ul>
        </Section>

        <Section title="2. How We Use Your Information">
          <p>We use your information to:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Create and manage your student account.</li>
            <li>Deliver course content and unlock modules on schedule.</li>
            <li>Process payments and issue receipts.</li>
            <li>
              Send transactional emails (login credentials, module updates) and,
              with your consent, educational and promotional emails.
            </li>
            <li>
              Provide customer support and respond to your inquiries.
            </li>
            <li>
              Improve our platform through aggregated, anonymised analytics.
            </li>
          </ul>
          <p>
            We do not sell, rent, or trade your personal information to third
            parties.
          </p>
        </Section>

        <Section title="3. Data Storage and Security">
          <p>
            Your data is stored on servers provided by Supabase (PostgreSQL
            database) located in the United States. We implement
            industry-standard security measures including:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>TLS/SSL encryption for all data in transit.</li>
            <li>Row-level security on all database tables.</li>
            <li>Bcrypt-hashed passwords — we never store plaintext passwords.</li>
            <li>
              Regular security reviews and dependency updates.
            </li>
          </ul>
          <p>
            Despite these measures, no method of transmission over the internet
            is 100% secure. We encourage you to use a strong, unique password.
          </p>
        </Section>

        <Section title="4. Third-Party Services">
          <p>
            We work with the following trusted third parties who may process
            your data as part of delivering our service:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>
              <strong>Stripe</strong> (stripe.com) — payment processing. Stripe
              is PCI-DSS Level 1 certified. Their privacy policy is available at
              stripe.com/privacy.
            </li>
            <li>
              <strong>Supabase</strong> (supabase.com) — database and
              authentication infrastructure. Privacy policy at
              supabase.com/privacy.
            </li>
            <li>
              <strong>Resend</strong> (resend.com) — transactional email
              delivery. Privacy policy at resend.com/legal/privacy-policy.
            </li>
            <li>
              <strong>Vercel</strong> (vercel.com) — hosting and edge network.
              Privacy policy at vercel.com/legal/privacy-policy.
            </li>
          </ul>
          <p>
            Each of these providers is contractually obligated to protect your
            data and use it only to provide their respective services.
          </p>
        </Section>

        <Section title="5. Cookies">
          <p>
            We use essential cookies to maintain your authenticated session.
            These cookies are strictly necessary for the platform to function
            and cannot be disabled. We do not use tracking or advertising
            cookies.
          </p>
        </Section>

        <Section title="6. Your Rights">
          <p>
            Depending on your location, you may have the following rights
            regarding your personal data:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>
              <strong>Access:</strong> request a copy of the data we hold about
              you.
            </li>
            <li>
              <strong>Correction:</strong> ask us to correct inaccurate data.
            </li>
            <li>
              <strong>Deletion:</strong> request deletion of your account and
              personal data, subject to legal retention requirements.
            </li>
            <li>
              <strong>Portability:</strong> receive your data in a
              machine-readable format.
            </li>
            <li>
              <strong>Opt-out:</strong> unsubscribe from marketing emails at any
              time via the unsubscribe link in any email we send.
            </li>
          </ul>
          <p>
            To exercise any of these rights, contact us at{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-teal-600 hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
            . We will respond within 30 days.
          </p>
        </Section>

        <Section title="7. Data Retention">
          <p>
            We retain your account data for as long as your account is active or
            as needed to provide services. If you request deletion, we will
            remove your data within 30 days, except where retention is required
            by law (e.g., financial records are retained for 7 years).
          </p>
        </Section>

        <Section title="8. Children's Privacy">
          <p>
            Our services are intended for adults aged 18 and over. We do not
            knowingly collect personal data from children under 13. If you
            believe a child has provided us with personal information, please
            contact us immediately.
          </p>
        </Section>

        <Section title="9. Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time. When we do,
            we will revise the &ldquo;Last updated&rdquo; date at the top of this page and,
            for material changes, notify you by email. Your continued use of our
            services after changes constitutes acceptance of the updated policy.
          </p>
        </Section>

        <Section title="10. Contact Us">
          <p>
            If you have questions about this Privacy Policy or how we handle
            your data, please contact us:
          </p>
          <p>
            <strong>Elevate Health</strong>
            <br />
            Email:{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-teal-600 hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
          </p>
        </Section>
      </main>

      <footer className="bg-teal-700 text-white py-8 px-4">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="font-bold">Elevate Health</span>
          <div className="flex gap-6 text-sm text-teal-200">
            <Link href="/" className="hover:text-white transition-colors">
              Home
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
