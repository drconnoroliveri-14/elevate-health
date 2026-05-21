import Link from "next/link";

const LAST_UPDATED = "May 2025";
const CONTACT_EMAIL = "support@elevatehealth.com";

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

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="bg-teal-700 text-white px-4 sm:px-8 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/">
            <img src="/logo.PNG" alt="Elevate Health" style={{height: '70px', width: 'auto'}} />
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
          Terms of Service
        </h1>
        <p className="text-sm text-gray-400 mb-10">
          Last updated: {LAST_UPDATED}
        </p>

        <p className="text-gray-600 leading-relaxed mb-8">
          Please read these Terms of Service (&ldquo;Terms&rdquo;) carefully before
          purchasing or accessing the Elevate Pain-Free Program. By completing a
          purchase or using our platform, you agree to be bound by these Terms.
          If you do not agree, do not purchase or access the course.
        </p>

        <Section title="1. Acceptance of Terms">
          <p>
            These Terms constitute a legally binding agreement between you and
            Elevate Health (&ldquo;Company,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;). They govern your
            access to and use of the Elevate Pain-Free Program and all related
            content, materials, and services.
          </p>
          <p>
            We reserve the right to update these Terms at any time. Continued
            use of the platform after changes constitutes acceptance. We will
            notify you of material changes by email.
          </p>
        </Section>

        <Section title="2. Product Description">
          <p>
            The Elevate Pain-Free Program is a digital educational course
            consisting of 7 video modules covering at-home rehabilitation for
            neck, mid back, and lower back pain — including posture correction,
            targeted exercises, and a 90-day personal protocol. The course is
            delivered through a drip-based online portal — one module unlocks
            every 7 days after the previous module is first accessed.
          </p>
          <p>
            Upon purchase, you receive lifetime access to all course content,
            including any future updates we add to the program, plus two bonus
            resources: the Pain Tracking Journal and the Posture Correction
            Quick Reference Guide.
          </p>
        </Section>

        <Section title="3. Payment and Refund Policy">
          <p>
            <strong>Price:</strong> The Elevate Pain-Free Program is available
            for a one-time payment of <strong>$97 USD</strong>. There are no
            recurring charges or hidden fees.
          </p>
          <p>
            <strong>Payment processing:</strong> Payments are processed
            securely by Stripe. We accept all major credit and debit cards.
          </p>
          <p>
            <strong>90-Day Money-Back Guarantee:</strong> We stand behind the
            quality of this program. If you are not satisfied with your
            purchase for any reason, contact us within 90 days of your purchase
            date for a full refund — no questions asked. To request a refund,
            email{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-teal-600 hover:underline"
            >
              {CONTACT_EMAIL}
            </a>{" "}
            with your order details.
          </p>
          <p>
            Refunds are processed within 5–10 business days to your original
            payment method. After a refund is issued, your access to the course
            portal will be revoked.
          </p>
        </Section>

        <Section title="4. Medical Disclaimer">
          <p>
            <strong>
              The Elevate Pain-Free Program is for educational purposes only.
              It is not intended to diagnose, treat, cure, or prevent any
              disease or medical condition.
            </strong>
          </p>
          <p>
            The content in this course does not constitute medical advice,
            professional healthcare advice, or a doctor-patient relationship.
            Always consult a qualified healthcare provider before beginning any
            new exercise or rehabilitation program — especially if you have
            existing medical conditions, injuries, or have recently had surgery.
          </p>
          <p>
            Results described by testimonials or case studies are individual
            experiences and may not be representative of what you will
            experience. Individual outcomes vary based on genetics, lifestyle,
            adherence, and many other factors.
          </p>
        </Section>

        <Section title="5. Intellectual Property">
          <p>
            All course content — including but not limited to video recordings,
            written materials, spreadsheets, graphics, and the platform itself
            — is the exclusive intellectual property of Elevate Health and is
            protected by copyright law.
          </p>
          <p>
            Your purchase grants you a personal, non-transferable licence to
            access and use the course content for your own private,
            non-commercial use. You may not:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Share, copy, or redistribute course content.</li>
            <li>Resell, sublicense, or commercially exploit any materials.</li>
            <li>
              Record, screenshot, or reproduce video or written content without
              written permission.
            </li>
          </ul>
          <p>
            Violations of this section may result in immediate termination of
            your access without refund and may result in legal action.
          </p>
        </Section>

        <Section title="6. Account Security">
          <p>
            You are responsible for maintaining the confidentiality of your
            login credentials. Do not share your account with others. Each
            purchase grants access to a single user only.
          </p>
          <p>
            Notify us immediately at{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-teal-600 hover:underline"
            >
              {CONTACT_EMAIL}
            </a>{" "}
            if you believe your account has been compromised.
          </p>
        </Section>

        <Section title="7. Limitation of Liability">
          <p>
            To the maximum extent permitted by applicable law, Elevate Health
            and its owners, employees, and agents shall not be liable for any
            indirect, incidental, consequential, special, or punitive damages
            arising from your use of or inability to use the course or platform.
          </p>
          <p>
            Our total liability to you for any claim arising out of or relating
            to these Terms or your use of the service shall not exceed the
            amount you paid for the course ($97).
          </p>
        </Section>

        <Section title="8. Governing Law">
          <p>
            These Terms are governed by and construed in accordance with the
            laws of the United States, without regard to conflict-of-law
            principles. Any disputes shall be resolved by binding arbitration
            rather than in court, except where prohibited by law.
          </p>
        </Section>

        <Section title="9. Contact">
          <p>
            If you have questions about these Terms, please contact us:
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
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
