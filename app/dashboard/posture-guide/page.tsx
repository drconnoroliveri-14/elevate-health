"use client";

import { useState, useEffect, useCallback } from "react";

const today = () => new Date().toISOString().split("T")[0];

interface CheckItem {
  key: string;
  label: string;
  sub: string;
}

const POSTURE_SECTIONS: { title: string; items: CheckItem[] }[] = [
  {
    title: "Sitting Posture",
    items: [
      { key: "sit1", label: "Hips at 90°", sub: "Feet flat on floor, knees level with hips" },
      { key: "sit2", label: "Lumbar support", sub: "Lower back resting against chair back or cushion" },
      { key: "sit3", label: "Screen at eye level", sub: "Top of monitor at or slightly below eye height" },
      { key: "sit4", label: "Elbows at 90°", sub: "Arms relaxed, wrists straight on keyboard" },
      { key: "sit5", label: "No forward head", sub: "Ears aligned over shoulders, chin gently tucked" },
    ],
  },
  {
    title: "Standing Posture",
    items: [
      { key: "stand1", label: "Weight evenly distributed", sub: "Equal weight on both feet, slight knee bend" },
      { key: "stand2", label: "Neutral pelvis", sub: "No excessive anterior or posterior tilt" },
      { key: "stand3", label: "Shoulders back and down", sub: "Not rounded forward or elevated toward ears" },
      { key: "stand4", label: "Head balanced", sub: "Ears over shoulders, gentle chin tuck" },
    ],
  },
  {
    title: "Sleeping Posture",
    items: [
      { key: "sleep1", label: "Pillow supports neck curve", sub: "Head in neutral position, not flexed or extended" },
      { key: "sleep2", label: "Side or back position", sub: "Avoid stomach sleeping (strains neck & lumbar)" },
      { key: "sleep3", label: "Pillow between knees (side)", sub: "Keeps hips and spine aligned when side sleeping" },
      { key: "sleep4", label: "Mattress adequate support", sub: "Neither too soft nor too firm" },
    ],
  },
  {
    title: "Top 5 Desk-Worker Corrections",
    items: [
      { key: "desk1", label: "Chin tuck exercise", sub: "10 reps every hour — pull chin straight back" },
      { key: "desk2", label: "Shoulder blade squeeze", sub: "10 reps every hour — hold 5 seconds each" },
      { key: "desk3", label: "Hip flexor stretch", sub: "30 seconds each side — lunge position" },
      { key: "desk4", label: "Thoracic extension over chair", sub: "Lean back over chair edge, arms behind head" },
      { key: "desk5", label: "Walk/stand every 45 min", sub: "Set a timer — movement is medicine" },
    ],
  },
];

const ALL_ITEMS: CheckItem[] = POSTURE_SECTIONS.flatMap((s) => s.items);

function prefixKey(key: string) {
  return `posture-${today()}-${key}`;
}

export default function PostureGuidePage() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const dateKey = `posture-checklist-${today()}`;
    const stored = localStorage.getItem(dateKey);
    if (stored) {
      try { setChecked(JSON.parse(stored)); } catch { /* ignore */ }
    }
    // loaded from localStorage
  }, []);

  const toggle = useCallback(async (key: string) => {
    const newVal = !checked[key];
    const newChecked = { ...checked, [key]: newVal };
    setChecked(newChecked);

    // Persist to localStorage
    localStorage.setItem(`posture-checklist-${today()}`, JSON.stringify(newChecked));

    // Persist to DB (best effort — uses shopping_list_progress table via userId)
    if (userId) {
      fetch("/api/shopping-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, item_key: prefixKey(key), checked: newVal }),
      }).catch(() => {});
    }
  }, [checked, userId]);

  const totalItems = ALL_ITEMS.length;
  const completedItems = Object.values(checked).filter(Boolean).length;
  const progressPercent = Math.round((completedItems / totalItems) * 100);

  // Suppress unused warning — userId set path kept for future DB sync
  void userId; void setUserId;

  return (
    <div>
      <style>{`@media print { aside, nav, .no-print { display: none !important; } }`}</style>

      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Posture Correction Guide
          </h1>
          <p className="text-gray-500 text-sm">
            Check off each item as you practice it today. Your checklist resets each day.
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="no-print flex-shrink-0 flex items-center gap-1.5 text-xs text-teal-600 hover:text-teal-800 border border-teal-300 rounded-lg px-3 py-2 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.056 48.056 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
          </svg>
          Print / Save PDF
        </button>
      </div>

      {/* Progress bar */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">Today&apos;s Progress</span>
          <span className="text-sm font-bold text-teal-600">{completedItems}/{totalItems} items</span>
        </div>
        <div className="bg-gray-100 rounded-full h-3">
          <div
            className="bg-teal-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        {completedItems === totalItems && (
          <p className="text-sm font-semibold text-teal-600 mt-2 text-center">
            All done for today — great work!
          </p>
        )}
      </div>

      {/* Checklist sections */}
      <div className="space-y-6">
        {POSTURE_SECTIONS.map((section) => (
          <div key={section.title} className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
            <h2 className="text-base font-bold text-gray-900 mb-4">{section.title}</h2>
            <ul className="space-y-3">
              {section.items.map((item) => {
                const isChecked = !!checked[item.key];
                return (
                  <li key={item.key}>
                    <button
                      onClick={() => toggle(item.key)}
                      className={`w-full flex items-start gap-3 text-left p-3 rounded-xl border-2 transition-all ${
                        isChecked
                          ? "border-teal-500 bg-teal-50"
                          : "border-gray-100 bg-gray-50 hover:border-gray-200"
                      }`}
                    >
                      <span
                        className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          isChecked ? "border-teal-500 bg-teal-500" : "border-gray-300 bg-white"
                        }`}
                      >
                        {isChecked && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        )}
                      </span>
                      <div>
                        <p className={`text-sm font-semibold leading-snug ${isChecked ? "text-teal-700 line-through" : "text-gray-900"}`}>
                          {item.label}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{item.sub}</p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Key principles */}
      <div className="mt-6 bg-teal-50 border border-teal-200 rounded-2xl p-5">
        <h2 className="text-base font-bold text-teal-800 mb-3">Key Principles to Remember</h2>
        <ul className="space-y-2 text-sm text-teal-700">
          {[
            "Pain is a signal — adjust your position before it becomes chronic.",
            "Move every 30–45 minutes. Static posture (even perfect) causes fatigue.",
            "Strengthen > stretch. Long-term posture correction requires muscle endurance.",
            "Awareness is the first step. Use these checkpoints to build new habits.",
          ].map((tip) => (
            <li key={tip} className="flex items-start gap-2">
              <svg className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
