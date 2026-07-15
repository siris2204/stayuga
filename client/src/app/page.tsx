import { getContent, getExperiences, getProperties } from "@/lib/data";
import { Hero } from "@/components/home/Hero";
import { ValueProps } from "@/components/home/ValueProps";
import { FeaturedProperties } from "@/components/home/FeaturedProperties";
import { ExperiencesTeaser } from "@/components/home/ExperiencesTeaser";
import { Testimonials } from "@/components/home/Testimonials";
import { CtaSection } from "@/components/home/CtaSection";

export default async function Home() {
  const [properties, experiences, content] = await Promise.all([
    getProperties({ featured: "true" }),
    getExperiences(),
    getContent(),
  ]);

  const hero = content.blocks["homepage-hero"] ?? {
    heading: "Curated stays where nature, comfort, and memories meet",
    subheading: "Handpicked villas and farmhouses for the moments worth slowing down for.",
  };

  return (
    <>
      <Hero heading={hero.heading} subheading={hero.subheading} />
      <ValueProps />
      <FeaturedProperties properties={properties} />
      <ExperiencesTeaser experiences={experiences.slice(0, 3)} />
      <Testimonials />
      <CtaSection />
    </>
  );
}
