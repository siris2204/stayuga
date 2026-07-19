"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Home, CalendarX, CalendarCheck, ChevronRight } from "lucide-react";
import { OwnerGuard } from "@/components/owner/OwnerGuard";
import { useOwnerAuth } from "@/context/OwnerAuthContext";
import { apiFetch } from "@/lib/api";
import { Property, Booking } from "@/lib/types";
import { formatPrice } from "@/lib/format";

function DashboardContent() {
  const { token, owner } = useOwnerAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    Promise.all([
      apiFetch<{ properties: Property[] }>("/api/owner/properties", { token }),
      apiFetch<{ bookings: Booking[] }>("/api/owner/bookings", { token }),
    ]).then(([p, b]) => {
      setProperties(p.properties);
      setBookings(b.bookings);
      setLoading(false);
    });
  }, [token]);

  const pending = bookings.filter((b) => b.status === "pending").length;
  const confirmed = bookings.filter((b) => b.status === "confirmed").length;

  return (
    <div>
      <h1 className="font-display text-2xl text-ink">Welcome, {owner?.name}</h1>
      <p className="mt-1 text-sm text-ink-soft">Manage your property availability and view bookings.</p>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {[
          { icon: Home, label: "My properties", value: properties.length, color: "bg-forest/10 text-forest" },
          { icon: CalendarX, label: "Pending bookings", value: pending, color: "bg-amber-50 text-amber-700" },
          { icon: CalendarCheck, label: "Confirmed bookings", value: confirmed, color: "bg-rose-50 text-rose-700" },
        ].map((s) => (
          <div key={s.label} className="flex items-center gap-4 rounded-2xl border border-line/70 bg-white p-5">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${s.color}`}>
              <s.icon size={18} />
            </div>
            <div>
              <p className="text-2xl font-semibold text-ink">{loading ? "—" : s.value}</p>
              <p className="text-xs text-ink-soft">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Properties */}
      <div className="mt-10">
        <h2 className="font-display text-lg text-ink">My properties</h2>
        {loading ? (
          <p className="mt-4 text-sm text-ink-soft">Loading…</p>
        ) : properties.length === 0 ? (
          <p className="mt-4 text-sm text-ink-soft">No properties assigned yet. Contact your Stayuga account manager.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {properties.map((p) => (
              <div key={p._id} className="flex items-center justify-between rounded-2xl border border-line/70 bg-white px-5 py-4">
                <div>
                  <p className="font-medium text-ink">{p.title}</p>
                  <p className="text-xs text-ink-soft">{p.location.city} · {formatPrice(p.pricing.basePrice, p.pricing.currency)}/night</p>
                </div>
                <Link
                  href={`/owner/properties/${p._id}/calendar`}
                  className="flex items-center gap-1.5 rounded-full bg-forest px-4 py-2 text-xs font-medium text-cream hover:bg-forest-light transition-colors"
                >
                  Manage calendar <ChevronRight size={13} />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent bookings */}
      <div className="mt-10">
        <h2 className="font-display text-lg text-ink">Recent bookings</h2>
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
              {!loading && bookings.slice(0, 10).map((b) => (
                <tr key={b._id}>
                  <td className="px-5 py-3 font-medium text-ink">{b.name}</td>
                  <td className="px-5 py-3 text-ink-soft">
                    {b.property && typeof b.property === "object" ? b.property.title : "—"}
                  </td>
                  <td className="px-5 py-3 text-ink-soft text-xs">
                    {new Date(b.checkIn).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    {" – "}
                    {new Date(b.checkOut).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                      b.status === "confirmed" ? "bg-rose-100 text-rose-700"
                      : b.status === "declined" ? "bg-red-100 text-red-700"
                      : "bg-amber-100 text-amber-700"
                    }`}>{b.status}</span>
                  </td>
                </tr>
              ))}
              {!loading && bookings.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-6 text-center text-ink-soft">No bookings yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function OwnerDashboardPage() {
  return (
    <OwnerGuard>
      <DashboardContent />
    </OwnerGuard>
  );
}
