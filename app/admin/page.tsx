"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Card from "@/components/Card";
import LoadingSkeleton from "@/components/LoadingSkeleton";

// ── Types ─────────────────────────────────────────────────────────────────────

type RecentPurchase = {
  full_name: string | null;
  email: string;
  purchased_at: string;
};

type LeadRow = {
  email: string;
  full_name: string | null;
  created_at: string;
  purchased: boolean;
};

type StudentProgressRow = {
  full_name: string | null;
  email: string;
  modules_completed: number;
  last_active: string | null;
};

type AdminStats = {
  total_revenue: number;
  total_students: number;
  total_leads: number;
  avg_completion_rate: number;
  recent_purchases: RecentPurchase[];
  leads: LeadRow[];
  student_progress: StudentProgressRow[];
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatRelative(iso: string | null): string {
  if (!iso) return "—";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);
  if (days > 0) return `${days} day${days === 1 ? "" : "s"} ago`;
  if (hours > 0) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  if (mins > 0) return `${mins} minute${mins === 1 ? "" : "s"} ago`;
  return "just now";
}

// ── Skeleton loader ───────────────────────────────────────────────────────────

function AdminSkeleton() {
  return (
    <div className="space-y-8">
      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <LoadingSkeleton height="0.75rem" width="60%" className="mb-3" />
            <LoadingSkeleton height="2rem" width="80%" />
          </Card>
        ))}
      </div>
      {/* Table skeletons */}
      {[...Array(3)].map((_, i) => (
        <Card key={i}>
          <LoadingSkeleton height="1rem" width="40%" className="mb-6" />
          {[...Array(4)].map((_, j) => (
            <LoadingSkeleton key={j} height="0.875rem" className="mb-3" />
          ))}
        </Card>
      ))}
    </div>
  );
}

// ── Metric card ───────────────────────────────────────────────────────────────

function MetricCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <Card className="flex flex-col gap-1">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        {label}
      </p>
      <p
        className={`text-3xl font-bold ${accent ? "text-teal-500" : "text-gray-900"}`}
      >
        {value}
      </p>
    </Card>
  );
}

// ── Table wrapper (horizontal scroll on mobile) ───────────────────────────────

function TableWrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto -mx-1">
      <table className="min-w-full text-sm">{children}</table>
    </div>
  );
}

function TH({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
      {children}
    </th>
  );
}

function TD({
  children,
  muted,
}: {
  children: React.ReactNode;
  muted?: boolean;
}) {
  return (
    <td
      className={`px-4 py-3 whitespace-nowrap ${muted ? "text-gray-400" : "text-gray-800"}`}
    >
      {children}
    </td>
  );
}

function EmptyRow({ cols, message }: { cols: number; message: string }) {
  return (
    <tr>
      <td
        colSpan={cols}
        className="px-4 py-8 text-center text-gray-400 text-sm"
      >
        {message}
      </td>
    </tr>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/stats")
      .then(async (res) => {
        if (res.status === 401 || res.status === 403) {
          router.push("/login");
          return;
        }
        if (!res.ok) throw new Error("Failed to load stats.");
        const data: AdminStats = await res.json();
        setStats(data);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Unknown error.");
      });
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-teal-700 text-white px-4 sm:px-8 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <Link href="/" className="text-lg font-bold tracking-tight">
              Elevate Health
            </Link>
            <p className="text-teal-200 text-xs mt-0.5">Admin Dashboard</p>
          </div>
          <Link
            href="/dashboard"
            className="text-sm text-teal-200 hover:text-white transition-colors"
          >
            ← Student Portal
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">
          Admin Dashboard
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-700 text-sm">
            {error}
          </div>
        )}

        {!stats && !error && <AdminSkeleton />}

        {stats && (
          <div className="space-y-8">
            {/* ── Metric cards ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                label="Total Revenue"
                value={formatCurrency(stats.total_revenue)}
                accent
              />
              <MetricCard
                label="Students Enrolled"
                value={stats.total_students.toLocaleString()}
              />
              <MetricCard
                label="Leads Captured"
                value={stats.total_leads.toLocaleString()}
              />
              <MetricCard
                label="Avg Completion Rate"
                value={`${stats.avg_completion_rate.toFixed(1)}%`}
              />
            </div>

            {/* ── Recent Purchases ── */}
            <Card className="p-0 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900">
                  Recent Purchases
                </h2>
              </div>
              <TableWrap>
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <TH>Name</TH>
                    <TH>Email</TH>
                    <TH>Date</TH>
                    <TH>Amount</TH>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {stats.recent_purchases.length === 0 ? (
                    <EmptyRow cols={4} message="No purchases yet" />
                  ) : (
                    stats.recent_purchases.map((p, i) => (
                      <tr key={i} className="hover:bg-gray-50 transition-colors">
                        <TD>{p.full_name || "—"}</TD>
                        <TD muted>{p.email}</TD>
                        <TD muted>{formatDate(p.purchased_at)}</TD>
                        <TD>
                          <span className="font-semibold text-teal-600">
                            $997
                          </span>
                        </TD>
                      </tr>
                    ))
                  )}
                </tbody>
              </TableWrap>
            </Card>

            {/* ── Email Leads ── */}
            <Card className="p-0 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900">Email Leads</h2>
              </div>
              <TableWrap>
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <TH>Name</TH>
                    <TH>Email</TH>
                    <TH>Date Captured</TH>
                    <TH>Purchased</TH>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {stats.leads.length === 0 ? (
                    <EmptyRow cols={4} message="No leads yet" />
                  ) : (
                    stats.leads.map((lead, i) => (
                      <tr key={i} className="hover:bg-gray-50 transition-colors">
                        <TD>{lead.full_name || "—"}</TD>
                        <TD muted>{lead.email}</TD>
                        <TD muted>{formatDate(lead.created_at)}</TD>
                        <TD>
                          {lead.purchased ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                              Yes
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">
                              No
                            </span>
                          )}
                        </TD>
                      </tr>
                    ))
                  )}
                </tbody>
              </TableWrap>
            </Card>

            {/* ── Student Progress ── */}
            <Card className="p-0 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900">
                  Student Progress
                </h2>
              </div>
              <TableWrap>
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <TH>Name</TH>
                    <TH>Modules Completed</TH>
                    <TH>Last Active</TH>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {stats.student_progress.length === 0 ? (
                    <EmptyRow cols={3} message="No students yet" />
                  ) : (
                    stats.student_progress.map((s, i) => (
                      <tr key={i} className="hover:bg-gray-50 transition-colors">
                        <TD>
                          <div>
                            <p className="font-medium text-gray-900">
                              {s.full_name || "—"}
                            </p>
                            <p className="text-xs text-gray-400">{s.email}</p>
                          </div>
                        </TD>
                        <TD>
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-gray-900">
                              {s.modules_completed} / 7
                            </span>
                            <div className="w-24 bg-gray-200 rounded-full h-1.5">
                              <div
                                className="bg-teal-500 h-1.5 rounded-full"
                                style={{
                                  width: `${Math.round((s.modules_completed / 7) * 100)}%`,
                                }}
                              />
                            </div>
                          </div>
                        </TD>
                        <TD muted>{formatRelative(s.last_active)}</TD>
                      </tr>
                    ))
                  )}
                </tbody>
              </TableWrap>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
