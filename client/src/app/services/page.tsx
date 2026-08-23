import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Services & Experiences",
  description: "Bespoke concierge, dining, wellness, and transport services for your Stayuga stay.",
};

const serviceList = [
  {
    title: "Private Chef & Fine Dining",
    desc: "Personalized multi-course meals prepared fresh daily with locally sourced ingredients.",
    price: "From $120 / person",
    image: "https://images.unsplash.com/photo-1544984243-ec57ea16fe25?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Dedicated 24/7 Concierge",
    desc: "Flight arrangements, VIP restaurant bookings, yacht charters, and emergency support.",
    price: "Included with every stay",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Wellness, Yoga & Spa",
    desc: "Private yoga instructors, sunrise meditation sessions, and in-villa deep tissue massages.",
    price: "From $90 / session",
    image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Luxury Transport & Chauffeur",
    desc: "Airport transfers, luxury SUV day hires, and private helicopter charters.",
    price: "From $150 / day",
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=800&auto=format&fit=crop",
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-paper pt-20 text-paper-ink">
      <section className="mx-auto max-w-5xl px-6 py-16 text-center">
        <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.2em] text-bronze">
          Tailored Luxury
        </span>
        <h1 className="mb-6 font-display text-4xl font-light text-paper-ink md:text-5xl">
          Our Services &amp; Experiences
        </h1>
        <p className="mx-auto max-w-2xl text-sm font-light leading-relaxed text-stone-600">
          Every stay includes access to our end-to-end hospitality team. Customize your getaway
          with bespoke add-ons designed for effortless living.
        </p>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 pb-24 md:grid-cols-2">
        {serviceList.map((service) => (
          <div
            key={service.title}
            className="flex flex-col overflow-hidden rounded border border-stone-200 bg-white shadow-sm transition-shadow hover:shadow-md md:flex-row"
          >
            <div className="relative h-48 md:h-auto md:w-1/2">
              <Image src={service.image} alt={service.title} fill className="object-cover" />
            </div>
            <div className="flex flex-col justify-between p-6 md:w-1/2">
              <div>
                <h3 className="mb-2 font-display text-lg text-paper-ink">{service.title}</h3>
                <p className="mb-4 text-xs font-light leading-relaxed text-stone-500">
                  {service.desc}
                </p>
              </div>
              <div className="flex items-center justify-between border-t border-stone-100 pt-4">
                <span className="text-xs font-semibold text-bronze">{service.price}</span>
                <Link
                  href="/properties"
                  className="text-xs font-semibold uppercase tracking-wider text-paper-ink transition-colors hover:text-bronze"
                >
                  Book &rarr;
                </Link>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
