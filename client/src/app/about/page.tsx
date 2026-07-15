import { Metadata } from "next";
import Image from "next/image";
import { getContent } from "@/lib/data";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ValueProps } from "@/components/home/ValueProps";
import { CtaSection } from "@/components/home/CtaSection";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Stayuga's mission to curate soulful, handpicked luxury stays.",
};

export default async function AboutPage() {
  const { blocks } = await getContent();
  const mission = blocks["about-mission"] ?? {
    heading: "Our mission",
    body: "Stayuga curates a small, handpicked portfolio of luxury villas and farmhouses, each personally vetted for design, service, and setting.",
  };

  return (
    <div>
      <section className="relative flex h-[50vh] items-end overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1613977257363-707ba9348227?w=2000"
          alt="A sunlit farmhouse veranda"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/30 to-ink/10" />
        <Container className="relative pb-16">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-gold-light">
            About Stayuga
          </p>
          <h1 className="max-w-2xl font-display text-4xl text-cream sm:text-5xl">
            Curating soulful stays, one property at a time
          </h1>
        </Container>
      </section>

      <section className="py-20">
        <Container className="max-w-3xl">
          <SectionHeading title={mission.heading} />
          <p className="mt-6 whitespace-pre-line text-lg leading-relaxed text-ink-soft">
            {mission.body}
          </p>
        </Container>
      </section>

      <ValueProps />
      <CtaSection />
    </div>
  );
}
