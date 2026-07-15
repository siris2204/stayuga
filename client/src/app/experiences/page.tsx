import { Metadata } from "next";
import { getExperiences } from "@/lib/data";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ExperienceCard } from "@/components/experiences/ExperienceCard";

export const metadata: Metadata = {
  title: "Experiences & Retreats",
  description:
    "Discover curated events and retreats hosted at Stayuga's luxury villas and farmhouses.",
};

export default async function ExperiencesPage() {
  const experiences = await getExperiences();

  return (
    <div className="py-16">
      <Container>
        <SectionHeading
          eyebrow="Experiences"
          title="Retreats, events & celebrations"
          description="From wellness retreats to farm dinners, curated moments hosted at our properties."
        />
        {experiences.length === 0 ? (
          <p className="mt-16 text-center text-ink-soft">
            No experiences are live yet — check back soon.
          </p>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {experiences.map((experience) => (
              <ExperienceCard key={experience._id} experience={experience} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
