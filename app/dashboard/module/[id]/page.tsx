"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { ModuleProgress } from "@/types";

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
    duration: "~45 min",
    description:
      "The root causes of neck, mid back, and lower back pain. How posture, muscle imbalances, and movement patterns create chronic pain.",
    takeaways: [
      "The 3 root causes of chronic back and neck pain",
      "How to do your baseline pain assessment",
      "Why most treatments fail — and what works instead",
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

// ── Countdown hook ────────────────────────────────────────────────────────────

function useCountdown(isoDate: string | null): string {
  const [display, setDisplay] = useState("");

  useEffect(() => {
    if (!isoDate) return;
    const tick = () => {
      const diff = new Date(isoDate).getTime() - Date.now();
      if (diff <= 0) {
        setDisplay("Unlocking now…");
        return;
      }
      const d = Math.floor(diff / 86_400_000);
      const h = Math.floor((diff % 86_400_000) / 3_600_000);
      const m = Math.floor((diff % 3_600_000) / 60_000);
      const s = Math.floor((diff % 60_000) / 1_000);
      setDisplay(`${d}d ${h}h ${m}m ${s}s`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [isoDate]);

  return display;
}

// ── Shared UI ─────────────────────────────────────────────────────────────────

function Spinner({ light = false }: { light?: boolean }) {
  return (
    <svg
      className={`animate-spin h-5 w-5 ${light ? "text-white" : "text-teal-500"} inline-block`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}

// ── Locked state ──────────────────────────────────────────────────────────────

function LockedView({
  moduleNum,
  lockedUntil,
}: {
  moduleNum: number;
  lockedUntil: string | null;
}) {
  const countdown = useCountdown(lockedUntil);
  const unlockDate = lockedUntil
    ? new Date(lockedUntil).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
        <svg
          className="w-10 h-10 text-gray-400"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
          />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Module {moduleNum} is Locked
      </h2>
      {unlockDate ? (
        <>
          <p className="text-gray-500 mb-4">
            Unlocks on <strong>{unlockDate}</strong>
          </p>
          {countdown && (
            <div className="bg-teal-50 border border-teal-200 rounded-xl px-6 py-3 inline-block">
              <p className="text-xs text-teal-600 font-semibold uppercase tracking-widest mb-1">
                Time until unlock
              </p>
              <p className="text-2xl font-bold text-teal-700 tabular-nums">
                {countdown}
              </p>
            </div>
          )}
        </>
      ) : (
        <p className="text-gray-500">
          Complete the previous module to unlock this one.
        </p>
      )}
    </div>
  );
}

// ── Module content view ───────────────────────────────────────────────────────

function ModuleView({
  moduleNum,
  content,
  moduleData,
}: {
  moduleNum: number;
  content: ModuleContent;
  moduleData: ModuleProgress | null;
}) {
  const router = useRouter();
  const [completing, setCompleting] = useState(false);
  const [completed, setCompleted] = useState(!!moduleData?.completed_at);

  async function handleComplete() {
    setCompleting(true);
    try {
      const res = await fetch("/api/modules/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module_number: moduleNum }),
      });
      if (res.ok) {
        setCompleted(true);
        router.refresh();
      }
    } finally {
      setCompleting(false);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 bg-teal-50 text-teal-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
            Module {moduleNum} of 7 · {content.duration}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {content.title}
          </h1>
        </div>
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
        <p className="text-gray-700 text-base leading-relaxed">
          {content.description}
        </p>
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
              <svg
                className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              {t}
            </li>
          ))}
        </ul>
      </div>

      {/* Mark complete button */}
      <button
        onClick={handleComplete}
        disabled={completed || completing}
        className={`w-full py-4 rounded-xl font-bold text-base transition-colors flex items-center justify-center gap-2 ${
          completed
            ? "bg-green-100 text-green-700 cursor-default"
            : "bg-teal-500 hover:bg-teal-700 text-white disabled:opacity-60"
        }`}
      >
        {completing ? (
          <>
            <Spinner light /> Saving…
          </>
        ) : completed ? (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            Completed ✓
          </>
        ) : (
          "Mark as Complete"
        )}
      </button>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ModulePage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const moduleNum = parseInt(params.id, 10);

  const [pageState, setPageState] = useState<
    "loading" | "locked" | "unlocked" | "error"
  >("loading");
  const [lockedUntil, setLockedUntil] = useState<string | null>(null);
  const [moduleData, setModuleData] = useState<ModuleProgress | null>(null);

  const loadModule = useCallback(() => {
    if (!Number.isInteger(moduleNum) || moduleNum < 1 || moduleNum > 7) {
      router.replace("/dashboard/module/1");
      return;
    }

    setPageState("loading");

    fetch("/api/modules/access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ module_number: moduleNum }),
    })
      .then(async (res) => {
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        const data = await res.json();
        if (data.locked) {
          setLockedUntil(data.locked_until ?? null);
          setPageState("locked");
        } else {
          setModuleData(data.module ?? null);
          setPageState("unlocked");
          router.refresh();
        }
      })
      .catch(() => setPageState("error"));
  }, [moduleNum, router]);

  useEffect(() => {
    loadModule();
  }, [loadModule]);

  const content = MODULE_CONTENT[moduleNum];

  if (!content && pageState !== "loading") {
    router.replace("/dashboard/module/1");
    return null;
  }

  if (pageState === "loading") {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="flex flex-col items-center gap-3">
          <Spinner />
          <p className="text-sm text-gray-400">Loading module…</p>
        </div>
      </div>
    );
  }

  if (pageState === "error") {
    return (
      <div className="flex flex-col items-center py-20 text-center gap-4">
        <p className="text-gray-700 font-medium">Failed to load this module.</p>
        <button
          onClick={loadModule}
          className="text-teal-600 hover:underline text-sm"
        >
          Try again
        </button>
      </div>
    );
  }

  if (pageState === "locked") {
    return <LockedView moduleNum={moduleNum} lockedUntil={lockedUntil} />;
  }

  return (
    <ModuleView moduleNum={moduleNum} content={content} moduleData={moduleData} />
  );
}
