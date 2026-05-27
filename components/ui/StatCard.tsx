"use client";

type StatTheme = "ember" | "ice" | "slate";

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  theme?: StatTheme;
  className?: string;
}

const themeClasses: Record<StatTheme, { value: string; bg: string }> = {
  ember: { value: "text-ember", bg: "bg-ember/8" },
  ice: { value: "text-ice", bg: "bg-ice/8" },
  slate: { value: "text-onyx", bg: "bg-slate/10" },
};

export function StatCard({ label, value, unit, theme = "slate", className = "" }: StatCardProps) {
  const { value: valueColor, bg } = themeClasses[theme];
  return (
    <div className={`rounded-2xl p-4 ${bg} flex flex-col gap-1 ${className}`}>
      <span className="text-xs font-body text-slate uppercase tracking-wider">{label}</span>
      <div className="flex items-end gap-1">
        <span className={`text-3xl font-heading font-bold leading-none ${valueColor}`}>
          {value}
        </span>
        {unit && <span className="text-sm font-body text-slate mb-0.5">{unit}</span>}
      </div>
    </div>
  );
}
