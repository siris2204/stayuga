"use client";

import { useState } from "react";
import Image from "next/image";
import { apiFetch, ApiRequestError } from "@/lib/api";

const eventTypes = [
  {
    title: "Weddings & Engagements",
    desc: "Say 'I do' in a destination as extraordinary as your love story.",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Corporate Retreat / Offsite",
    desc: "Inspire your team with focused spaces, scenic surroundings and seamless planning.",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Spiritual / Cultural",
    desc: "Mindful gatherings, meditation retreats and rich cultural traditions.",
    image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Private Celebration",
    desc: "Birthdays, anniversaries, reunions — make it unforgettable in a luxury villa setting.",
    image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=800&auto=format&fit=crop",
  },
];

const EVENT_TYPE_OPTIONS = [
  "Weddings & Engagements",
  "Corporate Retreat / Offsite",
  "Spiritual / Cultural",
  "Private Celebration",
  "Special Shoot / Media",
];

export default function EventsPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: EVENT_TYPE_OPTIONS[0],
    stayBackRooms: "5",
    guestCount: "50",
    notes: "",
  });
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setStatus("idle");
    try {
      await apiFetch("/api/leads", {
        method: "POST",
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          subject: `Event Inquiry — ${formData.eventType}`,
          message: `Event type: ${formData.eventType}\nEstimated guests: ${formData.guestCount}\nStay-back rooms required: ${formData.stayBackRooms}\n\n${formData.notes}`,
        }),
      });
      setStatus("success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        eventType: EVENT_TYPE_OPTIONS[0],
        stayBackRooms: "5",
        guestCount: "50",
        notes: "",
      });
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof ApiRequestError ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-shell pt-20 text-[#1c1417]">
      {/* 1. HERO */}
      <section className="relative flex h-[480px] items-end justify-start bg-black">
        <Image
          src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=1920&auto=format&fit=crop"
          alt="Curated Events Hero"
          fill
          priority
          className="object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-16">
          <span className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.25em] text-gold-light">
            Private Events &amp; Celebrations
          </span>
          <h1 className="mb-4 font-display text-4xl font-light leading-tight text-white md:text-5xl">
            Meaningful Moments, <br />
            Beautifully Curated.
          </h1>
          <p className="max-w-lg text-sm font-light leading-relaxed text-white/80">
            From intimate gatherings to grand celebrations, our villas provide the perfect setting
            for life&apos;s most special moments.
          </p>
        </div>
      </section>

      {/* 2. EVENT TYPES */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
            Tailored Experiences
          </span>
          <h2 className="font-display text-3xl font-light text-[#1c1417] md:text-4xl">
            Experiences for Every Occasion
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {eventTypes.map((item) => (
            <div
              key={item.title}
              className="overflow-hidden rounded border border-stone-200 bg-white shadow-sm transition-all hover:shadow-lg"
            >
              <div className="relative h-48 w-full">
                <Image src={item.image} alt={item.title} fill className="object-cover" />
              </div>
              <div className="p-5">
                <h3 className="mb-2 font-display text-lg text-[#1c1417]">{item.title}</h3>
                <p className="text-xs font-light leading-relaxed text-stone-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. EVENT INQUIRY FORM */}
      <section className="bg-ink py-16 text-white">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mb-10 text-center">
            <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
              Plan With Us
            </span>
            <h2 className="font-display text-3xl font-light">Custom Event Inquiry</h2>
            <p className="mt-2 text-xs text-stone-400">
              Tell us your vision and requirements; our team will craft a bespoke proposal.
            </p>
          </div>

          {status === "success" ? (
            <div className="rounded-lg border border-gold/40 bg-black/30 p-8 text-center">
              <p className="font-display text-lg text-gold-light">Inquiry received</p>
              <p className="mt-2 text-sm text-stone-400">
                Thank you — our event coordinator will connect with you shortly.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-4 text-sm font-medium text-gold-light underline underline-offset-4"
              >
                Submit another inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-white/10 bg-black/30 p-8 text-xs">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div>
                  <label className="mb-2 block uppercase tracking-wider text-stone-300">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded border border-white/20 bg-white/5 p-3 text-white placeholder-stone-500 focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block uppercase tracking-wider text-stone-300">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded border border-white/20 bg-white/5 p-3 text-white placeholder-stone-500 focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block uppercase tracking-wider text-stone-300">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91 / +1 ..."
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded border border-white/20 bg-white/5 p-3 text-white placeholder-stone-500 focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div>
                  <label className="mb-2 block uppercase tracking-wider text-stone-300">Type of Event</label>
                  <select
                    value={formData.eventType}
                    onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                    className="w-full rounded border border-white/20 bg-ink p-3 text-white focus:border-gold focus:outline-none"
                  >
                    {EVENT_TYPE_OPTIONS.map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block uppercase tracking-wider text-stone-300">
                    Stay-Back Rooms Required
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 5"
                    value={formData.stayBackRooms}
                    onChange={(e) => setFormData({ ...formData, stayBackRooms: e.target.value })}
                    className="w-full rounded border border-white/20 bg-white/5 p-3 text-white focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block uppercase tracking-wider text-stone-300">
                    Estimated Guest Count
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 50"
                    value={formData.guestCount}
                    onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
                    className="w-full rounded border border-white/20 bg-white/5 p-3 text-white focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block uppercase tracking-wider text-stone-300">Event Notes &amp; Details</label>
                <textarea
                  rows={4}
                  placeholder="Tell us about the dates, preferred destinations, catering preferences, or special requests..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full rounded border border-white/20 bg-white/5 p-3 text-white placeholder-stone-500 focus:border-gold focus:outline-none"
                />
              </div>

              {status === "error" && <p className="text-sm text-red-400">{errorMessage}</p>}

              <div className="pt-2 text-center">
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded border border-gold bg-gold px-8 py-3 font-semibold uppercase tracking-widest text-ink transition-all hover:bg-transparent hover:text-gold disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit Inquiry →"}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
