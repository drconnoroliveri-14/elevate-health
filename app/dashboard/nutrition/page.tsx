import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { supabaseAdmin } from "@/lib/supabase";
import type { Profile } from "@/types";
import PrintButton from "./PrintButton";

const ANTI_INFLAMMATORY_FOODS = [
  { name: "Wild Salmon", description: "Rich in EPA and DHA omega-3 fatty acids that directly suppress spinal inflammatory cytokines.", how: "Aim for 3–4 servings per week. Bake, grill, or poach — avoid frying." },
  { name: "Turmeric", description: "Curcumin blocks NF-κB, the master inflammatory switch implicated in chronic back pain.", how: "Add 1 tsp to smoothies, soups, or golden milk. Combine with black pepper for 20× better absorption." },
  { name: "Blueberries", description: "Anthocyanins reduce oxidative stress in spinal tissues and help repair damaged nerve fibers.", how: "1 cup daily — fresh or frozen in smoothies, oatmeal, or yogurt." },
  { name: "Leafy Greens (Spinach, Kale)", description: "High magnesium content relaxes spasmed muscles and reduces nerve hyperexcitability.", how: "2 cups daily raw or 1 cup cooked. Add to omelettes, smoothies, or sauté as a side." },
  { name: "Walnuts", description: "ALA omega-3s reduce pro-inflammatory cytokine production and protect joint cartilage.", how: "A small handful (1 oz) daily as a snack or added to oatmeal and salads." },
  { name: "Extra Virgin Olive Oil", description: "Oleocanthal inhibits COX-1 and COX-2 enzymes — the same targets as ibuprofen — with no side effects.", how: "2–3 tbsp daily for cooking at low-medium heat or as salad dressing. Never overheat." },
  { name: "Ginger", description: "Gingerols and shogaols inhibit prostaglandin synthesis, reducing both inflammation and pain signaling.", how: "1 inch fresh ginger in tea or smoothies, or ½ tsp ground ginger in cooking daily." },
  { name: "Avocado", description: "Monounsaturated fats and vitamin E lower inflammatory markers and support disc hydration.", how: "½ avocado daily on toast, in salads, or as guacamole." },
  { name: "Broccoli", description: "Sulforaphane blocks the NF-κB inflammatory pathway and protects cartilage from breakdown.", how: "1 cup several times per week. Lightly steam to preserve sulforaphane — avoid overcooking." },
  { name: "Sweet Potato", description: "Beta-carotene and vitamin C act as antioxidants that neutralize inflammatory free radicals in spinal joints.", how: "3–4 times per week — baked, roasted, or as a mash. Leave the skin on for extra fiber." },
  { name: "Tart Cherry", description: "Among the highest natural sources of anti-inflammatory anthocyanins; reduces muscle soreness and stiffness.", how: "8 oz tart cherry juice or 1 tbsp concentrate daily, ideally before bed." },
  { name: "Sardines", description: "One of the highest EPA/DHA sources per serving — reduces nerve inflammation and disc degeneration.", how: "2–3 cans per week in salads, on crackers, or in pasta with olive oil and lemon." },
  { name: "Pineapple", description: "Bromelain enzyme breaks down inflammatory proteins in soft tissues and accelerates healing after exercise.", how: "1 cup fresh pineapple 2–3× per week. Bromelain is most potent when eaten between meals." },
  { name: "Bone Broth", description: "Collagen, glycine, and proline support disc health, reduce joint inflammation, and heal gut permeability linked to systemic inflammation.", how: "1–2 cups daily as a drink or as a base for soups and sauces." },
  { name: "Green Tea", description: "EGCG (epigallocatechin gallate) inhibits the COX-2 inflammatory enzyme and protects cartilage cells.", how: "2–3 cups daily. Brew at 160–180°F — boiling water destroys catechins." },
];

const FOODS_TO_AVOID = [
  { name: "Refined Sugar & High-Fructose Corn Syrup", reason: "Spikes insulin and AGEs (advanced glycation end-products) that directly accelerate disc degeneration." },
  { name: "Trans Fats & Hydrogenated Oils", reason: "Trigger systemic inflammation by disrupting cell membrane function throughout spinal tissues." },
  { name: "Refined Carbohydrates", reason: "White bread, white rice, and pastries cause rapid blood sugar spikes that activate inflammatory pathways." },
  { name: "Industrial Seed Oils", reason: "Soybean, corn, and sunflower oils are extremely high in omega-6 fatty acids that compete with anti-inflammatory omega-3s." },
  { name: "Processed Meats", reason: "Deli meats, hot dogs, and sausages contain nitrates and preservatives that increase inflammatory cytokines." },
  { name: "Excessive Alcohol", reason: "More than 1–2 drinks disrupts sleep quality, raises cortisol, and slows tissue repair — all worsening chronic pain." },
  { name: "Artificial Additives", reason: "Aspartame, MSG, and artificial colorings have been shown to trigger neurological inflammation in sensitive individuals." },
  { name: "Fast Food", reason: "Combines trans fats, refined carbs, excess sodium, and seed oils — a perfect storm for spinal inflammation." },
];

const MEAL_PLAN = [
  {
    day: "Day 1 — Monday",
    meals: {
      breakfast: "Golden turmeric smoothie: banana, frozen mango, 1 tsp turmeric, ½ tsp ginger, 1 tbsp almond butter, coconut milk",
      lunch: "Wild salmon salad bowl: mixed greens, cucumber, avocado, walnuts, olive oil + lemon dressing",
      dinner: "Baked salmon with roasted broccoli and sweet potato — drizzle everything with extra virgin olive oil",
      snack: "1 cup blueberries + a small handful of walnuts",
    },
  },
  {
    day: "Day 2 — Tuesday",
    meals: {
      breakfast: "Spinach and veggie omelette (2 eggs) cooked in olive oil, side of fresh pineapple",
      lunch: "Bone broth-based chicken and vegetable soup with kale and sweet potato",
      dinner: "Sardine pasta with garlic, cherry tomatoes, olive oil, lemon zest, and fresh parsley",
      snack: "Green tea + 1 oz walnuts",
    },
  },
  {
    day: "Day 3 — Wednesday",
    meals: {
      breakfast: "Overnight oats with blueberries, walnuts, chia seeds, and a pinch of cinnamon",
      lunch: "Avocado toast on whole grain bread with sardines and cherry tomatoes",
      dinner: "Ginger-turmeric chicken stir fry with broccoli, bok choy, and brown rice",
      snack: "Tart cherry juice (8 oz) with a small handful of almonds",
    },
  },
  {
    day: "Day 4 — Thursday",
    meals: {
      breakfast: "Sweet potato hash with spinach and 2 poached eggs, seasoned with turmeric",
      lunch: "Large kale salad with roasted sweet potato, avocado, pumpkin seeds, olive oil dressing",
      dinner: "Baked cod with roasted asparagus and bone broth-braised leeks",
      snack: "1 cup blueberries + green tea",
    },
  },
  {
    day: "Day 5 — Friday",
    meals: {
      breakfast: "Smoothie: frozen blueberries, spinach, banana, 1 tbsp chia seeds, almond milk, 1 tsp turmeric",
      lunch: "Salmon burger (no bun) with avocado, tomato, and mixed greens drizzled with olive oil",
      dinner: "Turmeric-ginger lentil soup with kale and a side of roasted broccoli",
      snack: "Fresh pineapple chunks + bone broth",
    },
  },
  {
    day: "Day 6 — Saturday",
    meals: {
      breakfast: "Avocado and smoked salmon toast on whole grain bread with capers and lemon",
      lunch: "Ginger-miso soup with tofu, bok choy, and brown rice noodles",
      dinner: "Grilled sardines with roasted sweet potato wedges and a large green salad",
      snack: "Walnuts + tart cherry juice",
    },
  },
  {
    day: "Day 7 — Sunday",
    meals: {
      breakfast: "Anti-inflammatory breakfast bowl: quinoa, blueberries, walnuts, drizzle of honey, sprinkle of turmeric",
      lunch: "Bone broth and vegetable slow-cooker stew with sweet potato and kale",
      dinner: "Baked salmon with mango-ginger salsa, roasted broccoli, and brown rice",
      snack: "Green tea + dark chocolate (85%+)",
    },
  },
];

const SUPPLEMENTS = [
  { name: "Omega-3 Fish Oil", dosage: "2–3g EPA+DHA daily", timing: "With meals to reduce fishy burps", reason: "The most evidence-backed anti-inflammatory supplement for spinal pain. Reduces inflammatory cytokines as effectively as NSAIDs in many studies." },
  { name: "Turmeric / Curcumin", dosage: "500–1,000mg curcumin with 5–20mg piperine (black pepper extract)", timing: "With a fatty meal for best absorption", reason: "Blocks NF-κB inflammatory pathway. Piperine increases bioavailability by up to 2,000%." },
  { name: "Magnesium Glycinate", dosage: "300–400mg elemental magnesium", timing: "30–60 minutes before bed", reason: "Relaxes smooth and skeletal muscle, reduces nerve excitability, and improves sleep quality — all critical for pain recovery." },
  { name: "Vitamin D3 + K2", dosage: "2,000–5,000 IU D3 with 100mcg MK-7 K2", timing: "With your largest meal of the day", reason: "Vitamin D deficiency is strongly linked to chronic musculoskeletal pain. K2 directs calcium to bones rather than soft tissues." },
  { name: "Collagen Peptides", dosage: "10–15g daily (look for Type I & II hydrolyzed collagen)", timing: "In the morning with vitamin C for better synthesis", reason: "Provides the building blocks for disc cartilage, ligaments, and tendons. Vitamin C is required for collagen cross-linking." },
];

const SHOPPING_LIST = {
  "Proteins": ["Wild salmon (fresh or frozen)", "Sardines in olive oil (canned)", "Pasture-raised eggs", "Organic chicken breast", "Cod or other white fish", "Firm tofu"],
  "Produce": ["Spinach", "Kale", "Broccoli", "Sweet potatoes", "Avocados", "Blueberries (fresh or frozen)", "Pineapple", "Ginger root", "Garlic", "Cherry tomatoes", "Lemons", "Mango (fresh or frozen)"],
  "Pantry": ["Extra virgin olive oil", "Turmeric powder", "Black pepper", "Bone broth (cartons)", "Walnuts", "Almonds", "Chia seeds", "Whole grain bread", "Brown rice", "Quinoa", "Tart cherry juice (100% pure)", "Dark chocolate 85%+"],
  "Supplements": ["Omega-3 fish oil capsules", "Curcumin with piperine", "Magnesium glycinate", "Vitamin D3 + K2", "Hydrolyzed collagen peptides"],
};

export default async function NutritionPage() {
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
    .select("has_nutrition_course")
    .eq("id", user.id)
    .limit(1);

  const profile = (profileRows as Pick<Profile, "has_nutrition_course">[] | null)?.[0] ?? null;

  if (!profile?.has_nutrition_course) {
    redirect("/dashboard?message=nutrition-upgrade-required");
  }

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { margin: 0; font-size: 11px; }
          @page { size: A4 portrait; margin: 1.5cm; }
        }
      `}</style>

      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <span className="inline-flex items-center gap-1.5 bg-teal-50 text-teal-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
              Bonus Course
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Nutrition for Inflammation &amp; Pain Relief
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              The exact dietary protocol used alongside chiropractic rehabilitation to accelerate your results.
            </p>
          </div>
          <PrintButton />
        </div>
      </div>

      {/* Introduction */}
      <div className="bg-teal-50 border border-teal-100 rounded-2xl p-6 mb-8">
        <h2 className="text-base font-bold text-teal-800 mb-3">Why Nutrition Matters for Pain Relief</h2>
        <p className="text-sm text-teal-900 leading-relaxed mb-3">
          Chronic neck and back pain is not just a structural problem — it is an inflammatory problem. Research shows that elevated systemic inflammation increases pain sensitivity, slows tissue healing, and accelerates disc degeneration.
        </p>
        <p className="text-sm text-teal-900 leading-relaxed">
          The foods you eat every day either fuel or fight that inflammation. This protocol is designed to complement your rehabilitation exercises by addressing the biochemical root of your pain — giving you faster, more complete relief.
        </p>
      </div>

      {/* Top 15 Anti-Inflammatory Foods */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-teal-500 text-white text-sm font-bold flex items-center justify-center">1</span>
          Top 15 Anti-Inflammatory Foods
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ANTI_INFLAMMATORY_FOODS.map((food, i) => (
            <div key={food.name} className="bg-white border border-gray-200 rounded-xl p-4 hover:border-teal-300 transition-colors">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-100 text-teal-700 text-xs font-bold flex items-center justify-center mt-0.5">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="font-semibold text-sm text-gray-900 mb-1">{food.name}</p>
                  <p className="text-xs text-gray-600 leading-relaxed mb-2">{food.description}</p>
                  <p className="text-xs text-teal-700 font-medium">
                    <span className="font-bold">How to use:</span> {food.how}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Foods That Worsen Inflammation */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-red-500 text-white text-sm font-bold flex items-center justify-center">2</span>
          Foods That Worsen Inflammation
        </h2>
        <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
          <p className="text-sm text-red-800 font-medium mb-4">Eliminate or significantly reduce these to accelerate your pain recovery:</p>
          <div className="space-y-3">
            {FOODS_TO_AVOID.map((food) => (
              <div key={food.name} className="flex items-start gap-3">
                <span className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full bg-red-200 flex items-center justify-center text-red-700 text-xs font-bold">✕</span>
                <div>
                  <p className="text-sm font-semibold text-red-900">{food.name}</p>
                  <p className="text-xs text-red-700 leading-relaxed">{food.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7-Day Meal Plan */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-teal-500 text-white text-sm font-bold flex items-center justify-center">3</span>
          7-Day Anti-Inflammatory Meal Plan
        </h2>
        <div className="space-y-3">
          {MEAL_PLAN.map((day) => (
            <details key={day.day} className="group bg-white border border-gray-200 rounded-xl overflow-hidden">
              <summary className="flex items-center justify-between gap-3 px-5 py-4 cursor-pointer select-none list-none hover:bg-gray-50 transition-colors">
                <span className="font-semibold text-sm text-gray-900">{day.day}</span>
                <svg className="w-4 h-4 text-gray-400 flex-shrink-0 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-5 pb-5 pt-1 border-t border-gray-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  {(["breakfast", "lunch", "dinner", "snack"] as const).map((meal) => (
                    <div key={meal} className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs font-bold text-teal-700 uppercase tracking-wide mb-1">{meal}</p>
                      <p className="text-xs text-gray-700 leading-relaxed">{day.meals[meal]}</p>
                    </div>
                  ))}
                </div>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Supplement Protocol */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-teal-500 text-white text-sm font-bold flex items-center justify-center">4</span>
          Supplement Protocol
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {SUPPLEMENTS.map((supp, i) => (
            <div key={supp.name} className="bg-white border border-gray-200 rounded-xl p-5 flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-500 text-white text-sm font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <div className="flex-1">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-1">
                  <p className="font-bold text-sm text-gray-900">{supp.name}</p>
                  <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">{supp.dosage}</span>
                </div>
                <p className="text-xs text-gray-500 mb-2"><span className="font-semibold">When:</span> {supp.timing}</p>
                <p className="text-xs text-gray-600 leading-relaxed">{supp.reason}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3">* Consult your healthcare provider before starting any supplement protocol.</p>
      </section>

      {/* Shopping List */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-teal-500 text-white text-sm font-bold flex items-center justify-center">5</span>
          Anti-Inflammatory Shopping List
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(SHOPPING_LIST).map(([category, items]) => (
            <div key={category} className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="font-bold text-sm text-teal-700 mb-3 uppercase tracking-wide">{category}</p>
              <ul className="space-y-1.5">
                {items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-gray-700">
                    <span className="flex-shrink-0 w-4 h-4 border border-teal-400 rounded" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Footer note */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center no-print">
        <p className="text-xs text-gray-500">
          For educational purposes only. Consult a healthcare provider before making significant dietary or supplemental changes.
        </p>
      </div>
    </>
  );
}
