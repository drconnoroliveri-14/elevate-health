"use client";

type RingColor = "ember" | "ice";
type RingSize = "sm" | "md" | "lg";

interface ProgressRingProps {
  progress: number;
  color?: RingColor;
  size?: RingSize;
  label?: string;
  className?: string;
}

const sizeMap: Record<RingSize, { px: number; stroke: number; r: number }> = {
  sm: { px: 48, stroke: 4, r: 18 },
  md: { px: 80, stroke: 6, r: 30 },
  lg: { px: 120, stroke: 8, r: 44 },
};

const colorMap: Record<RingColor, { track: string; fill: string }> = {
  ember: { track: "#FF5740" + "22", fill: "#FF5740" },
  ice: { track: "#6AB9DF" + "22", fill: "#6AB9DF" },
};

export function ProgressRing({
  progress,
  color = "ember",
  size = "md",
  label,
  className = "",
}: ProgressRingProps) {
  const { px, stroke, r } = sizeMap[size];
  const { track, fill } = colorMap[color];
  const center = px / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (Math.min(100, Math.max(0, progress)) / 100) * circumference;

  const labelSize = size === "lg" ? "text-xl" : size === "md" ? "text-sm" : "text-xs";

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={px} height={px} className="-rotate-90">
        <circle cx={center} cy={center} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle
          cx={center}
          cy={center}
          r={r}
          fill="none"
          stroke={fill}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
        />
      </svg>
      {label && (
        <span
          className={`absolute font-heading font-bold ${labelSize}`}
          style={{ color: fill }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
