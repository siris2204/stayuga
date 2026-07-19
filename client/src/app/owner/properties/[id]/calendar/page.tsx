"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import {
  format, addMonths, subMonths, startOfMonth, endOfMonth,
  eachDayOfInterval, isBefore, isAfter, isSameDay, startOfDay, getDay,
} from "date-fns";
import { ChevronLeft, ChevronRight, X, Plus, Lock } from "lucide-react";
import { OwnerGuard } from "@/components/owner/OwnerGuard";
import { useOwnerAuth } from "@/context/OwnerAuthContext";
import { apiFetch, ApiRequestError } from "@/lib/api";

interface BookingEntry {
  _id: string;
  name: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: "pending" | "confirmed" | "declined";
}

interface BlockEntry {
  _id: string;
  startDate: string;
  endDate: string;
  reason?: string;
  source: "manual" | "booking";
}

interface CalendarData {
  property: { _id: string; title: string; slug: string };
  bookings: BookingEntry[];
  blocks: BlockEntry[];
}

// ── Legend dot ────────────────────────────────────────────────────────────────
function Dot({ color }: { color: string }) {
  return <span className={`inline-block h-2.5 w-2.5 rounded-full ${color}`} />;
}

// ── Day classifier ────────────────────────────────────────────────────────────
type DayKind = "confirmed" | "pending" | "manual" | "free";

function classifyDay(
  day: Date,
  bookings: BookingEntry[],
  blocks: BlockEntry[]
): DayKind {
  for (const b of blocks) {
    if (b.source === "manual") {
      const s = startOfDay(new Date(b.startDate));
      const e = startOfDay(new Date(b.endDate));
      if (!isBefore(day, s) && !isAfter(day, e)) return "manual";
    }
  }
  for (const b of bookings) {
    const s = startOfDay(new Date(b.checkIn));
    const e = startOfDay(new Date(b.checkOut));
    if (!isBefore(day, s) && !isAfter(day, e)) {
      return b.status === "confirmed" ? "confirmed" : b.status === "pending" ? "pending" : "free";
    }
  }
  return "free";
}

const KIND_STYLES: Record<DayKind, string> = {
  confirmed: "bg-forest text-cream",
  pending: "bg-amber-400 text-white",
  manual: "bg-rose-500 text-white",
  free: "hover:bg-sand text-ink",
};

// ── Calendar month ────────────────────────────────────────────────────────────
function CalendarMonth({
  month,
  today,
  bookings,
  blocks,
  selecting,
  onDayClick,
  onDayHover,
}: {
  month: Date;
  today: Date;
  bookings: BookingEntry[];
  blocks: BlockEntry[];
  selecting: { start: Date | null; end: Date | null };
  onDayClick: (d: Date) => void;
  onDayHover: (d: Date) => void;
}) {
  const days = eachDayOfInterval({ start: startOfMonth(month), end: endOfMonth(month) });
  const offset = getDay(startOfMonth(month));

  return (
    <div>
      <p className="mb-3 text-center text-sm font-semibold text-ink">{format(month, "MMMM yyyy")}</p>
      <div className="grid grid-cols-7 text-center mb-1">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <span key={d} className="text-[10px] font-medium text-ink-soft py-1">{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {Array.from({ length: offset }).map((_, i) => <div key={`e${i}`} />)}
        {days.map((day) => {
          const past = isBefore(day, today);
          const kind = classifyDay(day, bookings, blocks);

          const isSelStart = selecting.start ? isSameDay(day, selecting.start) : false;
          const isSelEnd = selecting.end ? isSameDay(day, selecting.end) : false;
          const inSel =
            selecting.start && selecting.end &&
            isAfter(day, selecting.start) && isBefore(day, selecting.end);

          return (
            <div key={day.toISOString()} className="relative flex items-center justify-center h-9">
              {inSel && <div className="absolute inset-y-1 left-0 right-0 bg-rose-100" />}
              {isSelStart && !isSelEnd && <div className="absolute inset-y-1 left-1/2 right-0 bg-rose-100" />}
              {isSelEnd && !isSelStart && <div className="absolute inset-y-1 left-0 right-1/2 bg-rose-100" />}

              <button
                type="button"
                disabled={past}
                onClick={() => !past && onDayClick(day)}
                onMouseEnter={() => !past && onDayHover(day)}
                className={[
                  "relative z-10 h-8 w-8 rounded-full text-xs transition-colors",
                  past ? "text-ink-soft/30 cursor-not-allowed" : "cursor-pointer",
                  isSelStart || isSelEnd
                    ? "bg-rose-500 text-white font-semibold"
                    : kind !== "free" && !inSel
                    ? KIND_STYLES[kind]
                    : !past
                    ? "hover:bg-sand text-ink"
                    : "",
                  isSameDay(day, today) && kind === "free" ? "font-bold underline underline-offset-2" : "",
                ].filter(Boolean).join(" ")}
              >
                {format(day, "d")}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main page component ───────────────────────────────────────────────────────
function CalendarContent({ propertyId }: { propertyId: string }) {
  const { token } = useOwnerAuth();
  const router = useRouter();
  const today = startOfDay(new Date());

  const [data, setData] = useState<CalendarData | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMonth, setViewMonth] = useState(today);
  const [selecting, setSelecting] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });
  const [hoverDay, setHoverDay] = useState<Date | null>(null);
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    if (!token) return;
    setLoading(true);
    const d = await apiFetch<CalendarData>(`/api/owner/properties/${propertyId}/calendar`, { token });
    setData(d);
    setLoading(false);
  }

  useEffect(() => { load(); }, [token]);

  function handleDayClick(day: Date) {
    if (!selecting.start || (selecting.start && selecting.end)) {
      setSelecting({ start: day, end: null });
    } else {
      if (isBefore(day, selecting.start) || isSameDay(day, selecting.start)) {
        setSelecting({ start: day, end: null });
      } else {
        setSelecting({ start: selecting.start, end: day });
      }
    }
  }

  function handleDayHover(day: Date) {
    if (selecting.start && !selecting.end) setHoverDay(day);
  }

  const selDisplay = {
    start: selecting.start,
    end: selecting.end ?? (selecting.start && hoverDay && isAfter(hoverDay, selecting.start) ? hoverDay : null),
  };

  async function addBlock() {
    if (!token || !selecting.start || !selecting.end) return;
    setSaving(true);
    setError("");
    try {
      await apiFetch(`/api/owner/properties/${propertyId}/blocks`, {
        method: "POST",
        token,
        body: JSON.stringify({
          startDate: format(selecting.start, "yyyy-MM-dd"),
          endDate: format(selecting.end, "yyyy-MM-dd"),
          reason: reason || "External booking",
        }),
      });
      setSelecting({ start: null, end: null });
      setReason("");
      await load();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Failed to add block");
    } finally {
      setSaving(false);
    }
  }

  async function removeBlock(blockId: string) {
    if (!token) return;
    try {
      await apiFetch(`/api/owner/properties/${propertyId}/blocks/${blockId}`, {
        method: "DELETE",
        token,
      });
      await load();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Failed to remove block");
    }
  }

  const manualBlocks = data?.blocks.filter((b) => b.source === "manual") ?? [];

  return (
    <div>
      <button
        onClick={() => router.push("/owner/dashboard")}
        className="mb-6 flex items-center gap-1 text-sm text-ink-soft hover:text-ink"
      >
        <ChevronLeft size={15} /> Back to dashboard
      </button>

      <h1 className="font-display text-2xl text-ink">
        {loading ? "Loading…" : data?.property.title}
      </h1>
      <p className="mt-1 text-sm text-ink-soft">Click and drag on the calendar to block dates for external bookings.</p>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-ink-soft">
        <span className="flex items-center gap-1.5"><Dot color="bg-forest" /> Confirmed (platform)</span>
        <span className="flex items-center gap-1.5"><Dot color="bg-amber-400" /> Pending (platform)</span>
        <span className="flex items-center gap-1.5"><Dot color="bg-rose-500" /> Blocked (external)</span>
      </div>

      <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-start">
        {/* ── Calendar ── */}
        <div className="rounded-2xl border border-line/70 bg-white p-6 lg:w-[580px] shrink-0">
          <div className="mb-4 flex items-center justify-between">
            <button
              onClick={() => setViewMonth(subMonths(viewMonth, 1))}
              disabled={!isAfter(viewMonth, today)}
              className="rounded-full p-1.5 hover:bg-sand disabled:opacity-30 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setViewMonth(addMonths(viewMonth, 1))}
              className="rounded-full p-1.5 hover:bg-sand transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            {[viewMonth, addMonths(viewMonth, 1)].map((m) => (
              <CalendarMonth
                key={format(m, "yyyy-MM")}
                month={m}
                today={today}
                bookings={data?.bookings ?? []}
                blocks={data?.blocks ?? []}
                selecting={selDisplay}
                onDayClick={handleDayClick}
                onDayHover={handleDayHover}
              />
            ))}
          </div>
        </div>

        {/* ── Right panel: block form + list ── */}
        <div className="flex-1 space-y-6">
          {/* Block dates form */}
          <div className="rounded-2xl border border-line/70 bg-white p-5">
            <div className="flex items-center gap-2 mb-4">
              <Lock size={15} className="text-rose-500" />
              <h3 className="font-semibold text-ink text-sm">Block dates</h3>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="rounded-lg border border-line bg-sand/40 px-3 py-2">
                <p className="text-[10px] font-medium uppercase tracking-wide text-ink-soft">From</p>
                <p className="mt-0.5 text-sm font-medium text-ink">
                  {selecting.start ? format(selecting.start, "d MMM yyyy") : "Select on calendar"}
                </p>
              </div>
              <div className="rounded-lg border border-line bg-sand/40 px-3 py-2">
                <p className="text-[10px] font-medium uppercase tracking-wide text-ink-soft">To</p>
                <p className="mt-0.5 text-sm font-medium text-ink">
                  {selecting.end ? format(selecting.end, "d MMM yyyy") : "—"}
                </p>
              </div>
            </div>

            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder='Reason (e.g. "Wedding — Sharma family")'
              className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-soft/50 focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest transition-colors mb-3"
            />

            {error && <p className="mb-2 text-xs text-red-600">{error}</p>}

            <button
              onClick={addBlock}
              disabled={!selecting.start || !selecting.end || saving}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-rose-500 py-2.5 text-sm font-medium text-white hover:bg-rose-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Plus size={15} />
              {saving ? "Blocking…" : "Block selected dates"}
            </button>

            {(selecting.start || selecting.end) && (
              <button
                onClick={() => setSelecting({ start: null, end: null })}
                className="mt-2 w-full text-center text-xs text-ink-soft hover:text-ink underline underline-offset-2"
              >
                Clear selection
              </button>
            )}
          </div>

          {/* Manual blocks list */}
          <div className="rounded-2xl border border-line/70 bg-white p-5">
            <h3 className="font-semibold text-ink text-sm mb-4">External blocks ({manualBlocks.length})</h3>
            {manualBlocks.length === 0 ? (
              <p className="text-sm text-ink-soft">No external blocks added yet.</p>
            ) : (
              <ul className="space-y-2">
                {manualBlocks.map((b) => (
                  <li key={b._id} className="flex items-center justify-between rounded-lg border border-line/70 px-3 py-2.5">
                    <div>
                      <p className="text-sm font-medium text-ink">
                        {format(new Date(b.startDate), "d MMM")} – {format(new Date(b.endDate), "d MMM yyyy")}
                      </p>
                      {b.reason && <p className="text-xs text-ink-soft">{b.reason}</p>}
                    </div>
                    <button
                      onClick={() => removeBlock(b._id)}
                      className="ml-3 rounded-full p-1.5 text-ink-soft hover:bg-red-50 hover:text-red-600 transition-colors"
                      title="Remove block"
                    >
                      <X size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PropertyCalendarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return (
    <OwnerGuard>
      <CalendarContent propertyId={id} />
    </OwnerGuard>
  );
}
