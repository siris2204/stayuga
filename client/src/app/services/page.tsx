import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { EVENT_SERVICES, STAY_SERVICES, type ServiceItem } from "@/lib/services";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Stay services and event services at Stayuga farmhouses — dining, wellness, décor, catering and full event management, arranged by one team.",
};

function priceLabel(service: ServiceItem) {
  if (service.priceFrom === null) return "Included";
  return `From ${formatPrice(service.priceFrom)}${service.unit ? ` ${service.unit}` : ""}`;
}

function ServiceGrid({ items }: { items: ServiceItem[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {items.map((service) => (
        <article
          key={service.title}
          className="group flex flex-col overflow-hidden border border-line bg-shell transition-shadow hover:shadow-lg sm:flex-row"
        >
          <div className="relative h-44 shrink-0 sm:h-auto sm:w-2/5">
            <Image
              src={service.image}
              alt=""
              fill
              sizes="(max-width: 640px) 100vw, 20vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </div>

          <div className="flex flex-1 flex-col justify-between p-6">
            <div>
              <service.icon
                size={20}
                strokeWidth={1.4}
                className="mb-3 text-gold"
                aria-hidden="true"
              />
              <h3 className="font-display mb-2 text-xl font-normal text-ink">{service.title}</h3>
              <p className="text-sm font-light leading-relaxed text-ink-soft">{service.desc}</p>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-line pt-4">
              <span className="text-xs font-medium tracking-wide text-gold">
                {priceLabel(service)}
              </span>
              <Link
                href="/properties"
                className="link-inline text-[11px] font-semibold uppercase tracking-widest text-ink transition-colors hover:text-gold"
              >
                Enquire &rarr;
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-cream pt-20 text-ink">
      {/* ---------------- Intro ---------------- */}
      <section className="mx-auto max-w-3xl px-6 py-16 text-center">
        <span className="eyebrow mb-3 text-ink-soft">Everything, one team</span>
        <h1 className="font-display mb-5 text-4xl font-light text-ink md:text-5xl">
          Our Services
        </h1>
        <p className="text-sm font-light leading-relaxed text-ink-soft">
          Two ways we work: around your stay, and around your occasion.
        </p>
      </section>

      {/* ---------------- Stay services ----------------
          Split by intent rather than one long list — guests booking a
          weekend and clients booking a wedding want different shelves. */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <header className="mb-10 border-b border-line pb-5">
          <span className="eyebrow mb-2 text-gold">01</span>
          <h2 className="font-display text-3xl font-light text-ink md:text-4xl">Stay Services</h2>
          <p className="mt-2 max-w-xl text-sm font-light text-ink-soft">
            Arranged around a booked farmhouse, from the first morning to the last.
          </p>
        </header>

        <ServiceGrid items={STAY_SERVICES} />
      </section>

      {/* ---------------- Event services ---------------- */}
      <section className="bg-sand/40 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <header className="mb-10 border-b border-line pb-5">
            <span className="eyebrow mb-2 text-gold">02</span>
            <h2 className="font-display text-3xl font-light text-ink md:text-4xl">
              Event Services
            </h2>
            <p className="mt-2 max-w-xl text-sm font-light text-ink-soft">
              When the farmhouse is the venue — venue, food, décor and management in one contract.
            </p>
          </header>

          <ServiceGrid items={EVENT_SERVICES} />
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="bg-ink py-16 text-center text-cream">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="font-display mb-4 text-2xl font-light md:text-3xl">
            Tell us the occasion. We&rsquo;ll take it from there.
          </h2>
          <Link
            href="/events"
            className="mt-4 inline-flex items-center gap-3 bg-gold px-8 py-3.5 text-[11px] font-medium uppercase tracking-[0.25em] text-ink transition-colors hover:bg-gold-light"
          >
            <span>Plan an event</span>
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
