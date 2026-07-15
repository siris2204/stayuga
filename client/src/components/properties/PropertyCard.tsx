import Image from "next/image";
import Link from "next/link";
import { BedDouble, Users, MapPin } from "lucide-react";
import { Property } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { Badge } from "@/components/ui/Badge";

export function PropertyCard({ property }: { property: Property }) {
  return (
    <Link
      href={`/properties/${property.slug}`}
      className="group block overflow-hidden rounded-2xl border border-line/70 bg-white transition-shadow hover:shadow-xl hover:shadow-ink/5"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {property.images[0] && (
          <Image
            src={property.images[0]}
            alt={property.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <div className="absolute left-4 top-4">
          <Badge className="bg-cream/90 capitalize">{property.type}</Badge>
        </div>
      </div>

      <div className="p-5">
        <p className="flex items-center gap-1.5 text-xs text-ink-soft">
          <MapPin size={13} /> {property.location.city}, {property.location.state}
        </p>
        <h3 className="mt-1.5 font-display text-xl text-ink">{property.title}</h3>
        {property.tagline && (
          <p className="mt-1 line-clamp-1 text-sm text-ink-soft">{property.tagline}</p>
        )}

        <div className="mt-4 flex items-center gap-4 text-xs text-ink-soft">
          <span className="flex items-center gap-1"><Users size={14} /> {property.capacity.maxGuests} guests</span>
          <span className="flex items-center gap-1"><BedDouble size={14} /> {property.capacity.bedrooms} beds</span>
        </div>

        <div className="mt-4 flex items-baseline justify-between border-t border-line/70 pt-4">
          <span className="font-display text-lg text-ink">
            {formatPrice(property.pricing.basePrice, property.pricing.currency)}
          </span>
          <span className="text-xs text-ink-soft">per night</span>
        </div>
      </div>
    </Link>
  );
}
