export default function BonusesPage() {
  const bonuses = [
    {
      title: "Pain Tracking Journal",
      description:
        "A 30-day printable PDF tracker to log your morning and evening pain scores, exercises completed, and daily notes — so you can see your progress and stay on track.",
      value: "$47",
      href: "/bonuses/pain-tracking-journal",
      icon: (
        <svg className="w-8 h-8 text-teal-500" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
      ),
    },
    {
      title: "Posture Correction Quick Reference Guide",
      description:
        "A printable one-page guide covering ideal sitting, standing, and sleeping posture — plus the top 5 posture corrections for desk workers and a daily posture checklist.",
      value: "$37",
      href: "/bonuses/posture-guide",
      icon: (
        <svg className="w-8 h-8 text-teal-500" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Your Free Bonuses</h1>
        <p className="text-gray-500">
          Included with your program — print or save as PDF directly from your browser.
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
                ${bonus.value} value — FREE
              </span>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">{bonus.title}</h2>
              <p className="text-sm text-gray-500 leading-relaxed">{bonus.description}</p>
            </div>

            <a
              href={bonus.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto inline-flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-700 text-white font-semibold text-sm px-5 py-3 rounded-xl transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Download / Print Now
            </a>
          </div>
        ))}
      </div>

      <p className="mt-8 text-xs text-gray-400 text-center">
        Open the link, then use your browser&rsquo;s <strong>Print</strong> function (Ctrl+P / Cmd+P) and select <strong>Save as PDF</strong>.
      </p>
    </div>
  );
}
