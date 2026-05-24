import Link from "next/link";

const bonuses = [
  {
    title: "Pain Tracking Journal",
    description:
      "Log your daily neck, mid back, and lower back pain scores. Visualize your progress over time with a chart, add daily notes, and print your full history as a PDF.",
    value: "$47",
    href: "/dashboard/pain-journal",
    internal: true,
    icon: (
      <svg className="w-8 h-8 text-teal-500" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
    cta: "Open Pain Journal →",
  },
  {
    title: "Posture Correction Quick Reference Guide",
    description:
      "An interactive daily checklist covering ideal sitting, standing, and sleeping posture — plus the top 5 corrections for desk workers. Check items off as you practice them.",
    value: "$37",
    href: "/dashboard/posture-guide",
    internal: true,
    icon: (
      <svg className="w-8 h-8 text-teal-500" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
    cta: "Open Posture Guide →",
  },
];

export default function BonusesPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Your Free Bonuses</h1>
        <p className="text-gray-500">
          Interactive tools included with your program — use them daily to accelerate your results.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {bonuses.map((bonus) => (
          <div
            key={bonus.title}
            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-teal-50 flex items-center justify-center">
                {bonus.icon}
              </div>
              <span className="text-sm font-semibold text-teal-600 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full whitespace-nowrap">
                {bonus.value} value — FREE
              </span>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">{bonus.title}</h2>
              <p className="text-sm text-gray-500 leading-relaxed">{bonus.description}</p>
            </div>

            <Link
              href={bonus.href}
              className="mt-auto inline-flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-700 text-white font-semibold text-sm px-5 py-3 rounded-xl transition-colors"
            >
              {bonus.cta}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
