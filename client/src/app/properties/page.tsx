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
  searchParams: Promise<{ type?: string; city?: string; minGuests?: string }>;
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

        <div className="mt-10">
          <PropertyFilters type={params.type} city={params.city} minGuests={params.minGuests} />
        </div>

        {properties.length === 0 ? (
          <p className="mt-16 text-center text-ink-soft">
            No properties match those filters yet — try adjusting your search.
          </p>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
