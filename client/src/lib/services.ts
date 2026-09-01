import {
  BellRing, Camera, Car, ChefHat, Flower2, Music,
  PartyPopper, Sparkles, Trees, Utensils, type LucideIcon,
} from "lucide-react";

/**
 * The service catalogue, split the way guests actually shop for it:
 *
 *   "stay"  — what we arrange around a booked farmhouse
 *   "event" — what we arrange when the farmhouse is the venue
 *
 * Both the home page and /services read from here so wording and pricing
 * can't drift apart between the two.
 *
 * `priceFrom` is a rupee amount rendered through `formatPrice`, so currency
 * formatting stays consistent with the property pages. `null` means the
 * service carries no separate charge.
 */

export type ServiceCategory = "stay" | "event";

export interface ServiceItem {
  title: string;
  /** One line. Keep it short — these sit in tight cards. */
  desc: string;
  icon: LucideIcon;
  category: ServiceCategory;
  /** Rupees. `null` renders as "Included". */
  priceFrom: number | null;
  /** Suffix shown after the price, e.g. "per guest". */
  unit?: string;
  image: string;
}

export const SERVICES: ServiceItem[] = [
  /* ---------------- Stay services ---------------- */
  {
    title: "Private Chef",
    desc: "A menu written around your table, cooked in your kitchen.",
    icon: ChefHat,
    category: "stay",
    priceFrom: 1200,
    unit: "per guest",
    image:
      "https://images.unsplash.com/photo-1544984243-ec57ea16fe25?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Concierge",
    desc: "One number. Any hour of your stay.",
    icon: BellRing,
    category: "stay",
    priceFrom: null,
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Wellness & Spa",
    desc: "Sunrise yoga, therapists who come to you.",
    icon: Flower2,
    category: "stay",
    priceFrom: 2500,
    unit: "per session",
    image:
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Chauffeur",
    desc: "Airport to gate, and everywhere between.",
    icon: Car,
    category: "stay",
    priceFrom: 4500,
    unit: "per day",
    image:
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Housekeeping",
    desc: "Discreet, twice daily.",
    icon: Sparkles,
    category: "stay",
    priceFrom: null,
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Excursions",
    desc: "Lakes, trails and temples worth the early start.",
    icon: Trees,
    category: "stay",
    priceFrom: 3000,
    unit: "per group",
    image:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800&auto=format&fit=crop",
  },

  /* ---------------- Event services ---------------- */
  {
    title: "Event Management",
    desc: "One team from first walkthrough to last guest.",
    icon: PartyPopper,
    category: "event",
    priceFrom: 75000,
    unit: "per event",
    image:
      "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Décor & Theming",
    desc: "Built to your occasion, not pulled off a shelf.",
    icon: Sparkles,
    category: "event",
    priceFrom: 35000,
    unit: "per event",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Catering & Bar",
    desc: "Regional, continental or entirely your own.",
    icon: Utensils,
    category: "event",
    priceFrom: 950,
    unit: "per guest",
    image:
      "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Photography & Film",
    desc: "The day, kept properly.",
    icon: Camera,
    category: "event",
    priceFrom: 25000,
    unit: "per event",
    image:
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Entertainment",
    desc: "Live sets, DJs and sound, tuned to the space.",
    icon: Music,
    category: "event",
    priceFrom: 18000,
    unit: "per event",
    image:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Celebrations",
    desc: "Anniversaries, birthdays, reunions — handled.",
    icon: PartyPopper,
    category: "event",
    priceFrom: 20000,
    unit: "per event",
    image:
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop",
  },
];

export const STAY_SERVICES = SERVICES.filter((s) => s.category === "stay");
export const EVENT_SERVICES = SERVICES.filter((s) => s.category === "event");
