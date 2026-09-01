"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Calendar, Users, Home } from "lucide-react";

interface Props {
  type?: string;
  city?: string;
  minGuests?: string;
  checkIn?: string;
  checkOut?: string;
  sort?: string;
}

export function StayFilters({ type, city, minGuests, checkIn, checkOut, sort }: Props) {
  const router = useRouter();

  const [selType, setSelType] = useState(type ?? "");
  const [selCity, setSelCity] = useState(city ?? "");
  const [selGuests, setSelGuests] = useState(minGuests ?? "");
  const [selCheckIn, setSelCheckIn] = useState(checkIn ?? "");
  const [selCheckOut, setSelCheckOut] = useState(checkOut ?? "");
  const [selSort, setSelSort] = useState(sort ?? "recommended");

  function apply(overrides?: Partial<Record<"sort", string>>) {
    const params = new URLSearchParams();
    if (selType) params.set("type", selType);
    if (selCity) params.set("city", selCity);
    if (selGuests) params.set("minGuests", selGuests);
    if (selCheckIn) params.set("checkIn", selCheckIn);
    if (selCheckOut) params.set("checkOut", selCheckOut);
    const nextSort = overrides?.sort ?? selSort;
    if (nextSort && nextSort !== "recommended") params.set("sort", nextSort);
    router.push(`/properties?${params.toString()}`);
  }

  return (
    <div className="relative z-30 -mt-14 mx-auto max-w-7xl px-6">
      <div className="space-y-6 rounded-md border border-stone-200/80 bg-shell p-6 shadow-xl md:p-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="border-b border-stone-300 pb-3 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6">
            <span className="mb-1.5 block text-[10px] font-medium uppercase tracking-widest text-stone-500">
              Location
            </span>
            <div className="flex items-center gap-2 text-xs text-stone-800">
              <MapPin size={15} className="shrink-0 text-stone-500" />
              <input
                type="text"
                value={selCity}
                onChange={(e) => setSelCity(e.target.value)}
                placeholder="Any city"
                className="w-full bg-transparent text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="border-b border-stone-300 pb-3 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6">
            <span className="mb-1.5 block text-[10px] font-medium uppercase tracking-widest text-stone-500">
              Check In
            </span>
            <div className="flex items-center gap-2 text-xs text-stone-700">
              <Calendar size={15} className="shrink-0 text-stone-500" />
              <input
                type="date"
                value={selCheckIn}
                onChange={(e) => setSelCheckIn(e.target.value)}
                className="w-full bg-transparent text-xs text-stone-700 focus:outline-none"
              />
            </div>
          </div>

          <div className="border-b border-stone-300 pb-3 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6">
            <span className="mb-1.5 block text-[10px] font-medium uppercase tracking-widest text-stone-500">
              Check Out
            </span>
            <div className="flex items-center gap-2 text-xs text-stone-700">
              <Calendar size={15} className="shrink-0 text-stone-500" />
              <input
                type="date"
                value={selCheckOut}
                min={selCheckIn || undefined}
                onChange={(e) => setSelCheckOut(e.target.value)}
                className="w-full bg-transparent text-xs text-stone-700 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <span className="mb-1.5 block text-[10px] font-medium uppercase tracking-widest text-stone-500">
              Guests
            </span>
            <div className="flex items-center gap-2 text-xs text-stone-800">
              <Users size={15} className="shrink-0 text-stone-500" />
              <input
                type="number"
                min={1}
                value={selGuests}
                onChange={(e) => setSelGuests(e.target.value)}
                placeholder="Any number"
                className="w-full bg-transparent text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="h-px bg-stone-200" />

        <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-12">
          <div className="md:col-span-5">
            <span className="mb-1.5 block text-[10px] font-medium uppercase tracking-widest text-stone-500">
              Property Type
            </span>
            <div className="flex items-center gap-4">
              {[
                { value: "", label: "Any" },
                { value: "villa", label: "Villa" },
                { value: "farmhouse", label: "Farmhouse" },
              ].map((opt) => (
                <label key={opt.value} className="flex items-center gap-1.5 text-xs text-stone-700">
                  <input
                    type="radio"
                    name="stay-type"
                    checked={selType === opt.value}
                    onChange={() => setSelType(opt.value)}
                    className="accent-gold"
                  />
                  <Home size={13} className="text-stone-500" />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 md:col-span-7">
            <select
              value={selSort}
              onChange={(e) => {
                setSelSort(e.target.value);
                apply({ sort: e.target.value });
              }}
              className="rounded border border-stone-300 bg-white px-3 py-2 text-xs text-stone-800 focus:outline-none"
            >
              <option value="recommended">Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>

            <button
              type="button"
              onClick={() => apply()}
              className="rounded-full bg-[#181113] px-6 py-2 text-xs font-medium uppercase tracking-widest text-white transition-colors hover:bg-[#8c7456]"
            >
              Search
            </button>

            <button
              type="button"
              onClick={() => {
                setSelType("");
                setSelCity("");
                setSelGuests("");
                setSelCheckIn("");
                setSelCheckOut("");
                setSelSort("recommended");
                router.push("/properties");
              }}
              className="rounded-full border border-stone-300 px-5 py-2 text-xs uppercase tracking-widest text-stone-600 transition-colors hover:border-stone-900 hover:text-stone-900"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StayFilters;
