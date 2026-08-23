import Link from "next/link";
import Image from "next/image";
import { emptyContent, getContent, getProperties } from "@/lib/data";
import { formatPrice } from "@/lib/format";

const serviceCards = [
  { title: "Private Chef", desc: "Bespoke fine-dining & menus" },
  { title: "Concierge", desc: "24/7 personalized itineraries" },
  { title: "In-Villa Dining", desc: "Sunset multi-course service" },
  { title: "Activity Planning", desc: "Private yacht & villa excursions" },
  { title: "Chauffeur & Transfers", desc: "Luxury airport pick-up" },
  { title: "Wellness & Yoga", desc: "Private masters & spa therapy" },
];

export default async function HomePage() {
  const [properties, content] = await Promise.all([
    getProperties({ featured: "true" }).catch(() => []),
    getContent().catch(emptyContent),
  ]);

  const hero = content.blocks["homepage-hero"] ?? {
    heading: "Curated Stays.\nUnforgettable\nExperiences.",
    subheading:
      "Extraordinary stays in the world's most desirable destinations — with no extra cost.",
  };
  const heroLines = hero.heading.split("\n");

  return (
    <div className="bg-cream text-ink font-sans selection:bg-gold selection:text-ink">
      {/* 1. HERO SECTION */}
      <section className="relative flex h-screen min-h-[640px] items-center justify-start bg-ink">
        <Image
          src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1920&auto=format&fit=crop"
          alt="Luxury Villa Sunset"
          fill
          priority
          className="scale-100 transform object-cover opacity-75 transition-transform duration-1000 ease-out hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/50 to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-16">
          <div className="max-w-xl text-left">
            <span className="mb-4 block text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">
              Luxury Villa Rentals
            </span>
            <h1 className="mb-6 font-display text-4xl font-light leading-tight text-cream md:text-6xl">
              {heroLines.map((line, i) => (
                <span key={i}>
                  {line}
                  {i < heroLines.length - 1 && <br />}
                </span>
              ))}
            </h1>
            <p className="mb-8 max-w-md text-sm font-light leading-relaxed text-cream/80 md:text-base">
              {hero.subheading}
            </p>
            <Link
              href="/properties"
              className="inline-flex items-center gap-3 border border-gold bg-gold/10 px-8 py-3.5 text-xs uppercase tracking-[0.2em] text-cream shadow-lg transition-all duration-300 hover:bg-gold hover:text-ink active:scale-95"
            >
              Explore Stays <span>&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. OUR STAYS SECTION */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-12 grid grid-cols-1 items-start gap-8 lg:grid-cols-4">
          <div>
            <span className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.25em] text-ink-soft">
              Our Stays
            </span>
            <h2 className="mb-4 font-display text-3xl font-light leading-snug text-ink md:text-4xl">
              Extraordinary Stays, Handpicked for You
            </h2>
            <p className="mb-6 text-sm font-light leading-relaxed text-ink/80">
              From coastal escapes to mountain retreats, our villas are handpicked for their unique
              charm, privacy and effortless luxury.
            </p>
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 border-b border-forest pb-1 text-xs font-semibold uppercase tracking-[0.2em] text-forest transition-colors hover:border-gold hover:text-gold"
            >
              View All Stays <span>&rarr;</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:col-span-3">
            {properties.length === 0 ? (
              <p className="col-span-full text-sm text-ink-soft">
                Featured stays are coming soon — check back shortly.
              </p>
            ) : (
              properties.slice(0, 3).map((property) => (
                <Link
                  key={property._id}
                  href={`/properties/${property.slug}`}
                  className="group flex flex-col overflow-hidden rounded-sm border border-forest/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
                >
                  <div className="relative h-56 w-full overflow-hidden">
                    {property.images[0] && (
                      <Image
                        src={property.images[0]}
                        alt={property.title}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="flex flex-grow flex-col justify-between bg-white p-6">
                    <div>
                      <span className="mb-1 block text-[10px] uppercase tracking-wider text-ink-soft">
                        {property.location.city}, {property.location.state}
                      </span>
                      <div className="mb-3 flex items-center justify-between">
                        <h3 className="font-display text-lg text-ink transition-colors group-hover:text-gold">
                          {property.title}
                        </h3>
                        <span className="text-ink-soft transition-all group-hover:translate-x-1 group-hover:text-ink">
                          &rarr;
                        </span>
                      </div>
                      <div className="mb-4 flex items-center gap-4 border-b border-stone-100 pb-4 text-xs text-ink-soft">
                        <span>🛏 {property.capacity.bedrooms} Bedrooms</span>
                        <span>🚿 {property.capacity.bathrooms} Bathrooms</span>
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-ink">
                      {formatPrice(property.pricing.basePrice, property.pricing.currency)}{" "}
                      <span className="text-xs font-normal text-ink-soft">/ night</span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* 3. OUR EVENTS SECTION */}
      <section className="border-y border-forest bg-ink py-20 text-cream">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <span className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">
                Our Events
              </span>
              <h2 className="mb-4 font-display text-3xl font-light leading-snug md:text-4xl">
                Meaningful Moments, Beautifully Curated.
              </h2>
              <p className="mb-6 text-sm font-light leading-relaxed text-cream/70">
                From intimate gatherings to grand celebrations, our event services create
                unforgettable experiences in extraordinary settings.
              </p>
              <Link
                href="/events"
                className="inline-flex items-center gap-2 border border-gold px-6 py-3 text-xs uppercase tracking-[0.2em] text-gold shadow-md transition-all hover:bg-gold hover:text-ink active:scale-95"
              >
                Explore Events <span>&rarr;</span>
              </Link>
            </div>

            <div className="relative h-80 overflow-hidden rounded-sm border border-forest/50 shadow-2xl lg:col-span-5">
              <Image
                src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=800&auto=format&fit=crop"
                alt="Event Setup"
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>

            <div className="flex flex-col gap-5 text-sm lg:col-span-3">
              <div className="border-l-2 border-gold pl-4">
                <h4 className="mb-1 font-display text-base text-gold">Private Celebrations</h4>
                <p className="text-xs text-ink-soft">Birthdays, anniversaries &amp; milestones</p>
              </div>
              <div className="border-l-2 border-forest pl-4">
                <h4 className="mb-1 font-display text-base text-cream">Corporate Retreats</h4>
                <p className="text-xs text-ink-soft">Team offsites &amp; leadership summits</p>
              </div>
              <div className="border-l-2 border-forest pl-4">
                <h4 className="mb-1 font-display text-base text-cream">Weddings &amp; Engagements</h4>
                <p className="text-xs text-ink-soft">Scenic destination celebrations</p>
              </div>
              <div className="border-l-2 border-forest pl-4">
                <h4 className="mb-1 font-display text-base text-cream">Spiritual / Cultural</h4>
                <p className="text-xs text-ink-soft">Mindful getaways &amp; retreats</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. OUR SERVICES SECTION */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          <div className="relative h-[380px] overflow-hidden rounded-sm border border-forest/10 shadow-lg lg:col-span-5">
            <Image
              src="https://images.unsplash.com/photo-1544984243-ec57ea16fe25?q=80&w=800&auto=format&fit=crop"
              alt="Services Dining"
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>

          <div className="lg:col-span-7">
            <span className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.25em] text-ink-soft">
              Our Services
            </span>
            <h2 className="mb-4 font-display text-3xl font-light leading-snug text-ink md:text-4xl">
              More Than a Stay. <br />A Complete Experience.
            </h2>
            <p className="mb-8 text-sm font-light leading-relaxed text-ink/80">
              We take care of every detail, so you can simply be present. From private chefs to
              curated activities, our services are designed to make your stay effortless.
            </p>

            <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3">
              {serviceCards.map((item) => (
                <div
                  key={item.title}
                  className="rounded-sm border border-forest/10 bg-white p-4 text-left transition-all hover:border-gold hover:shadow-md"
                >
                  <span className="mb-1 block font-display text-xs font-semibold text-ink">
                    {item.title}
                  </span>
                  <p className="text-[11px] font-light text-ink-soft">{item.desc}</p>
                </div>
              ))}
            </div>

            <Link
              href="/services"
              className="inline-flex items-center gap-2 border border-forest bg-forest px-7 py-3 text-xs uppercase tracking-[0.2em] text-cream shadow-sm transition-all hover:border-gold hover:bg-gold hover:text-ink active:scale-95"
            >
              View All Services &amp; Pricing <span>&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION STRIP */}
      <section className="relative flex h-64 items-center bg-ink">
        <Image
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1920&auto=format&fit=crop"
          alt="Sunset View"
          fill
          className="object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-forest/50" />
        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
          <div>
            <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.3em] text-gold">
              Ready for your next escape?
            </span>
            <h3 className="font-display text-2xl text-cream md:text-3xl">
              Discover a stay that feels like home — only better.
            </h3>
          </div>
          <Link
            href="/properties"
            className="border border-gold bg-gold px-8 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-ink shadow-xl transition-all hover:bg-transparent hover:text-gold active:scale-95"
          >
            Book Now &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
}
