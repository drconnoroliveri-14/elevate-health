interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
}

export default function ProgressBar({
  current,
  total,
  className = "",
}: ProgressBarProps) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className={["flex items-center gap-4", className].join(" ")}>
      <span className="text-sm text-gray-500 whitespace-nowrap">
        {current} of {total} modules complete
      </span>
      <div
        className="flex-1 bg-gray-200 rounded-full h-2"
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={total}
      >
        <div
          className="bg-teal-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-sm font-semibold text-teal-600 whitespace-nowrap">
        {pct}%
      </span>
    </div>
  );
}
