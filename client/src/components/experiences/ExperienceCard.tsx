import Image from "next/image";
import { MapPin, CalendarClock } from "lucide-react";
import { Experience } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";

export function ExperienceCard({ experience }: { experience: Experience }) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-line/70 bg-white">
      <div className="relative aspect-[16/10] overflow-hidden">
        {experience.images[0] && (
          <Image
            src={experience.images[0]}
            alt={experience.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <div className="absolute left-4 top-4">
          <Badge className="bg-cream/90 capitalize">{experience.type}</Badge>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-display text-xl text-ink">{experience.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-soft">
          {experience.description}
        </p>
        <div className="mt-4 space-y-1.5 text-xs text-ink-soft">
          {experience.location && (
            <p className="flex items-center gap-1.5"><MapPin size={13} /> {experience.location}</p>
          )}
          {experience.scheduleNote && (
            <p className="flex items-center gap-1.5"><CalendarClock size={13} /> {experience.scheduleNote}</p>
          )}
        </div>
      </div>
    </div>
  );
}
