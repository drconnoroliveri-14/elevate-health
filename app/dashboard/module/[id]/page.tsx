import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { supabaseAdmin } from "@/lib/supabase";
import MarkCompleteButton from "./MarkCompleteButton";

// ── Static module content ─────────────────────────────────────────────────────

type ModuleContent = {
  title: string;
  duration: string;
  description: string;
  takeaways: string[];
  videoId: string;
};

const MODULE_CONTENT: Record<number, ModuleContent> = {
  1: {
    title: "Understanding Your Pain",
    duration: "~40 min",
    description:
      "The root causes of neck, mid back, and lower back pain. How posture, muscle imbalances, and movement patterns create chronic pain.",
    takeaways: [
      "The 3 root causes of chronic back and neck pain",
      "How to assess your own posture",
      "Your baseline pain score",
    ],
    videoId: "dQw4w9WgXcQ",
  },
  2: {
    title: "Neck Pain Relief Protocol",
    duration: "~50 min",
    description:
      "Step-by-step exercises to release neck tension, restore cervical mobility, and eliminate headaches caused by neck dysfunction.",
    takeaways: [
      "Top 5 neck release exercises",
      "Posture correction for desk workers",
      "Cervical mobility daily routine",
    ],
    videoId: "9bZkp7q19f0",
  },
  3: {
    title: "Mid Back Pain Relief Protocol",
    duration: "~40 min",
    description:
      "Thoracic mobility exercises, postural correction, and strengthening routines to eliminate mid back pain and improve breathing.",
    takeaways: [
      "Thoracic spine mobilization sequence",
      "Scapular stability exercises",
      "Desk posture reset routine",
    ],
    videoId: "tgbNymZ7vqY",
  },
  4: {
    title: "Lower Back Pain Relief Protocol",
    duration: "~35 min",
    description:
      "Core activation, hip flexor release, and lumbar stabilization exercises proven to eliminate lower back pain.",
    takeaways: [
      "The McGill Big 3 exercises",
      "Hip flexor release sequence",
      "Lumbar stabilization routine",
    ],
    videoId: "ZZ5LpwO-An4",
  },
  5: {
    title: "Posture Correction & Alignment",
    duration: "~55 min",
    description:
      "Full body postural assessment and correction. How to sit, stand, sleep, and move without creating pain.",
    takeaways: [
      "Ideal sitting and standing posture guide",
      "Sleep position guide for pain relief",
      "Movement pattern corrections",
    ],
    videoId: "Ke90Tje7VS0",
  },
  6: {
    title: "Strengthening for a Pain-Free Life",
    duration: "~40 min",
    description:
      "Progressive strengthening program to bulletproof your spine and prevent pain from returning.",
    takeaways: [
      "Spine-safe strength exercises",
      "Progressive overload for beginners",
      "3-day weekly strength routine",
    ],
    videoId: "HQmmM_qwG4k",
  },
  7: {
    title: "Your Personal 90-Day Pain-Free Protocol",
    duration: "~30 min",
    description:
      "Build your customized daily rehabilitation routine with week-by-week implementation, pain tracking, and long-term maintenance.",
    takeaways: [
      "Your personal daily routine template",
      "Pain tracking system",
      "How to progress safely long-term",
    ],
    videoId: "uelHwf8o7_U",
  },
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function ModulePage({
  params,
}: {
  params: { id: string };
}) {
  const moduleNum = parseInt(params.id, 10);

  if (!Number.isInteger(moduleNum) || moduleNum < 1 || moduleNum > 7) {
    redirect("/dashboard/module/1");
  }

  const content = MODULE_CONTENT[moduleNum];

  // ── Auth: identify current user via server-side cookie ──────────────────────
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // ── Direct DB query via admin client — bypasses RLS entirely ────────────────
  const { data: rows, error } = await supabaseAdmin
    .from("module_progress")
    .select("*")
    .eq("user_id", user.id)
    .eq("module_number", moduleNum)
    .limit(1);

  if (error) {
    console.error("[module/page] supabaseAdmin error:", error);
  }

  const progress = rows?.[0] ?? null;

  // Stamp first_accessed_at if this is the first visit
  if (progress && !progress.first_accessed_at) {
    await supabaseAdmin
      .from("module_progress")
      .update({ first_accessed_at: new Date().toISOString() })
      .eq("user_id", user.id)
      .eq("module_number", moduleNum);

    // Schedule the next module if not already scheduled
    if (moduleNum < 7) {
      const { data: nextRows } = await supabaseAdmin
        .from("module_progress")
        .select("id")
        .eq("user_id", user.id)
        .eq("module_number", moduleNum + 1)
        .limit(1);

      if (!nextRows?.length) {
        await supabaseAdmin.from("module_progress").insert({
          user_id: user.id,
          module_number: moduleNum + 1,
          unlocked_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        });
      }
    }
  }

  // ── Lock check: no row OR unlocked_at is a future date ──────────────────────
  const isLocked = (() => {
    if (!progress) return true;
    if (!progress.unlocked_at) return false; // null = immediately available
    const unlockDate = new Date(progress.unlocked_at);
    if (isNaN(unlockDate.getTime())) return false; // unparseable = treat as available
    return unlockDate > new Date();
  })();

  // ── Locked view ──────────────────────────────────────────────────────────────
  if (isLocked) {
    const unlockDate = progress?.unlocked_at ? new Date(progress.unlocked_at) : null;
    const unlockLabel = unlockDate && !isNaN(unlockDate.getTime())
      ? unlockDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
      : null;

    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Module {moduleNum} is Locked</h2>
        {unlockLabel ? (
          <p className="text-gray-500">Unlocks on <strong>{unlockLabel}</strong></p>
        ) : (
          <p className="text-gray-500">Complete the previous module to unlock this one.</p>
        )}
      </div>
    );
  }

  // ── Module content view ──────────────────────────────────────────────────────
  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <span className="inline-flex items-center gap-1.5 bg-teal-50 text-teal-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
          Module {moduleNum} of 7 · {content.duration}
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{content.title}</h1>
      </div>

      {/* Video */}
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg mb-8">
        <iframe
          src={`https://www.youtube.com/embed/${content.videoId}`}
          title={content.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>

      {/* Description */}
      <div className="prose prose-gray max-w-none mb-8">
        <p className="text-gray-700 text-base leading-relaxed">{content.description}</p>
      </div>

      {/* Key takeaways */}
      <div className="bg-teal-50 border border-teal-100 rounded-2xl p-6 mb-8">
        <h2 className="text-base font-bold text-teal-800 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Key Takeaways
        </h2>
        <ul className="space-y-3">
          {content.takeaways.map((t) => (
            <li key={t} className="flex items-start gap-3 text-sm text-teal-900">
              <svg className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              {t}
            </li>
          ))}
        </ul>
      </div>

      {/* Mark complete (client component) */}
      <MarkCompleteButton moduleNumber={moduleNum} completed={!!progress?.completed_at} />
    </div>
  );
}
