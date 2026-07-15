import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const TESTIMONIALS = [
  {
    quote:
      "Every detail felt considered — from the welcome hamper to the sunset views. It didn't feel like a rental, it felt like a home we'd always had.",
    author: "Ritika & Arjun",
    context: "Ananta Villa, Kasauli",
  },
  {
    quote:
      "We hosted our anniversary dinner at Blue Lagoon and the team handled everything effortlessly. Genuinely the most relaxed we've been planning an event.",
    author: "Meera S.",
    context: "Blue Lagoon Farmhouse",
  },
  {
    quote:
      "The orchard breakfast alone was worth the trip. Beautifully kept property and a caretaker who anticipated everything we needed.",
    author: "Kunal D.",
    context: "Meadow House Farmstay",
  },
];

export function Testimonials() {
  return (
    <section className="bg-forest py-24">
      <Container>
        <SectionHeading eyebrow="Guest stories" title="What our guests remember" align="center" light />
        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure key={t.author} className="rounded-2xl border border-cream/10 bg-cream/5 p-8">
              <blockquote className="font-display text-lg leading-relaxed text-cream/90">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 text-sm text-gold-light">
                {t.author} <span className="text-cream/50">— {t.context}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
