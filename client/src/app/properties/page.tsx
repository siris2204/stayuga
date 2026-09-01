import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getProperties } from "@/lib/data";
import { formatPrice } from "@/lib/format";
import { StayFilters } from "@/components/properties/StayFilters";

export const metadata: Metadata = {
  title: "Luxury Villas & Farmhouses",
  description:
    "Browse Stayuga's handpicked collection of luxury villas and farmhouses across India.",
};

interface PageProps {
  searchParams: Promise<{
    type?: string;
    city?: string;
    minGuests?: string;
    checkIn?: string;
    checkOut?: string;
    sort?: string;
  }>;
}

export default async function PropertiesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filters: Record<string, string> = {};
  if (params.type) filters.type = params.type;
  if (params.city) filters.city = params.city;
  if (params.minGuests) filters.minGuests = params.minGuests;
  if (params.checkIn) filters.checkIn = params.checkIn;
  if (params.checkOut) filters.checkOut = params.checkOut;

  const properties = await getProperties(filters).catch(() => []);

  if (params.sort === "price-low") {
    properties.sort((a, b) => a.pricing.basePrice - b.pricing.basePrice);
  } else if (params.sort === "price-high") {
    properties.sort((a, b) => b.pricing.basePrice - a.pricing.basePrice);
  }

  return (
    <div className="min-h-screen bg-shell text-[#1c1417]">
      {/* Hero Banner */}
      <section className="relative flex h-[560px] items-center bg-[#181113]">
        <Image
          src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1920&auto=format&fit=crop"
          alt="Curated Stays Hero"
          fill
          priority
          className="object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-16">
          <div className="mb-4 flex items-center gap-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">
              Our Villas
            </span>
            <span className="h-px w-10 bg-gold" />
          </div>
          <h1 className="mb-5 max-w-2xl font-display text-4xl font-light leading-tight text-shell md:text-6xl">
            Curated Stays in <br />
            Extraordinary Locations
          </h1>
          <p className="max-w-md text-sm font-light leading-relaxed text-shell/80">
            From coastal escapes to mountain retreats, our villas are handpicked for their unique
            charm, privacy and effortless luxury.
          </p>
        </div>
      </section>

      {/* Floating Filter Box */}
      <div className="mb-16">
        <StayFilters
          type={params.type}
          city={params.city}
          minGuests={params.minGuests}
          checkIn={params.checkIn}
          checkOut={params.checkOut}
          sort={params.sort}
        />
      </div>

      {/* Header Info Section */}
      <section className="mx-auto mb-8 flex max-w-7xl items-center justify-between px-6 text-xs uppercase tracking-widest">
        <span className="text-[11px] font-semibold tracking-[0.2em] text-stone-700">
          {params.type || params.city || params.minGuests || params.checkIn ? "Filtered Villas" : "Featured Villas"}
        </span>
        <span className="text-[11px] font-normal normal-case tracking-normal text-stone-400">
          {properties.length} {properties.length === 1 ? "villa" : "villas"} found
        </span>
      </section>

      {/* Property Cards Grid */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        {properties.length === 0 ? (
          <p className="py-16 text-center text-sm text-stone-500">
            No properties match those filters yet — try adjusting your search.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <Link
                key={property._id}
                href={`/properties/${property.slug}`}
                className="group flex flex-col overflow-hidden rounded-lg border border-stone-200/70 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-72 w-full overflow-hidden">
                  {property.images[0] && (
                    <Image
                      src={property.images[0]}
                      alt={property.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  )}
                  {property.featured && (
                    <span className="absolute left-4 top-4 rounded-xs bg-stone-900/90 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-xs">
                      Featured
                    </span>
                  )}
                </div>

                <div className="flex flex-grow flex-col justify-between bg-white p-6">
                  <div>
                    <div className="mb-2 flex items-center gap-1.5 text-stone-500">
                      <MapPinIcon />
                      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500">
                        {property.location.city}, {property.location.state}
                      </span>
                    </div>

                    <h3 className="mb-4 font-display text-2xl leading-snug text-stone-900 transition-colors group-hover:text-gold">
                      {property.title}
                    </h3>

                    <div className="mb-6 flex items-center gap-5 text-[11px] text-stone-600">
                      <span>🛏 {property.capacity.bedrooms} Bedrooms</span>
                      <span>🚿 {property.capacity.bathrooms} Bathrooms</span>
                      <span className="capitalize">🏡 {property.type}</span>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center justify-between border-t border-stone-100 pt-4">
                    <div className="font-display text-xl font-medium text-stone-900">
                      {formatPrice(property.pricing.basePrice, property.pricing.currency)}{" "}
                      <span className="font-sans text-xs font-normal text-stone-400">/ night</span>
                    </div>
                    <span className="text-lg text-stone-800 transition-all group-hover:translate-x-1.5 group-hover:text-gold">
                      &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Banner / Value Proposition Bottom Section */}
      <section className="grid grid-cols-1 border-t border-stone-200 bg-sand lg:grid-cols-12">
        <div className="relative flex h-[360px] flex-col justify-between overflow-hidden p-8 md:p-14 lg:col-span-8">
          <Image
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1600&auto=format&fit=crop"
            alt="Extraordinary Experiences"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/85 via-stone-950/50 to-transparent" />
          <div className="relative z-10">
            <span className="mb-3 block text-[10px] font-semibold uppercase tracking-[0.25em] text-gold">
              Your Perfect Stay Awaits
            </span>
            <h2 className="font-display text-3xl font-light leading-tight text-shell md:text-4xl">
              Extraordinary Villas. <br />
              Unforgettable Experiences.
            </h2>
          </div>
          <div className="relative z-10 pt-6">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 bg-gold px-6 py-3 text-xs font-semibold uppercase tracking-widest text-ink transition-colors hover:bg-gold-light"
            >
              <span>Explore Services</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-6 bg-shell p-8 md:p-12 lg:col-span-4">
          {[
            { label: "Curated stay" },
            { label: "Personalized Concierge" },
            { label: "No Extra Costs" },
            { label: "Memorable Experiences" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-4">
              <span className="h-2 w-2 shrink-0 rounded-full bg-gold" />
              <span className="text-xs tracking-wider text-stone-700">{item.label}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function MapPinIcon() {
  return (
    <svg className="h-3.5 w-3.5 shrink-0 stroke-current text-gold" viewBox="0 0 24 24" fill="none" strokeWidth={2}>
      <path d="M12 21s-6-5.333-6-10a6 6 0 0 1 12 0c0 4.667-6 10-6 10z" />
      <circle cx="12" cy="11" r="2" />
    </svg>
  );
}
