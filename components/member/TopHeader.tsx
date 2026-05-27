"use client";

import { Bell } from "lucide-react";
import { LogoMark } from "./LogoMark";
import { useAuth } from "@/lib/auth/AuthContext";

interface TopHeaderProps {
  transparent?: boolean;
}

export function TopHeader({ transparent = false }: TopHeaderProps) {
  const { profile } = useAuth();
  const initials = profile?.name
    ? profile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "M";

  return (
    <header
      className={`flex items-center justify-between px-5 h-14 ${
        transparent ? "bg-transparent" : "bg-onyx"
      }`}
    >
      <div className="flex items-center gap-2">
        <LogoMark color="#E6E7D7" size={28} />
        <span className="font-heading font-bold text-cream text-lg tracking-tight">
          Embers + Ice
        </span>
      </div>
      <div className="flex items-center gap-3">
        <button className="text-slate hover:text-cream transition-colors">
          <Bell size={20} strokeWidth={1.5} />
        </button>
        <div className="w-8 h-8 rounded-full bg-ember flex items-center justify-center">
          <span className="text-xs font-heading font-bold text-cream">{initials}</span>
        </div>
      </div>
    </header>
  );
}
