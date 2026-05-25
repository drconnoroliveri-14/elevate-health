"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Props {
  videoId: string;
  moduleNumber: number;
  initialCompleted: boolean;
}

export default function ModuleVideoPlayer({ videoId, moduleNumber, initialCompleted }: Props) {
  const [completed, setCompleted] = useState(initialCompleted);
  const [autoCompleted, setAutoCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const completedRef = useRef(initialCompleted);
  const router = useRouter();
  const nextModule = moduleNumber < 7 ? moduleNumber + 1 : null;

  async function markComplete() {
    if (completedRef.current) return;
    setLoading(true);
    try {
      const res = await fetch("/api/modules/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module_number: moduleNumber }),
      });
      if (res.ok) {
        completedRef.current = true;
        setCompleted(true);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  // Keep a stable ref so the YT event handler always calls the latest version
  const markCompleteRef = useRef(markComplete);
  useEffect(() => {
    markCompleteRef.current = markComplete;
  });

  useEffect(() => {
    if (!document.getElementById("yt-iframe-api")) {
      const tag = document.createElement("script");
      tag.id = "yt-iframe-api";
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    }

    let player: { destroy: () => void } | null = null;

    function initPlayer() {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      player = new (window as any).YT.Player("youtube-player", {
        videoId,
        playerVars: { rel: 0 },
        events: {
          onStateChange: (event: { data: number }) => {
            if (event.data === 0) { // 0 = YT.PlayerState.ENDED
              setAutoCompleted(true);
              markCompleteRef.current();
            }
          },
        },
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).YT?.Player) {
      initPlayer();
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      player?.destroy();
    };
  }, [videoId]);

  return (
    <>
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
        <div
          id="youtube-player"
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
        />
      </div>

      {/* Auto-complete success banner */}
      {autoCompleted && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-5 py-4 mb-6">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          <span className="text-green-800 font-semibold text-sm">Module complete! Great work.</span>
          {nextModule && (
            <Link
              href={`/dashboard/module/${nextModule}`}
              className="ml-auto bg-teal-500 hover:bg-teal-700 text-white font-bold text-sm px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
            >
              Continue to Module {nextModule} →
            </Link>
          )}
        </div>
      )}

      {/* Manual mark complete button */}
      <button
        onClick={markComplete}
        disabled={completed || loading}
        className={`w-full py-4 rounded-xl font-bold text-base transition-colors flex items-center justify-center gap-2 ${
          completed
            ? "bg-green-100 text-green-700 cursor-default"
            : "bg-teal-500 hover:bg-teal-700 text-white disabled:opacity-60"
        }`}
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Saving…
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
    </>
  );
}
