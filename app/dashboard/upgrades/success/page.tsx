import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { supabaseAdmin } from "@/lib/supabase";
import { stripe } from "@/lib/stripe";
import { resend } from "@/lib/resend";
import Link from "next/link";

export const dynamic = "force-dynamic";

const FROM = "Dr. Connor Oliveri <droliveri@elevatehealthtampa.com>";
const REPLY_TO = "droliveri@elevatehealthtampa.com";

export default async function UpgradeSuccessPage({
  searchParams,
}: {
  searchParams: { upgrade?: string; session_id?: string };
}) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const upgradeType = searchParams.upgrade;
  const sessionId = searchParams.session_id;

  if ((upgradeType !== "nutrition" && upgradeType !== "consultation") || !sessionId) {
    redirect("/dashboard/upgrades");
  }

  // ── Verify Stripe payment ─────────────────────────────────────────────────
  let paymentVerified = false;
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    paymentVerified = session.payment_status === "paid";
  } catch (err) {
    console.error("[upgrades/success] Stripe session retrieve failed:", err);
  }

  if (!paymentVerified) {
    redirect("/dashboard/upgrades");
  }

  // ── Fetch profile ─────────────────────────────────────────────────────────
  const { data: profileRows } = await supabaseAdmin
    .from("profiles")
    .select("email, full_name, has_nutrition_course, has_consultation")
    .eq("id", user.id)
    .limit(1);
  const profile = profileRows?.[0];
  const email = profile?.email ?? user.email ?? "";
  const firstName = profile?.full_name?.split(" ")[0] || "there";

  // ── Update profile (idempotent) ───────────────────────────────────────────
  const alreadyGranted =
    upgradeType === "nutrition"
      ? !!profile?.has_nutrition_course
      : !!profile?.has_consultation;

  if (!alreadyGranted) {
    const field =
      upgradeType === "nutrition" ? "has_nutrition_course" : "has_consultation";
    await supabaseAdmin
      .from("profiles")
      .update({ [field]: true })
      .eq("id", user.id);

    // ── Send upgrade email ──────────────────────────────────────────────────
    if (upgradeType === "nutrition") {
      const html = `
        <p>Hi ${firstName},</p>
        <p>Great news — your <strong>Nutrition for Inflammation &amp; Pain Relief Mini Course</strong> is now unlocked and ready inside your student portal!</p>
        <p>Head to your dashboard and click <strong>Nutrition Course</strong> in the sidebar to get started.</p>
        <p>The right nutrition can dramatically accelerate your pain relief results. Enjoy the course!</p>
        <p style="margin-top:32px">Dr. Connor Oliveri<br/>Elevate Health</p>
      `.trim();
      await resend.emails.send({
        from: FROM, replyTo: REPLY_TO, to: email,
        subject: "Your Nutrition Course is Now Unlocked! 🥗",
        html,
      }).catch((e) => console.error("[upgrades/success] nutrition email:", e));

      await supabaseAdmin.from("email_log").insert({
        recipient_email: email, email_type: "upgrade_nutrition_unlocked", status: "sent",
      });
    } else {
      const html = `
        <p>Hi ${firstName},</p>
        <p>Congratulations — your <strong>1-on-1 15-Minute Virtual Consultation</strong> with Dr. Oliveri is confirmed!</p>
        <p>Use the link below to choose your preferred time slot:</p>
        <p><a href="https://calendly.com/drconnoroliveri/15min-pain-free-consultation">Book Your Consultation →</a></p>
        <p>You will receive a Zoom link automatically after booking.</p>
        <p style="margin-top:32px">Dr. Connor Oliveri<br/>Elevate Health</p>
      `.trim();
      await resend.emails.send({
        from: FROM, replyTo: REPLY_TO, to: email,
        subject: "Your Consultation is Confirmed — Here is How to Book",
        html,
      }).catch((e) => console.error("[upgrades/success] consultation email:", e));

      await supabaseAdmin.from("email_log").insert({
        recipient_email: email, email_type: "upgrade_consultation_unlocked", status: "sent",
      });
    }
  }

  // ── UI config ─────────────────────────────────────────────────────────────
  const isNutrition = upgradeType === "nutrition";
  const title = isNutrition
    ? "Nutrition Course Unlocked! 🥗"
    : "Consultation Confirmed! 🎯";
  const detail = isNutrition
    ? "The Nutrition for Inflammation & Pain Relief Mini Course is now in your dashboard."
    : "Your 1-on-1 Virtual Consultation with Dr. Oliveri is confirmed. Check your email for the Calendly booking link.";
  const href = isNutrition ? "/dashboard/nutrition" : "/dashboard/consultation";
  const cta = isNutrition ? "Go to Nutrition Course →" : "Go to My Consultation →";

  const bullets = isNutrition
    ? ["Top 15 anti-inflammatory foods", "7-day meal plan", "Supplement protocol", "Interactive shopping checklist"]
    : ["Book via Calendly link in your email", "15-minute private video call", "Personalized protocol from Dr. Oliveri"];

  return (
    <div className="max-w-lg mx-auto pt-4">
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        {/* Green success header */}
        <div className="bg-green-500 p-8 text-center text-white">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold">{title}</h1>
        </div>

        <div className="p-6">
          <p className="text-gray-600 text-sm leading-relaxed mb-5">{detail}</p>

          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">What you just unlocked</p>
            <ul className="space-y-2">
              {bullets.map((b) => (
                <li key={b} className="flex items-center gap-3 text-sm text-gray-700">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <Link
            href={href}
            className="block w-full text-center bg-teal-500 hover:bg-teal-700 text-white font-bold py-4 rounded-xl transition-colors"
          >
            {cta}
          </Link>

          <Link href="/dashboard" className="block text-center text-sm text-gray-400 hover:text-gray-600 mt-4">
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
