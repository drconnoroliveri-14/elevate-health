"use client";

import { useEffect, useState, useCallback } from "react";
import { SHOPPING_LIST, ALL_ITEM_KEYS, itemKey } from "./shoppingData";

interface Props {
  userId: string;
}

export default function ShoppingList({ userId }: Props) {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState<Set<string>>(new Set());
  const [loaded, setLoaded] = useState(false);

  // Load saved state on mount
  useEffect(() => {
    fetch(`/api/shopping-list?userId=${encodeURIComponent(userId)}`)
      .then((r) => r.json())
      .then((data: { item_key: string; checked: boolean }[]) => {
        const checkedKeys = new Set(
          data.filter((row) => row.checked).map((row) => row.item_key)
        );
        setChecked(checkedKeys);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, [userId]);

  const save = useCallback(
    async (key: string, value: boolean) => {
      setSaving((prev) => new Set(prev).add(key));
      try {
        await fetch("/api/shopping-list", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, item_key: key, checked: value }),
        });
      } finally {
        setSaving((prev) => {
          const next = new Set(prev);
          next.delete(key);
          return next;
        });
      }
    },
    [userId]
  );

  const toggle = useCallback(
    (key: string) => {
      setChecked((prev) => {
        const next = new Set(prev);
        const newVal = !next.has(key);
        if (newVal) { next.add(key); } else { next.delete(key); }
        save(key, newVal);
        return next;
      });
    },
    [save]
  );

  const checkAll = useCallback(() => {
    const allKeys = new Set(ALL_ITEM_KEYS);
    setChecked(allKeys);
    fetch("/api/shopping-list/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, keys: ALL_ITEM_KEYS, checked: true }),
    });
  }, [userId]);

  const clearAll = useCallback(() => {
    setChecked(new Set());
    fetch("/api/shopping-list/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, keys: ALL_ITEM_KEYS, checked: false }),
    });
  }, [userId]);

  const checkedCount = checked.size;
  const totalCount = ALL_ITEM_KEYS.length;
  const progressPct = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

  if (!loaded) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-400 text-sm">
        Loading your list…
      </div>
    );
  }

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-700">
            {checkedCount} of {totalCount} items in your cart
          </span>
          <span className="text-xs text-teal-600 font-bold">{progressPct}%</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={checkAll}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-teal-500 text-teal-700 hover:bg-teal-50 transition-colors"
          >
            Check All
          </button>
          <button
            onClick={clearAll}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div
          className="bg-teal-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Grid of categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.entries(SHOPPING_LIST).map(([category, items]) => (
          <div key={category} className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="font-bold text-sm text-teal-700 mb-3 uppercase tracking-wide">
              {category}
            </p>
            <ul className="space-y-2">
              {items.map((item) => {
                const key = itemKey(category, item);
                const isChecked = checked.has(key);
                const isSaving = saving.has(key);
                return (
                  <li key={key}>
                    <button
                      onClick={() => toggle(key)}
                      disabled={isSaving}
                      className={`w-full flex items-center gap-3 text-left rounded-lg px-2 py-1.5 transition-colors ${
                        isChecked ? "bg-teal-50" : "hover:bg-gray-50"
                      } ${isSaving ? "opacity-60" : ""}`}
                    >
                      {/* Checkbox */}
                      <span
                        className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          isChecked
                            ? "border-teal-500 bg-teal-500"
                            : "border-gray-400 bg-white"
                        }`}
                      >
                        {isChecked && (
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={3}
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M4.5 12.75l6 6 9-13.5"
                            />
                          </svg>
                        )}
                      </span>
                      {/* Label */}
                      <span
                        className={`text-sm transition-colors ${
                          isChecked
                            ? "line-through text-gray-400"
                            : "text-gray-700"
                        }`}
                      >
                        {item}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
