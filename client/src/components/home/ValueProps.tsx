import { Sparkles, HeartHandshake, UserCheck, BookHeart } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const VALUES = [
  {
    icon: Sparkles,
    title: "Handpicked Premium Stays",
    description: "Every villa and farmhouse is personally visited and vetted before it joins our portfolio.",
  },
  {
    icon: HeartHandshake,
    title: "Exceptional Guest Experience",
    description: "From the first enquiry to check-out, our team is on hand to make every detail effortless.",
  },
  {
    icon: UserCheck,
    title: "Expertly Trained Staff",
    description: "On-ground caretakers and chefs trained to deliver warm, attentive hospitality.",
  },
  {
    icon: BookHeart,
    title: "Memories, Not Just Stays",
    description: "Thoughtfully designed spaces and experiences built for the moments worth remembering.",
  },
];

export function ValueProps() {
  return (
    <section className="py-24">
      <Container>
        <SectionHeading eyebrow="Why Stayuga" title="Hospitality, considered" align="center" />
        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map(({ icon: Icon, title, description }) => (
            <div key={title} className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sand text-forest">
                <Icon size={24} />
              </div>
              <h3 className="mt-5 font-display text-lg text-ink">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
