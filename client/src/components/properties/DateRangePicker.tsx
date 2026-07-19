"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isBefore,
  isAfter,
  isSameDay,
  startOfDay,
  getDay,
} from "date-fns";

interface Props {
  checkIn: Date | null;
  checkOut: Date | null;
  onChange: (range: { checkIn: Date | null; checkOut: Date | null }) => void;
}

export function DateRangePicker({ checkIn, checkOut, onChange }: Props) {
  const today = startOfDay(new Date());
  const [viewMonth, setViewMonth] = useState(today);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  const days = eachDayOfInterval({
    start: startOfMonth(viewMonth),
    end: endOfMonth(viewMonth),
  });
  const offset = getDay(startOfMonth(viewMonth));

  function handleDay(day: Date) {
    if (isBefore(day, today)) return;
    if (!checkIn || (checkIn && checkOut)) {
      onChange({ checkIn: day, checkOut: null });
    } else if (isSameDay(day, checkIn) || isBefore(day, checkIn)) {
      onChange({ checkIn: day, checkOut: null });
    } else {
      onChange({ checkIn, checkOut: day });
    }
  }

  function isInRange(day: Date) {
    const end = checkOut ?? (checkIn && hoverDate && isAfter(hoverDate, checkIn) ? hoverDate : null);
    if (!checkIn || !end) return false;
    return isAfter(day, checkIn) && isBefore(day, end);
  }

  const canGoPrev = isAfter(viewMonth, today);

  return (
    <div>
      {/* Month nav */}
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setViewMonth(subMonths(viewMonth, 1))}
          disabled={!canGoPrev}
          className="rounded-full p-1 hover:bg-sand disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={15} />
        </button>
        <span className="text-sm font-semibold text-ink">
          {format(viewMonth, "MMMM yyyy")}
        </span>
        <button
          type="button"
          onClick={() => setViewMonth(addMonths(viewMonth, 1))}
          className="rounded-full p-1 hover:bg-sand transition-colors"
        >
          <ChevronRight size={15} />
        </button>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 mb-1">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div key={d} className="text-center text-[10px] font-medium text-ink-soft py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7">
        {Array.from({ length: offset }).map((_, i) => (
          <div key={`e${i}`} />
        ))}
        {days.map((day) => {
          const past = isBefore(day, today);
          const isStart = checkIn ? isSameDay(day, checkIn) : false;
          const isEnd = checkOut ? isSameDay(day, checkOut) : false;
          const inRange = isInRange(day);
          const isToday = isSameDay(day, today);

          return (
            <div key={day.toISOString()} className="relative flex items-center justify-center h-9">
              {/* range bar behind the circle */}
              {inRange && (
                <div className="absolute inset-y-1 left-0 right-0 bg-forest/10" />
              )}
              {isStart && !isEnd && (
                <div className="absolute inset-y-1 left-1/2 right-0 bg-forest/10" />
              )}
              {isEnd && !isStart && (
                <div className="absolute inset-y-1 left-0 right-1/2 bg-forest/10" />
              )}

              <button
                type="button"
                disabled={past}
                onClick={() => handleDay(day)}
                onMouseEnter={() => { if (!checkOut && checkIn) setHoverDate(day); }}
                onMouseLeave={() => setHoverDate(null)}
                className={[
                  "relative z-10 h-8 w-8 rounded-full text-xs transition-colors",
                  past
                    ? "text-ink-soft/30 cursor-not-allowed"
                    : "cursor-pointer",
                  isStart || isEnd
                    ? "bg-forest text-cream font-semibold"
                    : inRange
                    ? "text-ink hover:bg-forest/20"
                    : past
                    ? ""
                    : "hover:bg-sand text-ink",
                  isToday && !isStart && !isEnd
                    ? "font-semibold underline underline-offset-2"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
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
