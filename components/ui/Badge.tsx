"use client";

type BadgeVariant = "ember" | "ice" | "slate" | "sand";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  ember: "bg-ember/15 text-ember",
  ice: "bg-ice/15 text-ice",
  slate: "bg-slate/20 text-slate",
  sand: "bg-sand/30 text-onyx",
};

export function Badge({ variant = "slate", children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium font-body ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
