"use client";

import React from "react";

type CardVariant = "default" | "dark" | "ember" | "ice" | "sand";

interface CardProps {
  variant?: CardVariant;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const variantClasses: Record<CardVariant, string> = {
  default: "bg-cream border border-slate/30 text-onyx",
  dark: "bg-onyx border border-slate/20 text-cream",
  ember: "bg-ember border border-ember text-cream",
  ice: "bg-ice border border-ice text-onyx",
  sand: "bg-sand border border-sand text-onyx",
};

export function Card({ variant = "default", children, className = "", onClick }: CardProps) {
  return (
    <div
      className={`rounded-2xl p-4 ${variantClasses[variant]} ${className} ${onClick ? "cursor-pointer active:scale-[0.98] transition-transform" : ""}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
