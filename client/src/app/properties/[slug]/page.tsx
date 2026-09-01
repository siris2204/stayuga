import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProperty } from "@/lib/data";
import { ApiRequestError } from "@/lib/api";
import { PropertyDetailClient } from "@/components/properties/PropertyDetailClient";

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
    <>
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PropertyDetailClient property={property} />
    </>
  );
}
