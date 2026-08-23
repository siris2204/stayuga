import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getProperty } from "@/lib/data";
import { ApiRequestError } from "@/lib/api";
import { formatPrice } from "@/lib/format";
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
    <div className="min-h-screen bg-paper pt-20 text-paper-ink">
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* 1. TITLE BANNER */}
      <section className="relative flex h-[420px] items-end justify-start bg-black">
        {property.images[0] && (
          <Image
            src={property.images[0]}
            alt={property.title}
            fill
            priority
            className="object-cover opacity-80"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-10">
          <Link
            href="/properties"
            className="mb-4 inline-block text-xs uppercase tracking-widest text-champagne hover:underline"
          >
            &larr; Back to Stays
          </Link>
          <span className="mb-1 block text-[10px] uppercase tracking-widest text-stone-300">
            {property.location.city}, {property.location.state}
          </span>
          <h1 className="mb-3 font-display text-4xl font-light text-white md:text-5xl">
            {property.title}
          </h1>
          {property.tagline && (
            <p className="max-w-xl text-sm font-light text-white/80">{property.tagline}</p>
          )}
          <div className="mt-4 flex items-center gap-6 text-xs text-white/90">
            <span>🛏 {property.capacity.bedrooms} Bedrooms</span>
            <span>🚿 {property.capacity.bathrooms} Bathrooms</span>
            <span>🧑‍🤝‍🧑 {property.capacity.maxGuests} guests</span>
          </div>
        </div>
      </section>

      {/* 2. GALLERY & BOOKING CARD */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Gallery images={property.images} title={property.title} />
          </div>

          <div className="sticky top-24 rounded border border-stone-200 bg-white p-6 shadow-md lg:col-span-4">
            <div className="mb-6 flex items-baseline justify-between border-b border-stone-100 pb-4">
              <div>
                <span className="text-xs text-stone-500">From</span>
                <div className="font-display text-2xl font-semibold text-stone-900">
                  {formatPrice(property.pricing.basePrice, property.pricing.currency)}
                </div>
              </div>
              <span className="text-xs text-stone-500">/ night</span>
            </div>
            {property.pricing.weekendPrice && (
              <p className="-mt-4 mb-6 text-xs text-stone-500">
                Weekend rate:{" "}
                {formatPrice(property.pricing.weekendPrice, property.pricing.currency)}
              </p>
            )}

            <h3 className="mb-4 font-display text-lg text-stone-900">Enquire to book</h3>
            <BookingInquiryForm
              propertyId={property._id}
              propertyTitle={property.title}
              maxGuests={property.capacity.maxGuests}
            />
          </div>
        </div>
      </section>

      {/* 3. SPECIFICATIONS & AMENITIES */}
      <section className="mx-auto max-w-7xl border-t border-stone-200 px-6 py-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          <div>
            <span className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-bronze">
              The Stay Experience
            </span>
            <h2 className="mb-4 font-display text-3xl font-light text-stone-900">
              About this property
            </h2>
            <p className="mb-6 whitespace-pre-line text-sm font-light leading-relaxed text-stone-600">
              {property.description}
            </p>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="rounded border border-stone-200 bg-white p-4">
                <span className="mb-1 block font-semibold text-stone-900">
                  {property.capacity.bedrooms} Bedrooms
                </span>
                <span className="text-stone-500">{property.capacity.maxGuests} guests max</span>
              </div>
              <div className="rounded border border-stone-200 bg-white p-4">
                <span className="mb-1 block font-semibold text-stone-900">
                  {property.capacity.bathrooms} Bathrooms
                </span>
                <span className="text-stone-500">En-suite</span>
              </div>
            </div>

            {property.location.mapEmbedUrl && (
              <div className="mt-6 overflow-hidden rounded border border-stone-200">
                <iframe
                  src={property.location.mapEmbedUrl}
                  width="100%"
                  height="280"
                  loading="lazy"
                  title={`Map for ${property.title}`}
                />
              </div>
            )}
          </div>

          <div>
            <span className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-bronze">
              Amenities &amp; Services Included
            </span>
            <h3 className="mb-6 font-display text-2xl font-light text-stone-900">Key Details</h3>

            {property.amenities.length > 0 ? (
              <div className="grid grid-cols-2 gap-y-3 text-xs text-stone-700">
                {property.amenities.map((amenity) => (
                  <p key={amenity} className="flex items-center gap-2">
                    <span>✓</span> {amenity}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-xs text-stone-500">Amenity details coming soon.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
