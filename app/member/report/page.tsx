"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { CheckCircle, ChevronLeft } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/ui/StatCard";

export default function SessionReportPage() {
  const router = useRouter();
  const [hrvFeeling, setHrvFeeling] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-onyx">
      <div className="flex items-center px-5 pt-12 pb-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-slate hover:text-cream transition-colors"
        >
          <ChevronLeft size={20} />
          <span className="font-body text-sm">Back</span>
        </button>
      </div>

      <motion.div
        className="px-5 flex flex-col gap-6 pb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Completion */}
        <div className="flex flex-col items-center text-center pt-4 pb-2">
          <CheckCircle size={48} className="text-ember mb-3" />
          <h1 className="font-heading font-bold text-cream text-2xl">Session Complete</h1>
          <p className="font-body text-slate text-sm mt-1">Great work, Alex</p>
        </div>

        {/* Session summary */}
        <Card variant="dark">
          <div className="flex items-center justify-between mb-4">
            <p className="font-heading font-bold text-cream text-base">Sauna — Room A</p>
            <Badge variant="ember">Sauna</Badge>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <StatCard label="Duration" value="20" unit="min" theme="ember" />
            <StatCard label="Calories" value="~180" theme="slate" />
            <StatCard label="HRV Delta" value="+5" theme="ice" />
          </div>
        </Card>

        {/* How did you feel? */}
        <Card variant="dark">
          <p className="font-heading font-bold text-cream text-base mb-4">
            How did you feel?
          </p>
          <div className="flex gap-3 justify-between">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => setHrvFeeling(n)}
                className={`flex-1 py-3 rounded-xl font-body font-bold text-lg transition-all ${
                  hrvFeeling === n
                    ? "bg-ember text-cream"
                    : "bg-slate/15 text-slate hover:bg-slate/25"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          <p className="text-slate text-xs font-body text-center mt-2">1 = Exhausted · 5 = Energized</p>
        </Card>

        {/* Streak */}
        <div className="bg-ember/12 border border-ember/25 rounded-2xl px-5 py-4 flex items-center gap-3">
          <span className="text-3xl">🔥</span>
          <div>
            <p className="font-heading font-bold text-ember text-base">15 Day Streak!</p>
            <p className="font-body text-slate text-xs mt-0.5">
              You&apos;re on fire — keep the momentum going.
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => router.push("/member/dashboard")}
        >
          Back to Dashboard
        </Button>
      </motion.div>
    </div>
  );
}
