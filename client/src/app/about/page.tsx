import { Metadata } from "next";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { emptyContent, getContent } from "@/lib/data";
import { ValueProps } from "@/components/home/ValueProps";
import { Testimonials } from "@/components/home/Testimonials";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Stayuga's mission to curate soulful, handpicked luxury stays.",
};

export default async function AboutPage() {
  const { blocks, faqs, testimonials } = await getContent().catch(emptyContent);
  const mission = blocks["about-mission"] ?? {
    heading: "More than a stay — it's a feeling.",
    body: "Stayuga curates a small, handpicked portfolio of luxury villas and farmhouses, each personally vetted for design, service, and setting. We bridge the gap between world-class boutique hospitality and the intimacy of private residential living.",
  };

  return (
    <div className="min-h-screen bg-cream pt-20 text-ink">
      {/* 1. HERO PHILOSOPHY */}
      <section className="mx-auto max-w-5xl px-6 py-16 text-center">
        <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.25em] text-ink-soft">
          Our Philosophy
        </span>
        <h1 className="mb-6 font-display text-4xl font-light text-ink md:text-5xl">
          About Stayuga
        </h1>
        <p className="mx-auto max-w-2xl text-base font-light leading-relaxed text-ink/80">
          At Stayuga, we believe a great stay is more than just a destination — it&apos;s a curated
          feeling. Every villa is handpicked for its soul, character, and tranquility.
        </p>
      </section>

      {/* 2. NARRATIVE */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 py-12 md:grid-cols-2">
        <div className="relative h-96 w-full overflow-hidden rounded-sm border border-forest/10 shadow-lg">
          <Image
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop"
            alt="Stayuga Villa Interior"
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h2 className="mb-4 font-display text-3xl font-light text-ink">{mission.heading}</h2>
          <p className="whitespace-pre-line text-sm font-light leading-relaxed text-ink/80">
            {mission.body}
          </p>
        </div>
      </section>

      {/* 3. WHY STAYUGA */}
      <section className="border-t border-forest/10 py-12">
        <ValueProps />
      </section>

      {/* 4. FAQ ACCORDION */}
      {faqs.length > 0 && (
        <section className="mx-auto max-w-4xl border-t border-forest/10 px-6 py-16">
          <div className="mb-10 text-center">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.25em] text-ink-soft">
              Common Inquiries
            </span>
            <h2 className="font-display text-3xl font-light text-ink">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq._id}
                className="group rounded-sm border border-forest/10 bg-white p-5 shadow-sm transition-all hover:border-gold"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-sm font-medium text-ink">
                  {faq.question}
                  <ChevronDown size={16} className="shrink-0 text-gold transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-3 border-t border-stone-100 pt-3 text-xs font-light leading-relaxed text-ink/75">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* 5. CONTACT CONCIERGE */}
      <section className="border-t border-forest bg-ink py-16 text-cream">
        <div className="mx-auto max-w-3xl px-6">
          <div className="mb-8 text-center">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.25em] text-gold">
              Get in Touch
            </span>
            <h2 className="font-display text-3xl font-light text-cream">Contact Concierge</h2>
          </div>

          <div className="rounded-sm border border-cream/10 bg-cream p-6 sm:p-8">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* 6. GUEST STORIES */}
      <Testimonials testimonials={testimonials} />
    </div>
  );
}
