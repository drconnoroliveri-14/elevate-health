"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/auth-helpers-nextjs";
import type { Profile, ModuleProgress } from "@/types";

const MODULES = [
  { num: 1, title: "The Science of Aging" },
  { num: 2, title: "Nutrition for Longevity" },
  { num: 3, title: "Movement & VO2 Max" },
  { num: 4, title: "Sleep Architecture & HRV" },
  { num: 5, title: "Hormones, Peptides & Supplements" },
  { num: 6, title: "Biomarker Testing & Tracking" },
  { num: 7, title: "Your Personal 90-Day Protocol" },
];

type ModuleStatus = "completed" | "unlocked" | "locked";

function getModuleStatus(
  num: number,
  progress: ModuleProgress[]
): ModuleStatus {
  const p = progress.find((r) => r.module_number === num);
  if (!p) return "locked";
  if (p.completed_at) return "completed";
  if (new Date(p.unlocked_at) <= new Date()) return "unlocked";
  return "locked";
}

function CompletedIcon() {
  return (
    <svg
      className="w-4 h-4 text-green-500 flex-shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg
      className="w-4 h-4 text-teal-500 flex-shrink-0"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      className="w-4 h-4 text-gray-400 flex-shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
      />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

interface DashboardShellProps {
  profile: Profile | null;
  moduleProgress: ModuleProgress[];
  userEmail: string;
  children: React.ReactNode;
}

export default function DashboardShell({
  profile,
  moduleProgress,
  userEmail,
  children,
}: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const completedCount = moduleProgress.filter((p) => !!p.completed_at).length;
  const progressPercent = Math.round((completedCount / 7) * 100);

  const showUpsell =
    !!profile?.purchased_at &&
    Date.now() - new Date(profile.purchased_at).getTime() >
      14 * 24 * 60 * 60 * 1000;

  async function handleLogout() {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.auth.signOut();
    router.push("/login");
  }

  function activeModule(): number | null {
    const match = pathname.match(/\/dashboard\/module\/(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  }

  const currentModule = activeModule();

  const sidebar = (
    <aside className="w-60 bg-teal-700 text-white flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-teal-600">
        <Link href="/dashboard">
          <Image src="/logo.PNG" alt="Elevate Health" height={40} width={160} style={{ height: 40, width: "auto" }} unoptimized />
        </Link>
      </div>

      {/* Module list */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p className="text-teal-300 text-xs font-semibold uppercase tracking-widest px-2 mb-3">
          My Course
        </p>
        <ul className="space-y-1">
          {MODULES.map((m) => {
            const status = getModuleStatus(m.num, moduleProgress);
            const isActive = currentModule === m.num;

            return (
              <li key={m.num}>
                {status === "locked" ? (
                  <div
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-teal-300 cursor-not-allowed opacity-60"
                    title="Locked"
                  >
                    <span className="w-5 h-5 rounded-full bg-teal-600 text-xs font-bold flex items-center justify-center flex-shrink-0 text-teal-200">
                      {m.num}
                    </span>
                    <span className="text-sm truncate flex-1">{m.title}</span>
                    <LockIcon />
                  </div>
                ) : (
                  <Link
                    href={`/dashboard/module/${m.num}`}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      isActive
                        ? "bg-teal-500 text-white"
                        : "text-teal-100 hover:bg-teal-600"
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0 ${
                        isActive ? "bg-white text-teal-700" : "bg-teal-600 text-teal-100"
                      }`}
                    >
                      {m.num}
                    </span>
                    <span className="text-sm truncate flex-1">{m.title}</span>
                    {status === "completed" ? (
                      <CompletedIcon />
                    ) : (
                      <PlayIcon />
                    )}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-teal-600 space-y-2">
        <p className="text-teal-200 text-xs truncate">{userEmail}</p>
        <button
          onClick={handleLogout}
          className="w-full text-left text-sm text-teal-300 hover:text-white transition-colors py-1"
        >
          Log Out →
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">{sidebar}</div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative z-50 flex flex-col w-60">{sidebar}</div>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Mobile topbar */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-teal-700 text-white">
          <button onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <MenuIcon />
          </button>
          <Image src="/logo.PNG" alt="Elevate Health" height={40} width={160} style={{ height: 40, width: "auto" }} unoptimized />
          {sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="ml-auto"
              aria-label="Close menu"
            >
              <CloseIcon />
            </button>
          )}
        </div>

        {/* Progress bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4">
          <span className="text-sm text-gray-500 whitespace-nowrap">
            {completedCount} of 7 modules complete
          </span>
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div
              className="bg-teal-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-teal-600 whitespace-nowrap">
            {progressPercent}%
          </span>
        </div>

        {/* Scrollable page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">{children}</div>

          {/* Upsell banner */}
          {showUpsell && (
            <div className="sticky bottom-0 bg-teal-700 text-white px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
              <p className="text-sm text-teal-100 text-center sm:text-left">
                Ready to go deeper? Book a 1-on-1 coaching call with our
                longevity experts.
              </p>
              <a
                href="https://buy.stripe.com/placeholder_coaching_link"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 bg-white text-teal-700 font-semibold text-sm px-5 py-2 rounded-lg hover:bg-teal-50 transition-colors"
              >
                Add a Coaching Call — $497 →
              </a>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
