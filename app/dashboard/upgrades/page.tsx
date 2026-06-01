import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { supabaseAdmin } from "@/lib/supabase";
import type { Profile } from "@/types";
import UpgradeButton from "./UpgradeButton";

const NUTRITION = {
  upgrade: "nutrition" as const,
  icon: "🥗",
  badge: "Most Popular Upgrade",
  badgeColor: "bg-teal-100 text-teal-700",
  title: "Nutrition for Inflammation & Pain Relief",
  description:
    "Discover the exact foods that fight spinal inflammation and dramatically accelerate your pain relief results.",
  bullets: [
    "Top 15 anti-inflammatory foods for spine health",
    "7-day meal plan designed for pain recovery",
    "Supplement protocol with exact dosing",
    "Interactive grocery shopping checklist",
  ],
  price: 47,
  gradient: "from-teal-600 to-teal-800",
};

const CONSULTATION = {
  upgrade: "consultation" as const,
  icon: "🎯",
  badge: "High Value",
  badgeColor: "bg-orange-100 text-orange-700",
  title: "1-on-1 15-Minute Virtual Consultation",
  description:
    "Get a private video call with Dr. Oliveri to review your specific pain pattern and receive a personalized protocol.",
  bullets: [
    "Review your specific pain pattern & history",
    "Identify your primary muscle imbalances",
    "Get a personalized protocol recommendation",
    "Direct access to Dr. Oliveri",
  ],
  price: 197,
  gradient: "from-orange-500 to-orange-700",
};

export default async function UpgradesPage() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profileRows } = await supabaseAdmin
    .from("profiles")
    .select("has_nutrition_course, has_consultation")
    .eq("id", user.id)
    .limit(1);
  const profile = (profileRows as Pick<Profile, "has_nutrition_course" | "has_consultation">[] | null)?.[0] ?? null;

  const wantsNutrition = !profile?.has_nutrition_course;
  const wantsConsultation = !profile?.has_consultation;

  if (!wantsNutrition && !wantsConsultation) {
    redirect("/dashboard?message=You+already+have+all+available+upgrades!");
  }

  const cards = [
    ...(wantsNutrition ? [NUTRITION] : []),
    ...(wantsConsultation ? [CONSULTATION] : []),
  ];

  return (
    <div>
      <div className="mb-8">
        <span className="inline-flex items-center gap-1.5 bg-yellow-50 text-yellow-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
          ✦ Exclusive Upgrades
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Upgrade My Program</h1>
        <p className="text-gray-500 mt-2 text-sm">
          Add powerful extras to accelerate your results — available only to existing students.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {cards.map((card) => (
          <div key={card.upgrade} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            {/* Header */}
            <div className={`bg-gradient-to-r ${card.gradient} p-6 text-white relative`}>
              <span className={`absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full ${card.badgeColor}`}>
                {card.badge}
              </span>
              <div className="text-4xl mb-3">{card.icon}</div>
              <h2 className="text-xl font-bold">{card.title}</h2>
            </div>

            {/* Body */}
            <div className="p-6">
              <p className="text-gray-600 text-sm leading-relaxed mb-5">{card.description}</p>

              <ul className="space-y-2.5 mb-6">
                {card.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-sm text-gray-700">
                    <svg className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {b}
                  </li>
                ))}
              </ul>

              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl font-black text-gray-900">${card.price}</span>
                <span className="text-gray-400 text-sm">one-time · instant access</span>
              </div>

              <UpgradeButton upgrade={card.upgrade} price={card.price} />
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-gray-400 mt-6">
        Secured by Stripe · 90-day money-back guarantee on all purchases
      </p>
    </div>
  );
}
