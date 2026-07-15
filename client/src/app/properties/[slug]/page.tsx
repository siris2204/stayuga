import { Metadata } from "next";
import { notFound } from "next/navigation";
import { BedDouble, Bath, Users, MapPin, Check } from "lucide-react";
import { getProperty } from "@/lib/data";
import { ApiRequestError } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Gallery } from "@/components/properties/Gallery";
import { BookingInquiryForm } from "@/components/properties/BookingInquiryForm";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function fetchPropertyOr404(slug: string) {
  try {
    return await getProperty(slug);
  } catch (err) {
    if (err instanceof ApiRequestError && err.status === 404) notFound();
    throw err;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = await fetchPropertyOr404(slug);
  return {
    title: property.title,
    description: property.tagline || property.description.slice(0, 155),
    openGraph: {
      images: property.images.slice(0, 1),
    },
  };
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const property = await fetchPropertyOr404(slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: property.title,
    description: property.description,
    image: property.images,
    address: {
      "@type": "PostalAddress",
      streetAddress: property.location.address,
      addressLocality: property.location.city,
      addressRegion: property.location.state,
    },
  };

  return (
    <div className="py-12">
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Container>
        <div className="mb-6">
          <Badge className="mb-3 capitalize">{property.type}</Badge>
          <h1 className="font-display text-3xl text-ink sm:text-4xl">{property.title}</h1>
          {property.tagline && <p className="mt-2 text-ink-soft">{property.tagline}</p>}
          <p className="mt-2 flex items-center gap-1.5 text-sm text-ink-soft">
            <MapPin size={15} /> {property.location.address}, {property.location.city},{" "}
            {property.location.state}
          </p>
        </div>

        <Gallery images={property.images} title={property.title} />

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="space-y-10 lg:col-span-2">
            <div className="flex flex-wrap gap-6 rounded-2xl border border-line/70 bg-white p-6">
              <span className="flex items-center gap-2 text-sm text-ink">
                <Users size={18} className="text-forest" /> {property.capacity.maxGuests} guests
              </span>
              <span className="flex items-center gap-2 text-sm text-ink">
                <BedDouble size={18} className="text-forest" /> {property.capacity.bedrooms} bedrooms
              </span>
              <span className="flex items-center gap-2 text-sm text-ink">
                <Bath size={18} className="text-forest" /> {property.capacity.bathrooms} bathrooms
              </span>
            </div>

            <section>
              <h2 className="font-display text-2xl text-ink">About this property</h2>
              <p className="mt-4 whitespace-pre-line leading-relaxed text-ink-soft">
                {property.description}
              </p>
            </section>

            {property.amenities.length > 0 && (
              <section>
                <h2 className="font-display text-2xl text-ink">Amenities</h2>
                <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {property.amenities.map((amenity) => (
                    <li key={amenity} className="flex items-center gap-2 text-sm text-ink-soft">
                      <Check size={16} className="text-forest" /> {amenity}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {property.location.mapEmbedUrl && (
              <section>
                <h2 className="font-display text-2xl text-ink">Location</h2>
                <div className="mt-4 overflow-hidden rounded-2xl border border-line/70">
                  <iframe
                    src={property.location.mapEmbedUrl}
                    width="100%"
                    height="320"
                    loading="lazy"
                    title={`Map for ${property.title}`}
                  />
                </div>
              </section>
            )}
          </div>

          <aside className="lg:col-span-1">
            <div className="sticky top-28 rounded-2xl border border-line/70 bg-white p-6">
              <div className="flex items-baseline justify-between">
                <span className="font-display text-2xl text-ink">
                  {formatPrice(property.pricing.basePrice, property.pricing.currency)}
                </span>
                <span className="text-sm text-ink-soft">/ night</span>
              </div>
              {property.pricing.weekendPrice && (
                <p className="mt-1 text-xs text-ink-soft">
                  Weekend rate: {formatPrice(property.pricing.weekendPrice, property.pricing.currency)}
                </p>
              )}

              <div className="mt-6 border-t border-line/70 pt-6">
                <h3 className="mb-4 font-display text-lg text-ink">Enquire to book</h3>
                <BookingInquiryForm
                  propertyId={property._id}
                  propertyTitle={property.title}
                  maxGuests={property.capacity.maxGuests}
                />
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </div>
  );
}
