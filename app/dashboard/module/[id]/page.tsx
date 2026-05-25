import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { supabaseAdmin } from "@/lib/supabase";
import MarkCompleteButton from "./MarkCompleteButton";

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
    videoId: "_d2OvP7Jsnc",
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
    videoId: "dwtHwryVgpk",
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
    videoId: "HciAoN6girc",
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
    videoId: "QiBj1BGQWJk",
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
    videoId: "1KUX7VR8rzY",
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
    videoId: "2K4Ej7aoUis",
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
    videoId: "H7Xzy9hOba4",
  },
};

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

  // Identify the current user
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch completion status only (no lock logic — layout already gates on purchased_at)
  const { data: progressRows } = await supabaseAdmin
    .from("module_progress")
    .select("completed_at")
    .eq("user_id", user.id)
    .eq("module_number", moduleNum)
    .limit(1);
  const completed = !!(progressRows?.[0]?.completed_at);

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
      <div
        style={{
          position: "relative",
          paddingBottom: "56.25%",
          height: 0,
          overflow: "hidden",
          width: "100%",
          backgroundColor: "white",
          isolation: "isolate",
          marginBottom: "32px",
        }}
      >
        <iframe
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
          src={`https://www.youtube.com/embed/${content.videoId}`}
          title={content.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
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

      <MarkCompleteButton moduleNumber={moduleNum} completed={completed} />
    </div>
  );
}
