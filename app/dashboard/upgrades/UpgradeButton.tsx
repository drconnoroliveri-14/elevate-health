"use client";

import { useState } from "react";

interface Props {
  upgrade: "nutrition" | "consultation";
  price: number;
}

export default function UpgradeButton({ upgrade, price }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleClick() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/upgrades/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ upgrade }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      window.location.href = data.url;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={loading}
        style={{ background: "#F5C842" }}
        className="w-full flex items-center justify-center gap-2 text-gray-900 font-bold text-base py-4 rounded-xl transition-opacity disabled:opacity-60 hover:opacity-90"
      >
        {loading ? (
          <>
            <div className="animate-spin h-4 w-4 border-2 border-gray-700 border-t-transparent rounded-full" />
            Redirecting to checkout…
          </>
        ) : (
          `Add to My Program — $${price} →`
        )}
      </button>
      {error && <p className="text-red-600 text-sm mt-2 text-center">{error}</p>}
    </div>
  );
}
