import {
  Bath,
  BedDouble,
  BellRing,
  Camera,
  Car,
  ChefHat,
  Flame,
  Flower2,
  Music,
  PartyPopper,
  PawPrint,
  Snowflake,
  Sparkles,
  Trees,
  Tv,
  Users,
  Utensils,
  Waves,
  Wifi,
  type LucideIcon,
} from "lucide-react";
import type { IconKey } from "@/lib/addOnServices";

/**
 * Single source of truth for iconography on the property page.
 */
export const ICONS: Record<IconKey, LucideIcon> = {
  bed: BedDouble,
  bath: Bath,
  pool: Waves,
  guests: Users,
  wifi: Wifi,
  parking: Car,
  ac: Snowflake,
  kitchen: Utensils,
  fireplace: Flame,
  housekeeping: Sparkles,
  concierge: BellRing,
  chef: ChefHat,
  wellness: Flower2,
  pets: PawPrint,
  tv: Tv,
  garden: Trees,
  bonfire: Flame,
  photography: Camera,
  decor: PartyPopper,
  transport: Car,
  spa: Flower2,
  music: Music,
};

/** Best-effort keyword match from a free-text amenity label to an icon. */
export function guessAmenityIcon(label: string): IconKey {
  const l = label.toLowerCase();
  if (l.includes("wifi") || l.includes("wi-fi")) return "wifi";
  if (l.includes("pool")) return "pool";
  if (l.includes("park")) return "parking";
  if (l.includes("air condition") || l === "ac" || l.includes(" ac")) return "ac";
  if (l.includes("kitchen")) return "kitchen";
  if (l.includes("bonfire")) return "bonfire";
  if (l.includes("fire")) return "fireplace";
  if (l.includes("housekeep")) return "housekeeping";
  if (l.includes("pet")) return "pets";
  if (l.includes("tv") || l.includes("theatre") || l.includes("theater")) return "tv";
  if (l.includes("garden") || l.includes("lawn")) return "garden";
  if (l.includes("chef")) return "chef";
  if (l.includes("spa") || l.includes("yoga") || l.includes("wellness")) return "spa";
  if (l.includes("power") || l.includes("generator") || l.includes("backup")) return "concierge";
  if (l.includes("lake") || l.includes("view")) return "garden";
  return "concierge";
}

export function AmenityIcon({
  name,
  size = 16,
  className,
}: {
  name: IconKey;
  size?: number;
  className?: string;
}) {
  const Icon = ICONS[name] ?? Sparkles;
  return <Icon size={size} strokeWidth={1.6} className={className} aria-hidden="true" />;
}
