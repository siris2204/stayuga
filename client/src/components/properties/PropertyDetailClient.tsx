"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  Images,
  MapPin,
  ShieldCheck,
  Users,
} from "lucide-react";
import { AmenityIcon, guessAmenityIcon } from "@/components/properties/amenityIcons";
import { AddOnServices } from "@/components/properties/AddOnServices";
import { PropertyMap } from "@/components/properties/PropertyMap";
import { Modal } from "@/components/ui/Modal";
import { Input, Textarea } from "@/components/ui/Field";
import { formatPrice } from "@/lib/format";
import { apiFetch, ApiRequestError } from "@/lib/api";
import { Property } from "@/lib/types";
import {
  ADD_ON_SERVICES,
  nightsBetween,
  serviceCost,
  UNIT_LABEL,
} from "@/lib/addOnServices";

const TAX_RATE = 0.18; // 18% GST — estimator only, actual invoice confirmed by concierge

interface Props {
  property: Property;
}

export function PropertyDetailClient({ property }: Props) {
  const images = property.images.length > 0 ? property.images : [];
  const locationLabel = `${property.location.city}, ${property.location.state}`;

  const quickFacts = [
    { icon: "guests" as const, label: `${property.capacity.maxGuests} Guests` },
    { icon: "bed" as const, label: `${property.capacity.bedrooms} Bedrooms` },
    { icon: "bath" as const, label: `${property.capacity.bathrooms} Bathrooms` },
  ];

  const specs = [
    { icon: "bed" as const, title: `${property.capacity.bedrooms} Bedrooms`, detail: `Sleeps ${property.capacity.maxGuests}` },
    { icon: "bath" as const, title: `${property.capacity.bathrooms} Bathrooms`, detail: "En-suite" },
    { icon: "guests" as const, title: `${property.capacity.maxGuests} Guests`, detail: "Max occupancy" },
    { icon: "kitchen" as const, title: property.type === "villa" ? "Villa" : "Farmhouse", detail: property.tagline ?? "Fully equipped" },
  ];

  const amenities = property.amenities.map((label) => ({ icon: guessAmenityIcon(label), label }));

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(Math.min(2, property.capacity.maxGuests) || 1);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [priceOpen, setPriceOpen] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const nights = nightsBetween(checkIn, checkOut);
  const billableNights = Math.max(nights, 1);

  const toggleService = (id: string) =>
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );

  const totals = useMemo(() => {
    const stay = property.pricing.basePrice * billableNights;
    const addOns = ADD_ON_SERVICES.filter((s) => selectedServices.includes(s.id)).reduce(
      (sum, s) => sum + serviceCost(s, billableNights, guests),
      0
    );
    const taxes = Math.round((stay + addOns) * TAX_RATE);
    return { stay, addOns, taxes, grand: stay + addOns + taxes };
  }, [property.pricing.basePrice, billableNights, selectedServices, guests]);

  const chosenServices = ADD_ON_SERVICES.filter((s) => selectedServices.includes(s.id));

  async function submitBooking() {
    setSubmitting(true);
    setStatus("idle");
    try {
      await apiFetch("/api/bookings", {
        method: "POST",
        body: JSON.stringify({
          property: property._id,
          name,
          email,
          phone,
          checkIn,
          checkOut,
          guests,
          message,
          additionalServices: chosenServices.map((s) => s.name),
        }),
      });
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof ApiRequestError ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  function openBooking() {
    setStatus("idle");
    setBookingOpen(true);
  }

  /* ---------------- shared booking form (desktop card) --------------- */
  const BookingFields = (
    <div className="space-y-3.5">
      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-stone-500">
            <CalendarDays size={12} /> Check In
          </span>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-800 focus:border-stone-900 focus:outline-none"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-stone-500">
            <CalendarDays size={12} /> Check Out
          </span>
          <input
            type="date"
            value={checkOut}
            min={checkIn || undefined}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-800 focus:border-stone-900 focus:outline-none"
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-stone-500">
          <Users size={12} /> Guests
        </span>
        <div className="relative">
          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="w-full appearance-none rounded-lg border border-stone-300 bg-white px-3 py-2.5 pr-9 text-sm text-stone-800 focus:border-stone-900 focus:outline-none"
          >
            {Array.from({ length: property.capacity.maxGuests || 1 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "Guest" : "Guests"}
              </option>
            ))}
          </select>
          <ChevronDown
            size={15}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-stone-400"
          />
        </div>
      </label>
    </div>
  );

  const PriceBreakdown = (
    <div className="space-y-2.5 text-sm">
      <div className="flex items-center justify-between text-stone-600">
        <span>
          {formatPrice(property.pricing.basePrice, property.pricing.currency)} × {billableNights}{" "}
          {billableNights === 1 ? "night" : "nights"}
        </span>
        <span className="text-stone-900">{formatPrice(totals.stay, property.pricing.currency)}</span>
      </div>

      {chosenServices.map((s) => (
        <div key={s.id} className="flex items-center justify-between text-stone-600">
          <span className="flex min-w-0 items-center gap-2">
            <AmenityIcon name={s.icon} size={14} className="shrink-0 text-[#8c7456]" />
            <span className="truncate">
              {s.name}
              <span className="ml-1 text-[11px] text-stone-400">{UNIT_LABEL[s.unit]}</span>
            </span>
          </span>
          <span className="shrink-0 text-stone-900">
            {formatPrice(serviceCost(s, billableNights, guests), property.pricing.currency)}
          </span>
        </div>
      ))}

      <div className="flex items-center justify-between text-stone-600">
        <span>Taxes &amp; fees (18%)</span>
        <span className="text-stone-900">{formatPrice(totals.taxes, property.pricing.currency)}</span>
      </div>

      <div className="flex items-baseline justify-between border-t border-stone-200 pt-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-stone-700">
          Estimated Total
        </span>
        <span className="font-display text-xl text-stone-900">
          {formatPrice(totals.grand, property.pricing.currency)}
        </span>
      </div>
    </div>
  );

  const ContactFields = (
    <div className="space-y-3.5 border-t border-stone-100 pt-4">
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input label="Phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
      </div>
      <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <Textarea
        label="Message (optional)"
        placeholder="Tell us about your stay — occasion, preferences, anything else."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
    </div>
  );

  const canSubmit = Boolean(name && email && phone && checkIn && checkOut && guests);

  return (
    <div className="min-h-screen bg-shell pb-mobile-bar text-[#1c1917]">
      {/* ============================= 1. HERO ============================= */}
      <section className="relative flex h-[62vh] min-h-[380px] items-end justify-start bg-black sm:h-[70vh] lg:h-[520px]">
        {images[0] && (
          <Image
            src={images[0]}
            alt={property.title}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-80"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/25" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-8 sm:px-6 sm:pb-10 lg:px-8">
          <Link
            href="/properties"
            className="link-inline mb-3 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-gold-light transition-colors hover:text-white sm:mb-4"
          >
            <ArrowLeft size={13} /> Back to Stays
          </Link>

          <span className="mb-1.5 flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-stone-300">
            <MapPin size={12} /> {locationLabel}
          </span>

          <h1 className="mb-2 font-display text-3xl font-light leading-tight text-white sm:text-4xl lg:text-5xl">
            {property.title}
          </h1>

          {property.tagline && (
            <p className="max-w-xl text-sm font-light leading-relaxed text-white/80">
              {property.tagline}
            </p>
          )}

          <div className="snap-rail mt-4 sm:flex-wrap sm:overflow-visible">
            {quickFacts.map((fact) => (
              <span
                key={fact.label}
                className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-xs text-white backdrop-blur-sm"
              >
                <AmenityIcon name={fact.icon} size={15} />
                {fact.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* =================== 2. GALLERY + BOOKING CARD ==================== */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">
          {/* ---- Gallery ---- */}
          <div className="lg:col-span-8">
            {images.length > 0 && (
              <>
                {/* phones: swipeable rail */}
                <div className="snap-rail -mx-4 px-4 md:hidden">
                  {images.map((src, i) => (
                    <button
                      key={src + i}
                      type="button"
                      onClick={() => {
                        setGalleryIndex(i);
                        setGalleryOpen(true);
                      }}
                      className="relative h-56 w-[82vw] overflow-hidden rounded-xl"
                    >
                      <Image src={src} alt={`${property.title} photo ${i + 1}`} fill sizes="82vw" className="object-cover" />
                    </button>
                  ))}
                </div>

                {/* tablet / desktop: mosaic */}
                <div className="hidden grid-cols-4 gap-3 md:grid">
                  <button
                    type="button"
                    onClick={() => {
                      setGalleryIndex(0);
                      setGalleryOpen(true);
                    }}
                    className="group relative col-span-4 h-72 overflow-hidden rounded-xl lg:h-96"
                  >
                    <Image
                      src={images[0]}
                      alt={property.title}
                      fill
                      sizes="(min-width:1024px) 66vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </button>

                  {images.slice(1, 5).map((src, i) => (
                    <button
                      key={src + i}
                      type="button"
                      onClick={() => {
                        setGalleryIndex(i + 1);
                        setGalleryOpen(true);
                      }}
                      className="group relative col-span-2 h-40 overflow-hidden rounded-xl lg:col-span-1 lg:h-32"
                    >
                      <Image
                        src={src}
                        alt={`${property.title} photo ${i + 2}`}
                        fill
                        sizes="(min-width:1024px) 16vw, 50vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </button>
                  ))}
                </div>

                {images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      setGalleryIndex(0);
                      setGalleryOpen(true);
                    }}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-stone-300 px-4 py-2.5 text-[11px] font-medium uppercase tracking-widest text-stone-700 transition-colors hover:border-stone-900 hover:bg-white md:w-auto"
                  >
                    <Images size={14} /> View all {images.length} photos
                  </button>
                )}
              </>
            )}
          </div>

          {/* ---- Booking card (tablet + desktop only) ---- */}
          <aside className="sticky top-24 hidden rounded-2xl border border-stone-200 bg-white p-5 shadow-md lg:col-span-4 lg:block">
            <div className="mb-5 flex items-baseline justify-between border-b border-stone-100 pb-4">
              <div>
                <span className="text-xs text-stone-500">From</span>
                <div className="font-display text-2xl font-semibold text-stone-900">
                  {formatPrice(property.pricing.basePrice, property.pricing.currency)}
                </div>
              </div>
              <span className="text-xs text-stone-500">/ night</span>
            </div>

            {BookingFields}

            <div className="my-5 border-t border-stone-100 pt-4">{PriceBreakdown}</div>

            {chosenServices.length > 0 && (
              <p className="mb-3 flex items-center gap-1.5 text-[11px] text-stone-500">
                <Check size={12} className="text-[#8c7456]" />
                {chosenServices.length} add-on
                {chosenServices.length > 1 ? "s" : ""} included
              </p>
            )}

            <button
              type="button"
              onClick={openBooking}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#181113] py-3.5 text-xs font-medium uppercase tracking-widest text-white transition-colors hover:bg-[#8c7456]"
            >
              Request to Book <ArrowRight size={14} />
            </button>

            <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-stone-400">
              <ShieldCheck size={12} /> Free cancellation up to 14 days before
            </p>
          </aside>
        </div>
      </section>

      {/* =============== 3. THE STAY + SPECS + AMENITIES ================== */}
      <section className="mx-auto max-w-7xl border-t border-stone-200 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-12">
          <div>
            <span className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-[#8c7456]">
              The Stay Experience
            </span>
            <h2 className="mb-4 font-display text-2xl font-light text-stone-900 sm:text-3xl">
              About this property
            </h2>
            <p className="mb-6 whitespace-pre-line text-sm font-light leading-relaxed text-stone-600">
              {property.description}
            </p>

            <div className="grid grid-cols-2 gap-3">
              {specs.map((spec) => (
                <div
                  key={spec.title}
                  className="rounded-xl border border-stone-200 bg-white p-3.5 sm:p-4"
                >
                  <AmenityIcon name={spec.icon} size={20} className="mb-2 text-[#8c7456]" />
                  <span className="block text-sm font-semibold text-stone-900">{spec.title}</span>
                  <span className="text-xs text-stone-500">{spec.detail}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <span className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-[#8c7456]">
              Included With Every Stay
            </span>
            <h3 className="mb-5 font-display text-xl font-light text-stone-900 sm:text-2xl">
              Amenities
            </h3>

            {amenities.length > 0 ? (
              <div className="grid grid-cols-1 gap-x-4 gap-y-1 sm:grid-cols-2">
                {amenities.map((a) => (
                  <div
                    key={a.label}
                    className="flex items-center gap-3 border-b border-stone-100 py-2.5 text-sm text-stone-700 last:border-0"
                  >
                    <AmenityIcon name={a.icon} size={17} className="shrink-0 text-[#8c7456]" />
                    <span>{a.label}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-stone-500">Amenity details coming soon.</p>
            )}
          </div>
        </div>
      </section>

      {/* ========================= 4. LOCATION / MAP ====================== */}
      <section
        id="location"
        className="mx-auto max-w-7xl border-t border-stone-200 px-4 py-8 sm:px-6 sm:py-12 lg:px-8"
      >
        <span className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-[#8c7456]">
          Getting There
        </span>
        <h2 className="mb-5 font-display text-2xl font-light text-stone-900 sm:text-3xl">
          Where You&apos;ll Be
        </h2>

        <PropertyMap
          name={property.title}
          address={property.location.address}
          mapEmbedUrl={property.location.mapEmbedUrl}
        />
      </section>

      {/* ================== 5. ADD-ON SERVICES + TOTAL ==================== */}
      <section className="relative bg-ink text-cream">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.5]"
          style={{
            background:
              "radial-gradient(120% 70% at 15% 0%, rgba(196,156,121,0.16) 0%, transparent 60%)",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <AddOnServices
            nights={nights}
            guests={guests}
            currency={property.pricing.currency}
            selected={selectedServices}
            onToggle={toggleService}
          />

          <div className="mt-8 rounded-2xl border border-gold/35 bg-white p-5 shadow-xl sm:p-6">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-stone-700">
              Estimated Total
            </h3>
            {PriceBreakdown}
            <button
              type="button"
              onClick={openBooking}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#181113] py-3.5 text-xs font-medium uppercase tracking-widest text-white transition-colors hover:bg-[#8c7456]"
            >
              Request to Book <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* ============ MOBILE STICKY BOOKING BAR (phones + tablets) ======== */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 border-t border-stone-200 bg-white/95 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur-md lg:hidden"
        style={{ paddingBottom: "calc(0.75rem + var(--safe-bottom))" }}
      >
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setPriceOpen(true)}
            className="link-inline min-w-0 text-left"
          >
            <div className="font-display text-lg leading-tight text-stone-900">
              {formatPrice(totals.grand, property.pricing.currency)}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-stone-500 underline decoration-stone-300 underline-offset-2">
              {billableNights} {billableNights === 1 ? "night" : "nights"}
              {chosenServices.length > 0 && ` · ${chosenServices.length} add-on`}
              <ChevronDown size={11} />
            </div>
          </button>

          <button
            type="button"
            onClick={openBooking}
            className="flex shrink-0 items-center gap-2 rounded-full bg-[#181113] px-6 py-3 text-xs font-medium uppercase tracking-widest text-white transition-transform active:scale-95"
          >
            Reserve <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* ---------------------- BOOKING SHEET / MODAL --------------------- */}
      <Modal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        title={status === "success" ? "Enquiry sent" : "Reserve your stay"}
        subtitle={status === "success" ? undefined : `${property.title} · ${locationLabel}`}
        footer={
          status === "success" ? undefined : (
            <button
              type="button"
              onClick={submitBooking}
              disabled={!canSubmit || submitting}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#181113] py-3.5 text-xs font-medium uppercase tracking-widest text-white transition-colors active:scale-[0.98] disabled:opacity-40"
            >
              {submitting
                ? "Sending..."
                : `Request to Book · ${formatPrice(totals.grand, property.pricing.currency)}`}
            </button>
          )
        }
      >
        {status === "success" ? (
          <div className="py-6 text-center">
            <p className="font-display text-lg text-stone-900">Thank you, {name.split(" ")[0]}</p>
            <p className="mt-2 text-sm text-stone-500">
              Our concierge will get back to you shortly to confirm availability.
            </p>
            <button
              type="button"
              onClick={() => setBookingOpen(false)}
              className="mt-4 text-sm font-medium text-forest underline underline-offset-4"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="space-y-5 pb-2">
            {BookingFields}
            {ContactFields}
            <div className="border-t border-stone-100 pt-4">{PriceBreakdown}</div>
            {status === "error" && <p className="text-sm text-red-600">{errorMessage}</p>}
            <p className="flex items-center gap-1.5 text-[11px] text-stone-400">
              <ShieldCheck size={12} /> Free cancellation up to 14 days before check-in
            </p>
          </div>
        )}
      </Modal>

      {/* ---------------------- PRICE BREAKDOWN POPUP -------------------- */}
      <Modal
        open={priceOpen}
        onClose={() => setPriceOpen(false)}
        title="Price breakdown"
        subtitle={`${billableNights} ${billableNights === 1 ? "night" : "nights"} · ${guests} ${
          guests === 1 ? "guest" : "guests"
        }`}
      >
        <div className="pb-2">{PriceBreakdown}</div>
      </Modal>

      {/* --------------------------- LIGHTBOX ---------------------------- */}
      {images.length > 0 && (
        <Modal
          open={galleryOpen}
          onClose={() => setGalleryOpen(false)}
          title={property.title}
          subtitle={`${images.length} photos`}
          maxWidth="max-w-3xl"
        >
          <div className="space-y-3 pb-2">
            <div className="relative h-64 w-full overflow-hidden rounded-xl sm:h-96">
              <Image
                src={images[galleryIndex]}
                alt={`${property.title} photo ${galleryIndex + 1}`}
                fill
                sizes="(min-width:640px) 720px, 100vw"
                className="object-cover"
              />
            </div>
            <div className="snap-rail">
              {images.map((src, i) => (
                <button
                  key={src + i}
                  type="button"
                  onClick={() => setGalleryIndex(i)}
                  className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg ring-offset-2 transition-all ${
                    i === galleryIndex ? "ring-2 ring-stone-900" : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image src={src} alt="" fill sizes="96px" className="object-cover" />
                </button>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default PropertyDetailClient;
