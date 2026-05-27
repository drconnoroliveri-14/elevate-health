"use client";

import { motion } from "framer-motion";
import { TrendingUp, Flame, Snowflake, Award } from "lucide-react";
import { TopHeader } from "@/components/member/TopHeader";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { Badge } from "@/components/ui/Badge";

const WEEKLY_DATA = [
  { day: "M", sauna: 20, cold: 8 },
  { day: "T", sauna: 0, cold: 0 },
  { day: "W", sauna: 25, cold: 10 },
  { day: "T", sauna: 20, cold: 0 },
  { day: "F", sauna: 30, cold: 8 },
  { day: "S", sauna: 0, cold: 6 },
  { day: "S", sauna: 20, cold: 8 },
];

const maxTotal = Math.max(...WEEKLY_DATA.map((d) => d.sauna + d.cold)) || 1;

export default function ProgressPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-onyx">
        <TopHeader />
        <div className="px-5 pb-6 pt-4">
          <h2 className="font-heading font-bold text-cream text-2xl">Progress</h2>
          <p className="font-body text-slate text-sm mt-1">Your wellness journey</p>
        </div>
      </div>

      <div className="px-5 py-6 flex flex-col gap-6">
        {/* Monthly stats */}
        <motion.div
          className="grid grid-cols-2 gap-3"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <StatCard label="Total Sessions" value={22} theme="slate" />
          <StatCard label="Hours Logged" value="6.4" unit="hrs" theme="slate" />
          <StatCard label="Sauna Time" value="4.5" unit="hrs" theme="ember" />
          <StatCard label="Cold Time" value="1.9" unit="hrs" theme="ice" />
        </motion.div>

        {/* Monthly goals */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card variant="dark">
            <h3 className="font-heading font-bold text-cream text-base mb-4">Monthly Goals</h3>
            <div className="flex justify-around">
              <div className="flex flex-col items-center gap-2">
                <ProgressRing progress={73} color="ember" size="md" label="73%" />
                <p className="text-xs font-body text-slate">22/30 sessions</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <ProgressRing progress={88} color="ice" size="md" label="88%" />
                <p className="text-xs font-body text-slate">HRV goal</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Weekly chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card variant="default">
            <h3 className="font-heading font-bold text-onyx text-base mb-4">This Week</h3>
            <div className="flex items-end justify-between gap-2 h-24">
              {WEEKLY_DATA.map(({ day, sauna, cold }, i) => {
                const total = sauna + cold;
                const height = (total / maxTotal) * 100;
                const saunaH = total > 0 ? (sauna / total) * height : 0;
                const coldH = total > 0 ? (cold / total) * height : 0;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="flex flex-col justify-end w-full rounded-t-md overflow-hidden" style={{ height: "80px" }}>
                      {cold > 0 && (
                        <div
                          className="w-full bg-ice rounded-t-sm"
                          style={{ height: `${coldH}%` }}
                        />
                      )}
                      {sauna > 0 && (
                        <div
                          className="w-full bg-ember"
                          style={{ height: `${saunaH}%`, borderRadius: cold === 0 ? "4px 4px 0 0" : 0 }}
                        />
                      )}
                      {total === 0 && (
                        <div className="w-full bg-slate/20 rounded-sm" style={{ height: "4px" }} />
                      )}
                    </div>
                    <span className="text-xs font-body text-slate">{day}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-4 mt-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-ember" />
                <span className="text-xs font-body text-slate">Sauna</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-ice" />
                <span className="text-xs font-body text-slate">Cold</span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <h3 className="font-heading font-bold text-onyx text-base mb-3">Achievements</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: "🔥", label: "15-Day Streak", sub: "Consistency king", unlocked: true },
              { icon: "🧊", label: "Ice Warrior", sub: "10 cold sessions", unlocked: true },
              { icon: "⚡", label: "30 Sessions", sub: "7 more to go", unlocked: false },
              { icon: "🏆", label: "100 Sessions", sub: "78 more to go", unlocked: false },
            ].map(({ icon, label, sub, unlocked }) => (
              <Card key={label} variant={unlocked ? "dark" : "default"} className={!unlocked ? "opacity-50" : ""}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{icon}</span>
                  <div>
                    <p className={`font-body font-medium text-sm ${unlocked ? "text-cream" : "text-onyx"}`}>
                      {label}
                    </p>
                    <p className={`text-xs font-body ${unlocked ? "text-slate" : "text-slate/70"}`}>
                      {sub}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
