"use client";

import { useEffect, useState } from "react";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { apiFetch } from "@/lib/api";
import { Booking, BookingStatus } from "@/lib/types";
import { formatDate } from "@/lib/format";

const STATUS_STYLES: Record<BookingStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-emerald-100 text-emerald-800",
  declined: "bg-red-100 text-red-700",
};

function BookingsContent() {
  const { token } = useAdminAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    if (!token) return;
    setLoading(true);
    const { bookings } = await apiFetch<{ bookings: Booking[] }>("/api/bookings", { token });
    setBookings(bookings);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function updateStatus(id: string, status: BookingStatus) {
    if (!token) return;
    await apiFetch(`/api/bookings/${id}/status`, {
      method: "PATCH",
      token,
      body: JSON.stringify({ status }),
    });
    load();
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-ink">Bookings</h1>
      <p className="mt-1 text-sm text-ink-soft">Review and confirm booking enquiries.</p>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-line/70 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line/70 text-xs uppercase tracking-wide text-ink-soft">
            <tr>
              <th className="px-5 py-3">Guest</th>
              <th className="px-5 py-3">Contact</th>
              <th className="px-5 py-3">Property</th>
              <th className="px-5 py-3">Dates</th>
              <th className="px-5 py-3">Guests</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/70">
            {bookings.map((b) => (
              <tr key={b._id}>
                <td className="px-5 py-3">{b.name}</td>
                <td className="px-5 py-3 text-ink-soft">
                  <div>{b.email}</div>
                  <div>{b.phone}</div>
                </td>
                <td className="px-5 py-3">
                  {typeof b.property === "object" ? b.property.title : b.property}
                </td>
                <td className="px-5 py-3 text-ink-soft">
                  {formatDate(b.checkIn)} – {formatDate(b.checkOut)}
                </td>
                <td className="px-5 py-3">{b.guests}</td>
                <td className="px-5 py-3">
                  <select
                    value={b.status}
                    onChange={(e) => updateStatus(b._id, e.target.value as BookingStatus)}
                    className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${STATUS_STYLES[b.status]}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="declined">Declined</option>
                  </select>
                </td>
              </tr>
            ))}
            {!loading && bookings.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-6 text-center text-ink-soft">
                  No booking enquiries yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function BookingsPage() {
  return (
    <AdminGuard>
      <BookingsContent />
    </AdminGuard>
  );
}
