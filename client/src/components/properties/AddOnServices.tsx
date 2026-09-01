"use client";

import { useMemo, useState } from "react";
import { Check, Info, Plus, ReceiptText, Sparkles, TriangleAlert } from "lucide-react";
import { AmenityIcon } from "@/components/properties/amenityIcons";
import { Modal } from "@/components/ui/Modal";
import { formatPrice } from "@/lib/format";
import {
  ADD_ON_SERVICES,
  UNIT_LABEL,
  serviceCost,
  type AddOnService,
} from "@/lib/addOnServices";

interface AddOnServicesProps {
  nights: number;
  guests: number;
  currency: string;
  selected: string[];
  onToggle: (id: string) => void;
}

/**
 * Add-on services shown *below* the property details.
 *
 * - Each service is priced as an extra on top of the room rate.
 * - Tapping a card (or the info button) opens a popup with the full
 *   inclusions before the guest commits.
 * - A live subtotal of everything selected sits at the bottom.
 * - Selected services are carried into the booking enquiry as
 *   `additionalServices` — nothing here is billed directly, it's an
 *   estimator; final pricing is confirmed by the concierge team.
 */
export function AddOnServices({
  nights,
  guests,
  currency,
  selected,
  onToggle,
}: AddOnServicesProps) {
  const [active, setActive] = useState<AddOnService | null>(null);

  const effectiveNights = Math.max(nights, 1);
  const isSelected = (id: string) => selected.includes(id);

  const chosen = useMemo(
    () => ADD_ON_SERVICES.filter((s) => selected.includes(s.id)),
    [selected]
  );

  const addOnsTotal = useMemo(
    () => chosen.reduce((sum, s) => sum + serviceCost(s, effectiveNights, guests), 0),
    [chosen, effectiveNights, guests]
  );

  return (
    <section id="add-ons" className="scroll-mt-28">
      <div className="mb-6 sm:mb-8">
        <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
          <Sparkles size={11} /> Optional Extras
        </span>
        <h2 className="font-display text-2xl font-light text-cream sm:text-3xl lg:text-4xl">
          Property Services &amp; Add-ons
        </h2>
        <p className="mt-3 max-w-2xl text-sm font-light leading-relaxed text-cream/70">
          Everything below is charged on top of your nightly rate. Tap any service to see exactly
          what&apos;s included before you add it — nothing is confirmed until our concierge speaks
          with you.
        </p>
      </div>

      {/* ---------- Service grid ---------- */}
      <div className="stagger grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {ADD_ON_SERVICES.map((service) => {
          const on = isSelected(service.id);
          const cost = serviceCost(service, effectiveNights, guests);

          return (
            <div
              key={service.id}
              className={[
                "animate-fade-up group relative flex flex-col rounded-2xl border bg-white p-4 text-left transition-all duration-200 sm:p-5",
                on
                  ? "border-gold shadow-[0_0_0_2px_rgba(196,156,121,0.55)]"
                  : "border-transparent hover:-translate-y-0.5 hover:shadow-lg",
              ].join(" ")}
            >
              {service.popular && (
                <span className="absolute -top-2 right-4 rounded-full bg-gold-light px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-ink">
                  Popular
                </span>
              )}

              <div className="flex items-start gap-3">
                <span
                  className={[
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors",
                    on ? "bg-[#181113] text-white" : "bg-[#f3ede4] text-[#8c7456]",
                  ].join(" ")}
                >
                  <AmenityIcon name={service.icon} size={19} />
                </span>

                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold leading-snug text-stone-900">
                    {service.name}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-stone-500">{service.summary}</p>
                </div>

                {/* info → popup */}
                <button
                  type="button"
                  onClick={() => setActive(service)}
                  aria-label={`More about ${service.name}`}
                  className="link-inline -mr-1 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700"
                >
                  <Info size={16} />
                </button>
              </div>

              <div className="mt-4 flex items-end justify-between gap-3 border-t border-stone-100 pt-3">
                <div className="min-w-0">
                  <div className="font-display text-base text-stone-900">
                    {formatPrice(service.price, currency)}
                  </div>
                  <div className="text-[11px] text-stone-400">
                    {UNIT_LABEL[service.unit]}
                    {service.unit !== "per_stay" && (
                      <>
                        {" · "}
                        {formatPrice(cost, currency)} total
                      </>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onToggle(service.id)}
                  aria-pressed={on}
                  className={[
                    "flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-[11px] font-medium uppercase tracking-widest transition-all active:scale-95",
                    on
                      ? "bg-[#181113] text-white hover:bg-[#8c7456]"
                      : "border border-stone-300 text-stone-700 hover:border-stone-900 hover:bg-stone-50",
                  ].join(" ")}
                >
                  {on ? <Check size={13} /> : <Plus size={13} />}
                  {on ? "Added" : "Add"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ---------- Running total ---------- */}
      <div className="mt-6 rounded-2xl border border-gold/25 bg-white/[0.04] p-4 backdrop-blur-sm sm:p-5">
        <div className="flex items-center gap-2">
          <ReceiptText size={16} className="text-gold" />
          <h3 className="text-xs font-semibold uppercase tracking-widest text-cream/80">
            Add-ons Summary
          </h3>
        </div>

        {chosen.length === 0 ? (
          <p className="mt-3 text-sm text-cream/55">
            No services added yet — your total is just the nightly rate.
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-white/10">
            {chosen.map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-3 py-2.5">
                <div className="flex min-w-0 items-center gap-2.5">
                  <AmenityIcon name={s.icon} size={15} className="shrink-0 text-gold" />
                  <div className="min-w-0">
                    <span className="block truncate text-sm text-cream">{s.name}</span>
                    <span className="text-[11px] text-cream/45">
                      {formatPrice(s.price, currency)} {UNIT_LABEL[s.unit]}
                      {s.unit === "per_night" && ` × ${effectiveNights}`}
                      {s.unit === "per_person" && ` × ${guests}`}
                    </span>
                  </div>
                </div>
                <span className="shrink-0 text-sm font-medium text-cream">
                  {formatPrice(serviceCost(s, effectiveNights, guests), currency)}
                </span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-3 flex items-baseline justify-between border-t border-gold/25 pt-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-cream/80">
            Services Total
          </span>
          <span className="font-display text-xl text-gold">
            {formatPrice(addOnsTotal, currency)}
          </span>
        </div>
      </div>

      {/* ---------- Detail popup ---------- */}
      <Modal
        open={Boolean(active)}
        onClose={() => setActive(null)}
        title={active?.name}
        subtitle={
          active
            ? `${formatPrice(active.price, currency)} ${UNIT_LABEL[active.unit]}`
            : undefined
        }
        footer={
          active && (
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-[11px] uppercase tracking-widest text-stone-400">
                  Total for your stay
                </div>
                <div className="font-display text-lg text-stone-900">
                  {formatPrice(serviceCost(active, effectiveNights, guests), currency)}
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  onToggle(active.id);
                  setActive(null);
                }}
                className={[
                  "flex items-center gap-2 rounded-full px-6 py-3 text-xs font-medium uppercase tracking-widest transition-colors active:scale-95",
                  isSelected(active.id)
                    ? "border border-stone-300 text-stone-700 hover:bg-stone-50"
                    : "bg-[#181113] text-white hover:bg-[#8c7456]",
                ].join(" ")}
              >
                {isSelected(active.id) ? (
                  <>
                    <Check size={14} /> Remove
                  </>
                ) : (
                  <>
                    <Plus size={14} /> Add to stay
                  </>
                )}
              </button>
            </div>
          )
        }
      >
        {active && (
          <div className="space-y-5 pb-1">
            <div className="flex h-24 items-center justify-center rounded-xl bg-[#f3ede4] text-[#8c7456]">
              <AmenityIcon name={active.icon} size={40} />
            </div>

            <p className="text-sm leading-relaxed text-stone-600">{active.description}</p>

            <div>
              <h4 className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest text-stone-500">
                What&apos;s included
              </h4>
              <ul className="space-y-2">
                {active.includes.map((line) => (
                  <li key={line} className="flex items-start gap-2.5 text-sm text-stone-700">
                    <Check size={15} className="mt-0.5 shrink-0 text-[#8c7456]" />
                    <span className="leading-relaxed">{line}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl bg-stone-50 p-3.5 text-xs text-stone-600">
              <div className="flex items-center justify-between">
                <span>Rate</span>
                <span className="font-medium text-stone-900">
                  {formatPrice(active.price, currency)} {UNIT_LABEL[active.unit]}
                </span>
              </div>
              {active.unit === "per_night" && (
                <div className="mt-1.5 flex items-center justify-between">
                  <span>Nights</span>
                  <span className="font-medium text-stone-900">× {effectiveNights}</span>
                </div>
              )}
              {active.unit === "per_person" && (
                <div className="mt-1.5 flex items-center justify-between">
                  <span>Guests</span>
                  <span className="font-medium text-stone-900">× {guests}</span>
                </div>
              )}
            </div>

            {active.notice && (
              <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
                <TriangleAlert size={15} className="mt-0.5 shrink-0" />
                <span className="leading-relaxed">{active.notice}</span>
              </div>
            )}
          </div>
        )}
      </Modal>
    </section>
  );
}

export default AddOnServices;
