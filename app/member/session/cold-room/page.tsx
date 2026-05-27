"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Snowflake, ChevronLeft, Pause, Play, Square } from "lucide-react";
import { SessionTimer } from "@/components/ui/SessionTimer";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { Button } from "@/components/ui/Button";

const TARGET_SECONDS = 8 * 60;

export default function ColdRoomSessionPage() {
  const router = useRouter();
  const [running, setRunning] = useState(false);
  const [started, setStarted] = useState(false);

  function handleStart() {
    setStarted(true);
    setRunning(true);
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#0a1a2a" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-12 pb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-slate hover:text-cream transition-colors"
        >
          <ChevronLeft size={20} />
          <span className="font-body text-sm">Back</span>
        </button>
        <div className="flex items-center gap-2">
          <Snowflake size={18} className="text-ice" />
          <span className="font-heading font-bold text-cream text-base">Cold Room Session</span>
        </div>
        <div className="w-16" />
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 gap-8">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ProgressRing
            progress={0}
            color="ice"
            size="lg"
            label="0%"
          />
        </motion.div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-slate font-body text-sm mb-2 uppercase tracking-wider">
            Time Remaining
          </p>
          <SessionTimer
            mode="countdown"
            theme="ice"
            running={running}
            initialSeconds={TARGET_SECONDS}
          />
          <p className="text-slate font-body text-sm mt-3">
            Target: 8:00
          </p>
        </motion.div>

        <div className="w-full bg-ice/10 rounded-2xl p-4 border border-ice/20">
          <p className="text-ice/60 font-body text-xs uppercase tracking-wider mb-1">Room</p>
          <p className="text-cream font-heading font-bold text-base">Cold Room — Room B</p>
          <p className="text-slate font-body text-sm mt-1">Target temp: 39°F</p>
        </div>
      </div>

      {/* Controls */}
      <div className="px-5 pb-12 pt-6 flex flex-col gap-3">
        {!started ? (
          <Button variant="secondary" size="lg" fullWidth onClick={handleStart}>
            <Snowflake size={18} className="mr-2" />
            Start Session
          </Button>
        ) : (
          <div className="flex gap-3">
            <Button
              variant="ghost"
              size="lg"
              className="flex-1"
              onClick={() => setRunning((r) => !r)}
            >
              {running ? <Pause size={18} /> : <Play size={18} />}
              <span className="ml-2">{running ? "Pause" : "Resume"}</span>
            </Button>
            <Button
              variant="dark"
              size="lg"
              className="flex-1"
              onClick={() => router.push("/member/report")}
            >
              <Square size={18} />
              <span className="ml-2">End</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
