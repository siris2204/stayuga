import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";

export function CtaSection() {
  return (
    <section className="py-24">
      <Container>
        <div className="rounded-3xl bg-sand px-8 py-16 text-center sm:px-16">
          <h2 className="font-display text-3xl text-ink sm:text-4xl">
            Ready to plan your escape?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-ink-soft">
            Tell us your dates and headcount — our team will help you find the right villa or
            farmhouse and take care of the rest.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <LinkButton href="/properties" variant="primary">
              Browse properties
            </LinkButton>
            <LinkButton href="/contact" variant="outline">
              Talk to our team
            </LinkButton>
          </div>
        </div>
      </Container>
    </section>
  );
}
