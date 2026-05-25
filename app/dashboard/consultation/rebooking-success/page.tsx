import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { supabaseAdmin } from "@/lib/supabase";
import { stripe } from "@/lib/stripe";
import { resend } from "@/lib/resend";

const FROM = "Dr. Connor Oliveri <droliveri@elevatehealthtampa.com>";
const REPLY_TO = "droliveri@elevatehealthtampa.com";

export default async function RebookingSuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const sessionId = searchParams.session_id;
  if (!sessionId) redirect("/dashboard/consultation");

  // Auth check
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Verify Stripe session is paid
  let paid = false;
  let customerEmail: string | null = null;
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    paid = session.payment_status === "paid";
    customerEmail = session.customer_details?.email ?? null;
  } catch {
    redirect("/dashboard/consultation");
  }

  if (!paid) redirect("/dashboard/consultation");

  // Fetch profile for first name and email
  const { data: profileRows } = await supabaseAdmin
    .from("profiles")
    .select("full_name, email, consultation_booked")
    .eq("id", user.id)
    .limit(1);
  const profile = profileRows?.[0] ?? null;
  const firstName = profile?.full_name?.split(" ")[0] || "there";
  const recipientEmail = profile?.email ?? customerEmail ?? user.email ?? null;

  // Reset consultation_booked so they can book a new slot (idempotent — webhook may have already done this)
  await supabaseAdmin
    .from("profiles")
    .update({ consultation_booked: false })
    .eq("id", user.id);

  // Send confirmation email (best-effort)
  if (recipientEmail) {
    const html = `
      <p>Hi ${firstName},</p>
      <p>Your additional 15-minute Pain Relief Consultation with Dr. Oliveri has been confirmed. Please use the link below to choose your preferred time.</p>
      <p><strong>Booking Link:</strong><br>
      <a href="https://calendly.com/drconnoroliveri/15min-pain-free-consultation">https://calendly.com/drconnoroliveri/15min-pain-free-consultation</a></p>
      <p>You will receive a Zoom link automatically after booking.</p>
      <p>If you have any questions simply reply to this email.</p>
      <p>— Dr. Connor Oliveri &amp; The Elevate Health Team</p>
    `.trim();
    const text = `Hi ${firstName},

Your additional 15-minute Pain Relief Consultation with Dr. Oliveri has been confirmed. Please use the link below to choose your preferred time.

Booking Link: https://calendly.com/drconnoroliveri/15min-pain-free-consultation

You will receive a Zoom link automatically after booking.

If you have any questions simply reply to this email.

— Dr. Connor Oliveri & The Elevate Health Team`;

    try {
      await resend.emails.send({
        from: FROM,
        replyTo: REPLY_TO,
        to: recipientEmail,
        subject: "Your Additional Consultation is Confirmed — Book Your Session",
        html,
        text,
      });
    } catch (err) {
      console.error("[rebooking-success] Email send failed:", err);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <span className="inline-flex items-center gap-1.5 bg-teal-50 text-teal-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
          Premium Add-On
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Consultation</h1>
      </div>

      {/* Success banner */}
      <div className="bg-teal-500 rounded-2xl p-8 mb-8 text-white text-center">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2">Payment Confirmed, {firstName}!</h2>
        <p className="text-teal-100 text-sm max-w-sm mx-auto">
          Your additional consultation has been purchased. Use the button below to book your session with Dr. Oliveri.
        </p>
      </div>

      {/* Doctor card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
          <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        </div>
        <div>
          <p className="font-bold text-gray-900 text-lg">Dr. Connor Oliveri, DC</p>
          <p className="text-gray-500 text-sm">Doctor of Chiropractic · Spinal Rehabilitation Specialist</p>
          <p className="text-teal-600 text-sm font-medium mt-1">15-Minute Private Pain Relief Consultation</p>
        </div>
      </div>

      {/* Calendly CTA */}
      <div className="text-center mb-8">
        <a
          href="https://calendly.com/drconnoroliveri/15min-pain-free-consultation"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-teal-500 hover:bg-teal-700 text-white font-bold text-lg px-10 py-5 rounded-2xl transition-colors shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5m-9-6h.008v.008H12V12zm0 3h.008v.008H12V15zm0 3h.008v.008H12V18zm3-6h.008v.008H15V12zm0 3h.008v.008H15V15zm0 3h.008v.008H15V18zm-6 0h.008v.008H9V18zm0-3h.008v.008H9V15z" />
          </svg>
          Book Your Session Now →
        </a>
        <p className="text-xs text-gray-400 mt-3">A confirmation email with this link has been sent to you.</p>
      </div>

      {/* Help note */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
        <p className="text-sm text-gray-500">
          Questions about your booking? Contact us at{" "}
          <a href="mailto:droliveri@elevatehealthtampa.com" className="text-teal-600 font-medium hover:underline">droliveri@elevatehealthtampa.com</a>
        </p>
      </div>
    </div>
  );
}
