"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { OwnerGuard } from "@/components/owner/OwnerGuard";
import { useOwnerAuth } from "@/context/OwnerAuthContext";
import { apiFetch } from "@/lib/api";
import { Property } from "@/lib/types";
import { formatPrice } from "@/lib/format";

function PropertiesContent() {
  const { token } = useOwnerAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    apiFetch<{ properties: Property[] }>("/api/owner/properties", { token }).then((d) => {
      setProperties(d.properties);
      setLoading(false);
    });
  }, [token]);

  return (
    <div>
      <h1 className="font-display text-2xl text-ink">My Properties</h1>
      <p className="mt-1 text-sm text-ink-soft">Click "Manage calendar" to block dates or view bookings for each property.</p>

      {loading ? (
        <p className="mt-8 text-sm text-ink-soft">Loading…</p>
      ) : properties.length === 0 ? (
        <p className="mt-8 text-sm text-ink-soft">No properties assigned. Contact your Stayuga account manager.</p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {properties.map((p) => (
            <div key={p._id} className="rounded-2xl border border-line/70 bg-white overflow-hidden">
              {p.images[0] && (
                <img src={p.images[0]} alt={p.title} className="h-44 w-full object-cover" />
              )}
              <div className="p-5">
                <p className="font-display text-lg text-ink">{p.title}</p>
                <p className="mt-0.5 text-sm text-ink-soft">{p.location.city} · {formatPrice(p.pricing.basePrice, p.pricing.currency)}/night</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${p.status === "published" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"}`}>
                    {p.status}
                  </span>
                  <Link
                    href={`/owner/properties/${p._id}/calendar`}
                    className="flex items-center gap-1.5 rounded-full bg-forest px-4 py-2 text-xs font-medium text-cream hover:bg-forest-light transition-colors"
                  >
                    <CalendarDays size={13} /> Manage calendar
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function OwnerPropertiesPage() {
  return <OwnerGuard><PropertiesContent /></OwnerGuard>;
}
