"use client";

import { motion } from "framer-motion";
import { Users, Flame, Snowflake, Clock, LogOut } from "lucide-react";
import { LogoMark } from "@/components/member/LogoMark";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/auth/AuthContext";
import { useRouter } from "next/navigation";

const ACTIVE_SESSIONS = [
  { member: "Alex R.", room: "Sauna A", elapsed: "12:34", type: "ember" as const },
  { member: "Jordan K.", room: "Cold B", elapsed: "04:22", type: "ice" as const },
  { member: "Sam W.", room: "Sauna B", elapsed: "08:15", type: "ember" as const },
];

export default function StaffDashboard() {
  const { profile, signOut } = useAuth();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-onyx px-5 pt-12 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <LogoMark color="#E6E7D7" size={28} />
            <span className="font-heading font-bold text-cream text-lg">Staff Portal</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={async () => {
              await signOut();
              router.push("/login");
            }}
          >
            <LogOut size={14} className="mr-1.5" />
            Sign Out
          </Button>
        </div>
        <p className="font-body text-slate text-sm">
          Welcome back, <span className="text-cream">{profile?.name ?? "Staff"}</span>
        </p>
        <Badge variant="ember" className="mt-2">
          {profile?.role ?? "staff"}
        </Badge>
      </div>

      <div className="px-5 py-6 flex flex-col gap-6">
        {/* Live stats */}
        <motion.div
          className="grid grid-cols-3 gap-3"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {[
            { label: "Active Now", value: "3", icon: Users, color: "text-ember" },
            { label: "Sauna Rooms", value: "2/2", icon: Flame, color: "text-ember" },
            { label: "Cold Rooms", value: "1/2", icon: Snowflake, color: "text-ice" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-onyx rounded-2xl p-4 flex flex-col items-center gap-1.5">
              <Icon size={18} className={color} />
              <span className="font-heading font-bold text-cream text-xl">{value}</span>
              <span className="text-xs font-body text-slate text-center">{label}</span>
            </div>
          ))}
        </motion.div>

        {/* Active sessions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="font-heading font-bold text-onyx text-base mb-3">Active Sessions</h3>
          <div className="flex flex-col gap-3">
            {ACTIVE_SESSIONS.map(({ member, room, elapsed, type }) => (
              <Card key={member} variant="default">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        type === "ember" ? "bg-ember/12" : "bg-ice/12"
                      }`}
                    >
                      {type === "ember" ? (
                        <Flame size={18} className="text-ember" />
                      ) : (
                        <Snowflake size={18} className="text-ice" />
                      )}
                    </div>
                    <div>
                      <p className="font-body font-medium text-onyx text-sm">{member}</p>
                      <p className="text-xs font-body text-slate">{room}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={13} className="text-slate" />
                    <span className="font-heading font-bold text-onyx text-sm">{elapsed}</span>
                    <Badge variant={type}>Live</Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Today's summary */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card variant="dark">
            <h3 className="font-heading font-bold text-cream text-base mb-4">Today&apos;s Summary</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Check-ins", value: "24" },
                { label: "Sessions", value: "38" },
                { label: "New Members", value: "3" },
                { label: "Avg Session", value: "18 min" },
              ].map(({ label, value }) => (
                <div key={label} className="bg-slate/10 rounded-xl p-3">
                  <p className="text-xs font-body text-slate uppercase tracking-wider">{label}</p>
                  <p className="font-heading font-bold text-cream text-lg mt-0.5">{value}</p>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
