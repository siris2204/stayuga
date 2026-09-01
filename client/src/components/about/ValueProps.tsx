import { KeyRound, Sparkles, ShieldCheck, HeartHandshake } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * The four claims that separate us from a venue-listing site. Kept short —
 * this section is scanned, not read.
 */
const VALUES = [
  {
    icon: KeyRound,
    title: "One point of contact",
    description: "Venue, food, décor and events on a single contract.",
  },
  {
    icon: Sparkles,
    title: "Personally vetted",
    description: "Every farmhouse is visited before it joins the collection.",
  },
  {
    icon: ShieldCheck,
    title: "Consistent standards",
    description: "The same hygiene and service bar at every property.",
  },
  {
    icon: HeartHandshake,
    title: "Hosted, not rented",
    description: "An on-ground team that anticipates rather than reacts.",
  },
];

export function ValueProps() {
  return (
    <section className="py-20">
      <Container>
        <SectionHeading eyebrow="Why Stayuga" title="Hospitality, considered" align="center" />
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map(({ icon: Icon, title, description }) => (
            <div key={title} className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sand text-forest">
                <Icon size={22} strokeWidth={1.5} aria-hidden="true" />
              </div>
              <h3 className="font-display mt-5 text-lg text-ink">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
