"use client";

import { motion } from "framer-motion";
import { Flame, Snowflake, TrendingUp, Users } from "lucide-react";
import { TopHeader } from "@/components/member/TopHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const LEADERBOARD = [
  { rank: 1, name: "Jordan K.", sessions: 28, streak: 21, badge: "ember" as const },
  { rank: 2, name: "Alex R.", sessions: 22, streak: 15, badge: "ice" as const },
  { rank: 3, name: "Sam W.", sessions: 19, streak: 12, badge: "ember" as const },
  { rank: 4, name: "Casey M.", sessions: 17, streak: 9, badge: "slate" as const },
  { rank: 5, name: "Riley T.", sessions: 15, streak: 7, badge: "slate" as const },
];

const ACTIVITY_FEED = [
  { name: "Jordan K.", action: "completed a 25 min sauna session", time: "5 min ago", type: "sauna" },
  { name: "Sam W.", action: "hit a 12-day streak 🎉", time: "1 hr ago", type: "milestone" },
  { name: "Casey M.", action: "completed 8 min cold room", time: "2 hrs ago", type: "cold" },
  { name: "Riley T.", action: "started their first contrast session", time: "3 hrs ago", type: "milestone" },
];

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-onyx">
        <TopHeader />
        <div className="px-5 pb-6 pt-4">
          <h2 className="font-heading font-bold text-cream text-2xl">Community</h2>
          <p className="font-body text-slate text-sm mt-1">Train together, recover together</p>
        </div>
      </div>

      <div className="px-5 py-6 flex flex-col gap-6">
        {/* Studio stats */}
        <motion.div
          className="grid grid-cols-3 gap-3"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {[
            { label: "Members", value: "142", icon: Users },
            { label: "Sessions Today", value: "38", icon: Flame },
            { label: "Active Now", value: "7", icon: TrendingUp },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-slate/10 rounded-2xl p-4 flex flex-col items-center gap-1.5">
              <Icon size={18} className="text-slate" />
              <span className="font-heading font-bold text-onyx text-xl">{value}</span>
              <span className="text-xs font-body text-slate text-center">{label}</span>
            </div>
          ))}
        </motion.div>

        {/* Monthly leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="font-heading font-bold text-onyx text-base mb-3">Monthly Leaderboard</h3>
          <Card variant="default" className="p-0 overflow-hidden">
            {LEADERBOARD.map(({ rank, name, sessions, streak, badge }, i) => (
              <div
                key={name}
                className={`flex items-center px-4 py-3.5 gap-3 ${
                  i < LEADERBOARD.length - 1 ? "border-b border-slate/15" : ""
                } ${rank === 2 ? "bg-ember/5" : ""}`}
              >
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-heading font-bold text-xs ${
                    rank === 1
                      ? "bg-ember text-cream"
                      : rank === 2
                      ? "bg-slate/20 text-onyx"
                      : rank === 3
                      ? "bg-sand text-onyx"
                      : "bg-slate/10 text-slate"
                  }`}
                >
                  {rank}
                </span>
                <span className="flex-1 font-body font-medium text-onyx text-sm">{name}</span>
                <span className="text-xs font-body text-slate">{sessions} sessions</span>
                <Badge variant={badge}>🔥 {streak}</Badge>
              </div>
            ))}
          </Card>
        </motion.div>

        {/* Activity feed */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="font-heading font-bold text-onyx text-base mb-3">Activity</h3>
          <div className="flex flex-col gap-3">
            {ACTIVITY_FEED.map(({ name, action, time, type }) => (
              <div key={name + time} className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    type === "sauna"
                      ? "bg-ember/12"
                      : type === "cold"
                      ? "bg-ice/12"
                      : "bg-slate/12"
                  }`}
                >
                  {type === "sauna" ? (
                    <Flame size={16} className="text-ember" />
                  ) : type === "cold" ? (
                    <Snowflake size={16} className="text-ice" />
                  ) : (
                    <TrendingUp size={16} className="text-slate" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-body text-onyx">
                    <span className="font-medium">{name}</span>{" "}
                    <span className="text-slate">{action}</span>
                  </p>
                  <p className="text-xs font-body text-slate mt-0.5">{time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
