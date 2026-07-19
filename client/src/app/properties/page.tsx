import { Metadata } from "next";
import { getProperties } from "@/lib/data";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PropertyFilters } from "@/components/properties/PropertyFilters";
import { PropertyCard } from "@/components/properties/PropertyCard";

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

  const properties = await getProperties(filters);

  return (
    <div className="py-16">
      <Container>
        <SectionHeading
          eyebrow="Our collection"
          title="Villas & farmhouses"
          description="Every property is personally vetted for design, comfort, and setting."
        />

        <div className="mt-10 flex items-start gap-8">
          {/* Left sidebar — sticky filters */}
          <div className="hidden lg:block w-72 shrink-0 sticky top-24 self-start">
            <PropertyFilters
              type={params.type}
              city={params.city}
              minGuests={params.minGuests}
              checkIn={params.checkIn}
              checkOut={params.checkOut}
            />
          </div>

          {/* Right — property grid */}
          <div className="flex-1 min-w-0">
            {/* Mobile filters (above cards on small screens) */}
            <div className="lg:hidden mb-6">
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
                    <PropertyCard key={property._id} property={property} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
