"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Zap, TrendingUp, Users } from "lucide-react";

const tabs = [
  { label: "Home", href: "/member/dashboard", icon: Home },
  { label: "Session", href: "/member/session/sauna", icon: Zap },
  { label: "Progress", href: "/member/progress", icon: TrendingUp },
  { label: "Community", href: "/member/community", icon: Users },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-onyx border-t border-slate/20 safe-area-bottom">
      <div className="flex items-stretch max-w-md mx-auto">
        {tabs.map(({ label, href, icon: Icon }) => {
          const isActive = pathname.startsWith(href);
          const isSession = label === "Session";
          const activeColor = isSession ? "text-ice" : "text-ember";

          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-colors ${
                isActive ? activeColor : "text-slate"
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 1.5} />
              <span className="text-[10px] font-body font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
