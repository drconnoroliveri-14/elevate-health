"use client";

import { motion, type Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import { Flame, Snowflake, Clock, ChevronRight } from "lucide-react";
import { TopHeader } from "@/components/member/TopHeader";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/auth/AuthContext";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

const RECENT_SESSIONS = [
  { date: "Today", type: "Sauna", badge: "ember" as const, duration: "20 min", hrv: "+4" },
  { date: "Yesterday", type: "Cold Room", badge: "ice" as const, duration: "8 min", hrv: "+7" },
  { date: "May 25", type: "Sauna", badge: "ember" as const, duration: "25 min", hrv: "+3" },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function MemberDashboard() {
  const router = useRouter();
  const { profile } = useAuth();
  const firstName = profile?.name?.split(" ")[0] ?? "Member";

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero — Onyx */}
      <section className="bg-onyx pt-0 pb-6">
        <TopHeader />
        <motion.div
          className="px-5 pt-4"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.h2 variants={fadeUp} className="font-heading font-bold text-cream text-2xl leading-tight">
            {getGreeting()}, {firstName}
          </motion.h2>
          <motion.p variants={fadeUp} className="font-body text-slate text-sm mt-1 mb-5">
            Ready for today&apos;s session?
          </motion.p>

          {/* Today's protocol card */}
          <motion.div variants={fadeUp}>
            <Card variant="dark" className="border-l-4 border-l-ember">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-body text-slate uppercase tracking-wider mb-1">
                    Today&apos;s Protocol
                  </p>
                  <p className="font-heading font-bold text-cream text-base">
                    Contrast Therapy — Full
                  </p>
                  <p className="text-sm font-body text-slate mt-0.5">
                    20 min sauna · 8 min cold room
                  </p>
                </div>
                <Badge variant="ember">Active</Badge>
              </div>
              <p className="text-xs font-body text-slate mt-3">
                Goal: Increase HRV by 5+ points
              </p>
            </Card>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats row */}
      <section className="bg-cream px-5 py-6">
        <motion.div
          className="grid grid-cols-3 gap-3"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={fadeUp}>
            <StatCard label="Streak" value={14} unit="days" theme="ember" />
          </motion.div>
          <motion.div variants={fadeUp}>
            <StatCard label="This Month" value={22} unit="sessions" theme="slate" />
          </motion.div>
          <motion.div variants={fadeUp}>
            <StatCard label="Avg Time" value={18} unit="min" theme="ice" />
          </motion.div>
        </motion.div>
      </section>

      {/* Next session */}
      <section className="bg-cream px-5 pb-6">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.h3 variants={fadeUp} className="font-heading font-bold text-onyx text-lg mb-3">
            Upcoming Session
          </motion.h3>
          <motion.div variants={fadeUp}>
            <Card variant="sand">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-heading font-bold text-onyx text-base">
                    Sauna — Room A
                  </p>
                  <p className="text-sm font-body text-onyx/60 mt-0.5">
                    Today · 6:30 PM · 20 min
                  </p>
                </div>
                <Badge variant="ember">Sauna</Badge>
              </div>
              <Button
                variant="primary"
                size="md"
                fullWidth
                onClick={() => router.push("/member/session/sauna")}
              >
                Start Session
              </Button>
            </Card>
          </motion.div>
        </motion.div>
      </section>

      {/* Recent sessions */}
      <section className="bg-cream px-5 pb-6">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.h3 variants={fadeUp} className="font-heading font-bold text-onyx text-lg mb-3">
            Recent Sessions
          </motion.h3>
          <motion.div variants={fadeUp} className="flex flex-col gap-3">
            {RECENT_SESSIONS.map((s) => (
              <div
                key={s.date + s.type}
                className="flex items-center justify-between bg-cream border border-slate/20 rounded-2xl px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      s.badge === "ember" ? "bg-ember/12" : "bg-ice/12"
                    }`}
                  >
                    {s.badge === "ember" ? (
                      <Flame size={18} className="text-ember" />
                    ) : (
                      <Snowflake size={18} className="text-ice" />
                    )}
                  </div>
                  <div>
                    <p className="font-body font-medium text-onyx text-sm">{s.type}</p>
                    <p className="text-xs font-body text-slate">{s.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-body text-slate flex items-center gap-1">
                    <Clock size={12} />
                    {s.duration}
                  </span>
                  <Badge variant={s.badge}>{s.hrv} HRV</Badge>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Quick start */}
      <section className="bg-cream px-5 pb-8">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.h3 variants={fadeUp} className="font-heading font-bold text-onyx text-lg mb-3">
            Quick Start
          </motion.h3>
          <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4">
            {/* Sauna */}
            <Card
              variant="ember"
              className="flex flex-col items-center gap-3 py-6 cursor-pointer"
              onClick={() => router.push("/member/session/sauna")}
            >
              <div className="w-12 h-12 rounded-2xl bg-cream/20 flex items-center justify-center">
                <Flame size={26} className="text-cream" />
              </div>
              <p className="font-heading font-bold text-cream text-sm text-center">
                Sauna Room
              </p>
              <button className="mt-1 text-xs font-body text-cream/80 flex items-center gap-1">
                Start <ChevronRight size={12} />
              </button>
            </Card>

            {/* Cold room */}
            <Card
              variant="ice"
              className="flex flex-col items-center gap-3 py-6 cursor-pointer"
              onClick={() => router.push("/member/session/cold-room")}
            >
              <div className="w-12 h-12 rounded-2xl bg-onyx/10 flex items-center justify-center">
                <Snowflake size={26} className="text-onyx" />
              </div>
              <p className="font-heading font-bold text-onyx text-sm text-center">
                Cold Room
              </p>
              <button className="mt-1 text-xs font-body text-onyx/60 flex items-center gap-1">
                Start <ChevronRight size={12} />
              </button>
            </Card>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
