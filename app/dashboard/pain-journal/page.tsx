"use client";

import { useState, useEffect, useCallback } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface JournalEntry {
  id: string;
  entry_date: string;
  morning_neck: number | null;
  morning_mid_back: number | null;
  morning_lower_back: number | null;
  evening_neck: number | null;
  evening_mid_back: number | null;
  evening_lower_back: number | null;
  exercises_completed: boolean | null;
  notes: string | null;
}

function today() {
  return new Date().toISOString().split("T")[0];
}

function formatDate(d: string) {
  const [y, m, day] = d.split("-");
  return `${m}/${day}/${y.slice(2)}`;
}

function PainSlider({
  label,
  value,
  onChange,
  color,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  color: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span
          className="text-sm font-bold px-2 py-0.5 rounded-full text-white"
          style={{ backgroundColor: color }}
        >
          {value}/10
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={10}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-teal-500 h-2 rounded-full"
      />
      <div className="flex justify-between text-xs text-gray-400 mt-0.5">
        <span>0 — No pain</span>
        <span>10 — Worst</span>
      </div>
    </div>
  );
}

function PainBadge({ value }: { value: number | null }) {
  if (value === null || value === undefined) return <span className="text-gray-300">—</span>;
  const color =
    value <= 2 ? "bg-green-100 text-green-700" :
    value <= 5 ? "bg-yellow-100 text-yellow-700" :
    "bg-red-100 text-red-700";
  return (
    <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full ${color}`}>
      {value}
    </span>
  );
}

export default function PainJournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const [date, setDate] = useState(today());

  // Morning sliders
  const [morningNeck, setMorningNeck] = useState(0);
  const [morningMidBack, setMorningMidBack] = useState(0);
  const [morningLowerBack, setMorningLowerBack] = useState(0);

  // Evening sliders
  const [eveningNeck, setEveningNeck] = useState(0);
  const [eveningMidBack, setEveningMidBack] = useState(0);
  const [eveningLowerBack, setEveningLowerBack] = useState(0);

  const [exercisesCompleted, setExercisesCompleted] = useState(false);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/journal");
      if (res.ok) setEntries(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  // Pre-fill form when switching to a date that already has an entry
  useEffect(() => {
    const existing = entries.find((e) => e.entry_date === date);
    if (existing) {
      setMorningNeck(existing.morning_neck ?? 0);
      setMorningMidBack(existing.morning_mid_back ?? 0);
      setMorningLowerBack(existing.morning_lower_back ?? 0);
      setEveningNeck(existing.evening_neck ?? 0);
      setEveningMidBack(existing.evening_mid_back ?? 0);
      setEveningLowerBack(existing.evening_lower_back ?? 0);
      setExercisesCompleted(existing.exercises_completed ?? false);
      setNotes(existing.notes ?? "");
    } else {
      setMorningNeck(0);
      setMorningMidBack(0);
      setMorningLowerBack(0);
      setEveningNeck(0);
      setEveningMidBack(0);
      setEveningLowerBack(0);
      setExercisesCompleted(false);
      setNotes("");
    }
  }, [date, entries]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveMsg("");
    try {
      const res = await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entry_date: date,
          morning_neck: morningNeck,
          morning_mid_back: morningMidBack,
          morning_lower_back: morningLowerBack,
          evening_neck: eveningNeck,
          evening_mid_back: eveningMidBack,
          evening_lower_back: eveningLowerBack,
          exercises_completed: exercisesCompleted,
          notes: notes.trim() || null,
        }),
      });
      if (!res.ok) {
        let apiError = `Server error (${res.status})`;
        try {
          const body = await res.json();
          apiError = body.error ?? apiError;
          if (body.details) apiError += ` — ${body.details}`;
          if (body.hint) apiError += ` (hint: ${body.hint})`;
        } catch { /* not JSON */ }
        console.error("[pain-journal] save error:", apiError);
        throw new Error(apiError);
      }
      setSaveMsg("Entry saved!");
      await fetchEntries();
    } catch (err) {
      setSaveMsg(err instanceof Error ? err.message : "Could not save. Please try again.");
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(""), 4000);
    }
  }

  async function handleDelete(id: string) {
    setDeleteId(id);
    try {
      await fetch(`/api/journal/${id}`, { method: "DELETE" });
      await fetchEntries();
    } finally {
      setDeleteId(null);
    }
  }

  // Chart: show morning and evening per pain area (last 30 entries, ascending)
  const chartData = [...entries]
    .slice(0, 30)
    .reverse()
    .map((e) => ({
      date: formatDate(e.entry_date),
      "AM Neck": e.morning_neck,
      "AM Mid Back": e.morning_mid_back,
      "AM Lower Back": e.morning_lower_back,
      "PM Neck": e.evening_neck,
      "PM Mid Back": e.evening_mid_back,
      "PM Lower Back": e.evening_lower_back,
    }));

  return (
    <div>
      <style>{`@media print { aside, nav, button, .no-print { display: none !important; } }`}</style>

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Pain Tracking Journal</h1>
        <p className="text-gray-500 text-sm">
          Log your morning and evening pain levels to track progress over time. Scores are 0 (no pain) to 10 (worst pain).
        </p>
      </div>

      {/* Entry form */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Log an Entry</h2>
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={date}
              max={today()}
              onChange={(e) => setDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 w-full sm:w-auto"
            />
          </div>

          {/* Morning */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <span className="text-base">🌅</span> Morning Pain Levels
            </h3>
            <div className="space-y-4">
              <PainSlider label="Neck" value={morningNeck} onChange={setMorningNeck} color="#0d9488" />
              <PainSlider label="Mid Back" value={morningMidBack} onChange={setMorningMidBack} color="#0891b2" />
              <PainSlider label="Lower Back" value={morningLowerBack} onChange={setMorningLowerBack} color="#7c3aed" />
            </div>
          </div>

          {/* Evening */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <span className="text-base">🌙</span> Evening Pain Levels
            </h3>
            <div className="space-y-4">
              <PainSlider label="Neck" value={eveningNeck} onChange={setEveningNeck} color="#0d9488" />
              <PainSlider label="Mid Back" value={eveningMidBack} onChange={setEveningMidBack} color="#0891b2" />
              <PainSlider label="Lower Back" value={eveningLowerBack} onChange={setEveningLowerBack} color="#7c3aed" />
            </div>
          </div>

          {/* Exercises */}
          <div className="flex items-center gap-3">
            <input
              id="exercises"
              type="checkbox"
              checked={exercisesCompleted}
              onChange={(e) => setExercisesCompleted(e.target.checked)}
              className="w-4 h-4 accent-teal-500 rounded"
            />
            <label htmlFor="exercises" className="text-sm font-medium text-gray-700 cursor-pointer">
              Exercises completed today
            </label>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="How did you feel today? Any exercises that helped?"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={saving}
              className="bg-teal-500 hover:bg-teal-700 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm"
            >
              {saving ? "Saving…" : "Save Entry"}
            </button>
            {saveMsg && (
              <span className={`text-sm font-medium ${saveMsg === "Entry saved!" ? "text-teal-600" : "text-red-600"}`}>
                {saveMsg}
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Chart */}
      {chartData.length >= 2 && (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Your Progress</h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData} margin={{ top: 4, right: 16, left: -10, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0fdf4" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="AM Neck" stroke="#0d9488" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="AM Mid Back" stroke="#0891b2" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="AM Lower Back" stroke="#7c3aed" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="PM Neck" stroke="#0d9488" strokeWidth={1.5} strokeDasharray="4 2" dot={false} />
              <Line type="monotone" dataKey="PM Mid Back" stroke="#0891b2" strokeWidth={1.5} strokeDasharray="4 2" dot={false} />
              <Line type="monotone" dataKey="PM Lower Back" stroke="#7c3aed" strokeWidth={1.5} strokeDasharray="4 2" dot={false} />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-400 mt-2 text-center">
            Last {Math.min(chartData.length, 30)} entries · Solid = morning · Dashed = evening · Lower is better
          </p>
        </div>
      )}

      {/* Entry history */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Entry History</h2>
          <button onClick={() => window.print()} className="no-print text-xs text-teal-600 hover:underline">
            Print / Save PDF
          </button>
        </div>

        {loading ? (
          <p className="text-sm text-gray-400">Loading…</p>
        ) : entries.length === 0 ? (
          <p className="text-sm text-gray-400">No entries yet. Log your first entry above.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                  <th className="pb-3 pr-3">Date</th>
                  <th className="pb-3 pr-2 text-center" colSpan={3}>🌅 Morning</th>
                  <th className="pb-3 pr-2 text-center" colSpan={3}>🌙 Evening</th>
                  <th className="pb-3 pr-3 text-center">Ex.</th>
                  <th className="pb-3 flex-1">Notes</th>
                  <th className="pb-3 no-print" />
                </tr>
                <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
                  <th className="pb-2 pr-3" />
                  <th className="pb-2 pr-2">Neck</th>
                  <th className="pb-2 pr-2">Mid</th>
                  <th className="pb-2 pr-3">Low</th>
                  <th className="pb-2 pr-2">Neck</th>
                  <th className="pb-2 pr-2">Mid</th>
                  <th className="pb-2 pr-3">Low</th>
                  <th className="pb-2 pr-3" />
                  <th className="pb-2" />
                  <th className="pb-2 no-print" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {entries.map((e) => (
                  <tr key={e.id} className="hover:bg-gray-50">
                    <td className="py-3 pr-3 font-medium text-gray-800 whitespace-nowrap">{formatDate(e.entry_date)}</td>
                    <td className="py-3 pr-2"><PainBadge value={e.morning_neck} /></td>
                    <td className="py-3 pr-2"><PainBadge value={e.morning_mid_back} /></td>
                    <td className="py-3 pr-3"><PainBadge value={e.morning_lower_back} /></td>
                    <td className="py-3 pr-2"><PainBadge value={e.evening_neck} /></td>
                    <td className="py-3 pr-2"><PainBadge value={e.evening_mid_back} /></td>
                    <td className="py-3 pr-3"><PainBadge value={e.evening_lower_back} /></td>
                    <td className="py-3 pr-3 text-center text-xs">{e.exercises_completed ? "✓" : "—"}</td>
                    <td className="py-3 text-gray-500 max-w-[180px] truncate">{e.notes ?? "—"}</td>
                    <td className="py-3 no-print">
                      <button
                        onClick={() => handleDelete(e.id)}
                        disabled={deleteId === e.id}
                        className="text-xs text-red-400 hover:text-red-600 disabled:opacity-40 transition-colors"
                        title="Delete entry"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
