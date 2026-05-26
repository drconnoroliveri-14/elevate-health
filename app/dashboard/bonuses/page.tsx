import Link from "next/link";

const bonuses = [
  {
    title: "Pain Tracking Journal",
    description:
      "Log your daily neck, mid back, and lower back pain scores. Visualize your progress over time with a chart, add daily notes, and print your full history as a PDF.",
    value: "$47 value",
    href: "/dashboard/pain-journal",
    icon: (
      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
    cta: "Open Pain Journal →",
    bullets: [
      "Daily pain score tracking (neck, mid back, lower back)",
      "Visual progress chart over time",
      "Daily notes and journal entries",
      "Printable full history PDF",
    ],
  },
  {
    title: "Posture Correction Quick Reference Guide",
    description:
      "An interactive daily checklist covering ideal sitting, standing, and sleeping posture — plus the top 5 corrections for desk workers. Check items off as you practice them.",
    value: "$37 value",
    href: "/dashboard/posture-guide",
    icon: (
      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
    cta: "Open Posture Guide →",
    bullets: [
      "Ideal sitting and standing posture checklist",
      "Sleep position guide for pain relief",
      "Top 5 corrections for desk workers",
      "Interactive daily check-off system",
    ],
  },
  {
    title: "90-Day Posture Photo Tracker",
    description:
      "Upload your posture photos every 30 days and track your transformation with built-in posture analysis tools and milestone comparisons.",
    value: "Included Free",
    href: "/dashboard/posture-tracker",
    icon: <span className="text-5xl leading-none">📸</span>,
    cta: "Open Posture Tracker →",
    bullets: [
      "90-day milestone photo tracking",
      "Built-in posture line analysis tools",
      "Before and after comparison view",
      "Daily accountability system",
    ],
  },
];

export default function BonusesPage() {
  return (
    <div className="pb-12">
      {/* Page header */}
      <div className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Your Bonus Resources</h1>
        <p className="text-gray-500 text-base leading-relaxed">
          These tools are included with your program to help you get the best possible results.
        </p>
      </div>

      {/* Cards grid — 2 columns on desktop, third card centered below */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {bonuses.map((bonus, i) => (
          <div
            key={bonus.title}
            className={`bg-white border border-gray-200 rounded-2xl shadow-md flex flex-col overflow-hidden${
              i === 2 ? " sm:col-span-2 sm:max-w-lg sm:mx-auto sm:w-full" : ""
            }`}
          >
            {/* Teal gradient header banner */}
            <div
              className="flex flex-col items-center justify-center gap-3 px-8 py-8"
              style={{ background: "linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)" }}
            >
              {bonus.icon}
              <span className="bg-white/20 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
                {bonus.value}
              </span>
            </div>

            {/* Card body */}
            <div className="flex flex-col flex-1 p-8 gap-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">{bonus.title}</h2>
                <p className="text-sm text-gray-500 leading-relaxed">{bonus.description}</p>
              </div>

              {bonus.bullets && (
                <ul className="space-y-3">
                  {bonus.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-sm text-gray-700">
                      <svg className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      {b}
                    </li>
                  ))}
                </ul>
              )}

              <Link
                href={bonus.href}
                className="mt-auto w-full inline-flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-700 text-white font-semibold text-sm px-5 py-3.5 rounded-xl transition-colors"
              >
                {bonus.cta}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
