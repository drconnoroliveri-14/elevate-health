"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/auth-helpers-nextjs";
import type { Profile, ModuleProgress } from "@/types";

const MODULES = [
  { num: 1, title: "Understanding Your Pain" },
  { num: 2, title: "Neck Pain Relief Protocol" },
  { num: 3, title: "Mid Back Pain Relief Protocol" },
  { num: 4, title: "Lower Back Pain Relief Protocol" },
  { num: 5, title: "Posture Correction & Alignment" },
  { num: 6, title: "Strengthening for a Pain-Free Life" },
  { num: 7, title: "Your Personal 90-Day Pain-Free Protocol" },
];

type ModuleStatus = "completed" | "unlocked" | "locked";

function getModuleStatus(
  num: number,
  progress: ModuleProgress[]
): ModuleStatus {
  const p = progress.find((r) => r.module_number === num);
  if (p?.completed_at) return "completed";
  return "unlocked"; // purchased = full access; drip logic removed
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
          <Image src="/logo.PNG" alt="Elevate Health" width={140} height={70} unoptimized style={{height: '70px', width: 'auto'}} />
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

        {/* Bonuses + purchased add-ons */}
        <div className="mt-4 pt-4 border-t border-teal-600 space-y-1">
          <Link
            href="/dashboard/bonuses"
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              pathname === "/dashboard/bonuses"
                ? "bg-teal-500 text-white"
                : "text-teal-100 hover:bg-teal-600"
            }`}
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
            <span className="text-sm font-medium flex-1">My Bonuses</span>
          </Link>

          {profile?.has_nutrition_course && (
            <Link
              href="/dashboard/nutrition"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                pathname === "/dashboard/nutrition"
                  ? "bg-teal-500 text-white"
                  : "text-teal-100 hover:bg-teal-600"
              }`}
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
              <span className="text-sm font-medium flex-1">Nutrition Course</span>
            </Link>
          )}

          {profile?.has_consultation && (
            <Link
              href="/dashboard/consultation"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                pathname === "/dashboard/consultation"
                  ? "bg-teal-500 text-white"
                  : "text-teal-100 hover:bg-teal-600"
              }`}
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
              </svg>
              <span className="text-sm font-medium flex-1">My Consultation</span>
            </Link>
          )}
        </div>
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
        <div className="pt-1 border-t border-teal-600/50">
          <Link
            href="/dashboard/refund"
            onClick={() => setSidebarOpen(false)}
            className="w-full flex items-center gap-2 text-xs text-red-400 hover:text-red-300 transition-colors py-1"
          >
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            Request Refund
          </Link>
        </div>
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
          <Image src="/logo.PNG" alt="Elevate Health" width={140} height={70} unoptimized style={{height: '70px', width: 'auto'}} />
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
                Want faster results? Book a 1-on-1 Virtual Chiropractic Consultation with a licensed chiropractor.
              </p>
              <a
                href="https://buy.stripe.com/placeholder_coaching_link"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 bg-white text-teal-700 font-semibold text-sm px-5 py-2 rounded-lg hover:bg-teal-50 transition-colors"
              >
                Book My 1-on-1 Virtual Chiropractic Consultation — $197 →
              </a>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
