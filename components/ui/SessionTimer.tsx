"use client";

import { useEffect, useState, useRef } from "react";

type TimerMode = "countdown" | "countup";
type TimerTheme = "ember" | "ice";

interface SessionTimerProps {
  mode?: TimerMode;
  theme?: TimerTheme;
  initialSeconds?: number;
  running?: boolean;
  onComplete?: () => void;
  className?: string;
}

const themeColors: Record<TimerTheme, string> = {
  ember: "#FF5740",
  ice: "#6AB9DF",
};

export function SessionTimer({
  mode = "countup",
  theme = "ember",
  initialSeconds = 0,
  running = false,
  onComplete,
  className = "",
}: SessionTimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setSeconds(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (mode === "countdown") {
            if (prev <= 1) {
              clearInterval(intervalRef.current!);
              onComplete?.();
              return 0;
            }
            return prev - 1;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, mode, onComplete]);

  const displaySeconds = mode === "countdown" ? seconds : seconds;
  const mins = Math.floor(displaySeconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = (displaySeconds % 60).toString().padStart(2, "0");

  return (
    <div
      className={`font-heading font-bold tabular-nums select-none ${className}`}
      style={{ fontSize: 72, color: themeColors[theme], lineHeight: 1 }}
    >
      {mins}:{secs}
    </div>
  );
}
