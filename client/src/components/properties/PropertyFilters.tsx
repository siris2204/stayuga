"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import { CalendarDays, SlidersHorizontal, X } from "lucide-react";
import { DateRangePicker } from "./DateRangePicker";

interface Props {
  type?: string;
  city?: string;
  minGuests?: string;
  checkIn?: string;
  checkOut?: string;
}

export function PropertyFilters({ type, city, minGuests, checkIn, checkOut }: Props) {
  const router = useRouter();

  const [selType, setSelType] = useState(type ?? "");
  const [selCity, setSelCity] = useState(city ?? "");
  const [selGuests, setSelGuests] = useState(minGuests ?? "");
  const [selCheckIn, setSelCheckIn] = useState<Date | null>(
    checkIn ? parseISO(checkIn) : null
  );
  const [selCheckOut, setSelCheckOut] = useState<Date | null>(
    checkOut ? parseISO(checkOut) : null
  );

  const hasFilters = selType || selCity || selGuests || selCheckIn;

  function apply() {
    const params = new URLSearchParams();
    if (selType) params.set("type", selType);
    if (selCity) params.set("city", selCity);
    if (selGuests) params.set("minGuests", selGuests);
    if (selCheckIn) params.set("checkIn", format(selCheckIn, "yyyy-MM-dd"));
    if (selCheckOut) params.set("checkOut", format(selCheckOut, "yyyy-MM-dd"));
    router.push(`/properties?${params.toString()}`);
  }

  function clear() {
    setSelType("");
    setSelCity("");
    setSelGuests("");
    setSelCheckIn(null);
    setSelCheckOut(null);
    router.push("/properties");
  }

  return (
    <aside className="w-full rounded-2xl border border-line/70 bg-white p-5 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-ink">
          <SlidersHorizontal size={15} className="text-forest" />
          Filters
        </div>
        {hasFilters && (
          <button
            type="button"
            onClick={clear}
            className="flex items-center gap-1 text-xs text-ink-soft hover:text-forest transition-colors"
          >
            <X size={13} /> Clear all
          </button>
        )}
      </div>

      {/* ── Dates ── */}
      <div>
        <div className="flex items-center gap-1.5 mb-3">
          <CalendarDays size={13} className="text-forest" />
          <span className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
            Dates
          </span>
        </div>

        {/* Selected dates summary */}
        <div className="mb-3 grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-line bg-sand/40 px-3 py-2">
            <p className="text-[10px] font-medium text-ink-soft uppercase tracking-wide">Check-in</p>
            <p className="text-sm font-medium text-ink mt-0.5">
              {selCheckIn ? format(selCheckIn, "d MMM") : "—"}
            </p>
          </div>
          <div className="rounded-lg border border-line bg-sand/40 px-3 py-2">
            <p className="text-[10px] font-medium text-ink-soft uppercase tracking-wide">Check-out</p>
            <p className="text-sm font-medium text-ink mt-0.5">
              {selCheckOut ? format(selCheckOut, "d MMM") : "—"}
            </p>
          </div>
        </div>

        <DateRangePicker
          checkIn={selCheckIn}
          checkOut={selCheckOut}
          onChange={({ checkIn, checkOut }) => {
            setSelCheckIn(checkIn);
            setSelCheckOut(checkOut);
          }}
        />
      </div>

      <hr className="border-line/70" />

      {/* ── Property type ── */}
      <div>
        <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-ink-soft">
          Property type
        </p>
        <div className="space-y-2">
          {[
            { value: "", label: "All types" },
            { value: "villa", label: "Villa" },
            { value: "farmhouse", label: "Farmhouse" },
          ].map((opt) => (
            <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="radio"
                name="type"
                value={opt.value}
                checked={selType === opt.value}
                onChange={() => setSelType(opt.value)}
                className="accent-forest h-4 w-4"
              />
              <span className="text-sm text-ink">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      <hr className="border-line/70" />

      {/* ── Location ── */}
      <div>
        <label className="mb-2.5 block text-xs font-semibold uppercase tracking-wide text-ink-soft">
          City / Location
        </label>
        <input
          type="text"
          value={selCity}
          onChange={(e) => setSelCity(e.target.value)}
          placeholder="e.g. Kasauli"
          className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-soft/50 focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest transition-colors"
        />
      </div>

      <hr className="border-line/70" />

      {/* ── Guests ── */}
      <div>
        <label className="mb-2.5 block text-xs font-semibold uppercase tracking-wide text-ink-soft">
          Minimum guests
        </label>
        <input
          type="number"
          min={1}
          value={selGuests}
          onChange={(e) => setSelGuests(e.target.value)}
          placeholder="e.g. 10"
          className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-soft/50 focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest transition-colors"
        />
      </div>

      {/* ── Apply ── */}
      <button
        type="button"
        onClick={apply}
        className="w-full rounded-full bg-forest py-2.5 text-sm font-medium text-cream hover:bg-forest-light transition-colors"
      >
        Apply filters
      </button>
    </aside>
  );
}
