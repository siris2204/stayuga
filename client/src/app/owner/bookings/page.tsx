"use client";

import { useEffect, useState } from "react";
import { OwnerGuard } from "@/components/owner/OwnerGuard";
import { useOwnerAuth } from "@/context/OwnerAuthContext";
import { apiFetch } from "@/lib/api";
import { Booking } from "@/lib/types";
import { formatDate } from "@/lib/format";

function BookingsContent() {
  const { token } = useOwnerAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    apiFetch<{ bookings: Booking[] }>("/api/owner/bookings", { token }).then((d) => {
      setBookings(d.bookings);
      setLoading(false);
    });
  }, [token]);

  return (
    <div>
      <h1 className="font-display text-2xl text-ink">Bookings</h1>
      <p className="mt-1 text-sm text-ink-soft">All booking enquiries for your properties.</p>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-line/70 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line/70 text-xs uppercase tracking-wide text-ink-soft">
            <tr>
              <th className="px-5 py-3">Guest</th>
              <th className="px-5 py-3">Property</th>
              <th className="px-5 py-3">Dates</th>
              <th className="px-5 py-3">Guests</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/70">
            {!loading && bookings.map((b) => (
              <tr key={b._id}>
                <td className="px-5 py-3">
                  <p className="font-medium text-ink">{b.name}</p>
                  <p className="text-xs text-ink-soft">{b.email}</p>
                </td>
                <td className="px-5 py-3 text-ink-soft">
                  {b.property && typeof b.property === "object" ? b.property.title : "—"}
                </td>
                <td className="px-5 py-3 text-xs text-ink-soft">
                  {formatDate(b.checkIn)} – {formatDate(b.checkOut)}
                </td>
                <td className="px-5 py-3 text-ink-soft">{b.guests}</td>
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
                <td colSpan={5} className="px-5 py-6 text-center text-ink-soft">No bookings yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function OwnerBookingsPage() {
  return <OwnerGuard><BookingsContent /></OwnerGuard>;
}
