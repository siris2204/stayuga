"use client";

import { useState } from "react";
import { ExternalLink, MapPin, Navigation, Play } from "lucide-react";

interface PropertyMapProps {
  name: string;
  address: string;
  /** Pre-built embed URL — `location.mapEmbedUrl` from the API */
  mapEmbedUrl?: string;
}

/**
 * Location block with an interactive map plus deep links out to Google Maps.
 *
 * The iframe is *click-to-load*: on a phone an eagerly-mounted Google Maps
 * frame costs ~1MB and hijacks scroll gestures, so we render a lightweight
 * placeholder until the guest actually asks for the map.
 *
 * The property model stores an address rather than coordinates, so both the
 * embed and the "View on Maps" / "Get Directions" links are built from a
 * text search on the address.
 */
export function PropertyMap({ name, address, mapEmbedUrl }: PropertyMapProps) {
  const [loaded, setLoaded] = useState(false);
  const query = encodeURIComponent(address || name);

  const embedSrc = mapEmbedUrl ?? `https://www.google.com/maps?q=${query}&z=14&hl=en&output=embed`;
  const viewUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${query}`;

  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
      {/* ---------- Map surface ---------- */}
      <div className="relative h-56 w-full bg-stone-100 sm:h-72 lg:h-80">
        {loaded ? (
          <iframe
            title={`Map showing the location of ${name}`}
            src={embedSrc}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            className="h-full w-full border-0"
          />
        ) : (
          <button
            type="button"
            onClick={() => setLoaded(true)}
            className="group relative flex h-full w-full flex-col items-center justify-center gap-3 bg-[linear-gradient(135deg,#efe9e0_0%,#e3dbcf_100%)] transition-colors hover:bg-[#e8e1d6]"
            aria-label="Load interactive map"
          >
            {/* decorative faux street grid */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-[0.18]"
              style={{
                backgroundImage:
                  "linear-gradient(#8c7456 1px, transparent 1px), linear-gradient(90deg, #8c7456 1px, transparent 1px)",
                backgroundSize: "42px 42px",
              }}
            />
            <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-forest text-white shadow-lg transition-transform group-hover:scale-105">
              <MapPin size={22} strokeWidth={1.8} />
            </span>
            <span className="relative flex items-center gap-1.5 rounded-full bg-white/85 px-4 py-2 text-xs font-medium tracking-wide text-stone-700 shadow-sm">
              <Play size={12} className="fill-current" /> Tap to load map
            </span>
          </button>
        )}
      </div>

      {/* ---------- Address + actions ---------- */}
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <MapPin size={18} strokeWidth={1.6} className="mt-0.5 shrink-0 text-gold" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-stone-900">{name}</p>
            <p className="mt-0.5 text-xs leading-relaxed text-stone-500 sm:text-sm">{address}</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <a
            href={viewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-full border border-stone-300 px-4 py-3 text-xs font-medium uppercase tracking-widest text-stone-700 transition-colors hover:border-stone-900 hover:bg-stone-50 active:scale-[0.98]"
          >
            <ExternalLink size={14} /> View on Google Maps
          </a>
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-full bg-[#181113] px-4 py-3 text-xs font-medium uppercase tracking-widest text-white transition-colors hover:bg-[#8c7456] active:scale-[0.98]"
          >
            <Navigation size={14} /> Get Directions
          </a>
        </div>

        <p className="mt-3 text-[11px] leading-relaxed text-stone-400">
          Exact address and gate access are shared once your booking is confirmed.
        </p>
      </div>
    </div>
  );
}

export default PropertyMap;
