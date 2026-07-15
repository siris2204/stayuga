import { Metadata } from "next";
import { Mail, Phone, MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the Stayuga team for enquiries, events, and bookings.",
};

export default function ContactPage() {
  return (
    <div className="py-16">
      <Container>
        <SectionHeading
          eyebrow="Get in touch"
          title="We'd love to help you plan your stay"
          description="Share a few details and our team will respond within a day — or reach us directly below."
        />

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-1">
            <div className="rounded-2xl border border-line/70 bg-white p-6">
              <div className="flex items-start gap-3">
                <Mail size={18} className="mt-0.5 text-forest" />
                <div>
                  <p className="text-sm font-medium text-ink">Email</p>
                  <p className="text-sm text-ink-soft">hello@stayuga.com</p>
                </div>
              </div>
              <div className="mt-5 flex items-start gap-3">
                <Phone size={18} className="mt-0.5 text-forest" />
                <div>
                  <p className="text-sm font-medium text-ink">Phone</p>
                  <p className="text-sm text-ink-soft">+91 00000 00000</p>
                </div>
              </div>
              <div className="mt-5 flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 text-forest" />
                <div>
                  <p className="text-sm font-medium text-ink">Office</p>
                  <p className="text-sm text-ink-soft">Hyderabad, India</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-line/70 bg-white p-8 lg:col-span-2">
            <ContactForm />
          </div>
        </div>
      </Container>
    </div>
  );
}
