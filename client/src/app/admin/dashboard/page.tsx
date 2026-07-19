"use client";

import { useEffect, useState } from "react";
import { Home, Clock, Users } from "lucide-react";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { StatCard } from "@/components/admin/StatCard";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { apiFetch } from "@/lib/api";
import { Booking } from "@/lib/types";
import { formatDate } from "@/lib/format";

interface Summary {
  totalProperties: number;
  pendingBookings: number;
  newLeads: number;
  recentBookings: Booking[];
}

function DashboardContent() {
  const { token } = useAdminAuth();
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    if (!token) return;
    apiFetch<Summary>("/api/dashboard/summary", { token }).then(setSummary);
  }, [token]);

  return (
    <div>
      <h1 className="font-display text-2xl text-ink">Dashboard</h1>
      <p className="mt-1 text-sm text-ink-soft">An overview of your properties, bookings, and leads.</p>

      {summary && (
        <>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <StatCard icon={Home} label="Total properties" value={summary.totalProperties} />
            <StatCard icon={Clock} label="Pending bookings" value={summary.pendingBookings} />
            <StatCard icon={Users} label="New leads" value={summary.newLeads} />
          </div>

          <div className="mt-10">
            <h2 className="font-display text-lg text-ink">Recent booking enquiries</h2>
            <div className="mt-4 overflow-x-auto rounded-2xl border border-line/70 bg-white">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-line/70 text-xs uppercase tracking-wide text-ink-soft">
                  <tr>
                    <th className="px-5 py-3">Guest</th>
                    <th className="px-5 py-3">Property</th>
                    <th className="px-5 py-3">Dates</th>
                    <th className="px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/70">
                  {summary.recentBookings.map((b) => (
                    <tr key={b._id}>
                      <td className="px-5 py-3">{b.name}</td>
                      <td className="px-5 py-3">
                        {b.property && typeof b.property === "object" ? b.property.title : b.property ?? "—"}
                      </td>
                      <td className="px-5 py-3">
                        {formatDate(b.checkIn)} – {formatDate(b.checkOut)}
                      </td>
                      <td className="px-5 py-3 capitalize">{b.status}</td>
                    </tr>
                  ))}
                  {summary.recentBookings.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-5 py-6 text-center text-ink-soft">
                        No bookings yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AdminGuard>
      <DashboardContent />
    </AdminGuard>
  );
}
