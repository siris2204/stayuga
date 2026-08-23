import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getProperties } from "@/lib/data";
import { formatPrice } from "@/lib/format";
import { PropertyFilters } from "@/components/properties/PropertyFilters";

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

  return (
    <div className="min-h-screen bg-cream pt-20 text-ink">
      {/* Hero Banner */}
      <section className="relative flex h-[420px] items-end justify-start bg-ink">
        <Image
          src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1920&auto=format&fit=crop"
          alt="Curated Stays Hero"
          fill
          priority
          className="object-cover opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-14">
          <span className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">
            Our Stays
          </span>
          <h1 className="mb-4 font-display text-4xl font-light leading-tight text-cream md:text-5xl">
            Curated Stays in <br />
            Extraordinary Locations
          </h1>
          <p className="max-w-lg text-sm font-light leading-relaxed text-cream/80">
            From coastal escapes to mountain retreats, each stay is handpicked for its character,
            comfort, and private charm.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex items-start gap-8">
          <div className="sticky top-24 hidden w-72 shrink-0 self-start lg:block">
            <PropertyFilters
              type={params.type}
              city={params.city}
              minGuests={params.minGuests}
              checkIn={params.checkIn}
              checkOut={params.checkOut}
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-6 lg:hidden">
              <PropertyFilters
                type={params.type}
                city={params.city}
                minGuests={params.minGuests}
                checkIn={params.checkIn}
                checkOut={params.checkOut}
              />
            </div>

            {properties.length === 0 ? (
              <p className="mt-16 text-center text-ink-soft">
                No properties match those filters yet — try adjusting your search.
              </p>
            ) : (
              <>
                <p className="mb-6 text-sm text-ink-soft">
                  {properties.length} {properties.length === 1 ? "property" : "properties"} found
                </p>
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
                  {properties.map((property) => (
                    <Link
                      key={property._id}
                      href={`/properties/${property.slug}`}
                      className="group flex flex-col overflow-hidden rounded-sm border border-forest/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
                    >
                      <div className="relative h-64 w-full overflow-hidden">
                        {property.images[0] && (
                          <Image
                            src={property.images[0]}
                            alt={property.title}
                            fill
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          />
                        )}
                        <span className="absolute left-3 top-3 rounded bg-ink/85 px-2.5 py-1 text-[10px] uppercase tracking-widest text-cream">
                          {property.type}
                        </span>
                      </div>

                      <div className="flex flex-grow flex-col justify-between bg-white p-6">
                        <div>
                          <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-soft">
                            {property.location.city}, {property.location.state}
                          </span>
                          <h3 className="mb-2 font-display text-xl text-ink transition-colors group-hover:text-gold">
                            {property.title}
                          </h3>

                          <div className="mb-3 flex items-center gap-4 text-xs text-ink-soft">
                            <span>🛏 {property.capacity.bedrooms} Beds</span>
                            <span>🚿 {property.capacity.bathrooms} Baths</span>
                            <span>🧑‍🤝‍🧑 {property.capacity.maxGuests} guests</span>
                          </div>

                          {property.tagline && (
                            <p className="mb-6 line-clamp-2 text-xs font-light leading-relaxed text-ink/70">
                              {property.tagline}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between border-t border-stone-100 pt-4">
                          <div className="text-base font-semibold text-ink">
                            {formatPrice(property.pricing.basePrice, property.pricing.currency)}{" "}
                            <span className="text-xs font-normal text-ink-soft">/ night</span>
                          </div>
                          <span className="text-xs font-semibold uppercase tracking-[0.15em] text-gold transition-transform group-hover:translate-x-1">
                            View &rarr;
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
