import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Phone, Mail } from "lucide-react";
import { emptyContent, getContent } from "@/lib/data";
import { ValueProps } from "@/components/about/ValueProps";
import { Testimonials } from "@/components/about/Testimonials";
import { DEFAULT_CONTACT } from "@/lib/contact";

export const metadata: Metadata = {
  title: "About",
  description:
    "Stayuga is Hyderabad's one-stop farmhouse company — premium stays, dining, décor and full event management under a single point of contact.",
};

/** The five things we actually deliver, in the order guests ask for them. */
const PILLARS = [
  { n: "01", title: "Premium Stays", copy: "Farmhouses chosen for privacy, space and keeping." },
  { n: "02", title: "Food & Catering", copy: "From a chef's table for eight to a banquet for three hundred." },
  { n: "03", title: "Décor & Themes", copy: "Styled to the occasion, built on site." },
  { n: "04", title: "Event Management", copy: "Run end to end, from walkthrough to wrap." },
  { n: "05", title: "Hospitality", copy: "A trained on-ground team for the length of your stay." },
];

export default async function AboutPage() {
  const { blocks, faqs, testimonials } = await getContent().catch(emptyContent);
  const contact = blocks["contact-info"] ?? DEFAULT_CONTACT;
  const mission = blocks["about-mission"] ?? {
    heading: "A family anniversary, and far too many phone calls.",
    body: "The farmhouse was beautiful. Everything else — the caterer, the decorator, the coordinator — was six separate conversations and one long, anxious week.\n\nStayuga exists so that week never happens to anyone else. One number, one team, and a day you get to actually attend.",
  };
  const missionParagraphs = mission.body.split("\n\n");

  return (
    <div className="min-h-screen bg-cream pt-20 text-ink">
      {/* ---------------- 1 · PHILOSOPHY ---------------- */}
      <section className="mx-auto max-w-3xl px-6 py-16 text-center">
        <span className="eyebrow mb-3 text-ink-soft">Our Philosophy</span>
        <h1 className="font-display mb-6 text-4xl font-light text-ink md:text-5xl">
          Focus on the celebration.
          <br />
          Leave the coordination to us.
        </h1>
        <p className="text-base font-light leading-relaxed text-ink-soft">
          Stayuga is Hyderabad&rsquo;s one-stop farmhouse company — stay, table, styling and event,
          arranged by a single team.
        </p>
      </section>

      {/* ---------------- 2 · ORIGIN ---------------- */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 py-12 md:grid-cols-2">
        <div className="relative h-96 w-full overflow-hidden border border-line">
          <Image
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop"
            alt="Interior of a Stayuga farmhouse"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div>
          <span className="eyebrow mb-3 text-gold">How it started</span>
          <h2 className="font-display mb-4 text-3xl font-light text-ink">{mission.heading}</h2>
          {missionParagraphs.map((p, i) => (
            <p key={i} className="mb-4 text-sm font-light leading-relaxed text-ink-soft last:mb-0">
              {p}
            </p>
          ))}
        </div>
      </section>

      {/* ---------------- 3 · WHAT WE DO ---------------- */}
      <section className="border-t border-line py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 text-center">
            <span className="eyebrow mb-3 text-ink-soft">What we do</span>
            <h2 className="font-display text-3xl font-light text-ink">Five parts, one team</h2>
          </div>

          <div className="grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
            {PILLARS.map(({ n, title, copy }) => (
              <div key={n} className="bg-cream p-6">
                <span className="font-display text-sm text-gold">{n}</span>
                <h3 className="font-display mt-3 text-lg font-normal text-ink">{title}</h3>
                <p className="mt-2 text-sm font-light leading-relaxed text-ink-soft">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- 4 · WHY STAYUGA ---------------- */}
      <section className="border-t border-line">
        <ValueProps />
      </section>

      {/* ---------------- 5 · FAQ ---------------- */}
      {faqs.length > 0 && (
        <section className="mx-auto max-w-3xl border-t border-line px-6 py-16">
          <div className="mb-10 text-center">
            <span className="eyebrow mb-2 text-ink-soft">Common questions</span>
            <h2 className="font-display text-3xl font-light text-ink">Before you ask</h2>
          </div>

          {/*
            Native <details> rather than useState — this keeps the page a server
            component, works without JS, and gives us open/close semantics for
            screen readers for free.
          */}
          <div className="divide-y divide-line border border-line bg-shell">
            {faqs.map((faq) => (
              <details key={faq._id} className="group p-5">
                <summary className="font-display flex cursor-pointer list-none items-center justify-between gap-4 text-base text-ink">
                  {faq.question}
                  <ChevronDown
                    size={18}
                    className="shrink-0 text-gold transition-transform group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <p className="mt-3 text-sm font-light leading-relaxed text-ink-soft">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* ---------------- 6 · CONCIERGE ---------------- */}
      <section className="bg-ink py-16 text-cream">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <span className="eyebrow mb-3 text-gold">Get in touch</span>
          <h2 className="font-display mb-8 text-3xl font-light">Talk to a concierge</h2>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8">
            <a
              href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`}
              className="flex items-center gap-2.5 text-sm transition-colors hover:text-gold-light"
            >
              <Phone size={15} className="text-gold" aria-hidden="true" />
              {contact.phone}
            </a>

            <a
              href={`mailto:${contact.email}`}
              className="flex items-center gap-2.5 text-sm transition-colors hover:text-gold-light"
            >
              <Mail size={15} className="text-gold" aria-hidden="true" />
              {contact.email}
            </a>
          </div>

          <Link
            href="/contact"
            className="mt-10 inline-flex items-center gap-3 bg-gold px-8 py-3.5 text-[11px] font-medium uppercase tracking-[0.25em] text-ink transition-colors hover:bg-gold-light"
          >
            <span>Send an enquiry</span>
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </section>

      {/* ---------------- 7 · GUEST STORIES ---------------- */}
      <Testimonials testimonials={testimonials} />
    </div>
  );
}
