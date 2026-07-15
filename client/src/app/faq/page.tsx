import { Metadata } from "next";
import { ChevronDown } from "lucide-react";
import { getContent } from "@/lib/data";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers to common questions about booking and staying with Stayuga.",
};

export default async function FaqPage() {
  const { faqs } = await getContent();

  return (
    <div className="py-16">
      <Container className="max-w-3xl">
        <SectionHeading eyebrow="Support" title="Frequently asked questions" align="center" />

        <div className="mt-12 divide-y divide-line/70 rounded-2xl border border-line/70 bg-white">
          {faqs.map((faq) => (
            <details key={faq._id} className="group p-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-ink">
                {faq.question}
                <ChevronDown size={18} className="shrink-0 text-ink-soft transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{faq.answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </div>
  );
}
