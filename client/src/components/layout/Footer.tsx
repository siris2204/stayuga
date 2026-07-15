"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { InstagramIcon, FacebookIcon, YoutubeIcon } from "@/components/ui/SocialIcons";

export function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="mt-32 border-t border-line/70 bg-forest text-cream">
      <Container className="grid grid-cols-1 gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-2xl">Stayuga</p>
          <p className="mt-3 text-sm leading-relaxed text-cream/70">
            Curated stays where nature, comfort, and memories meet.
          </p>
          <div className="mt-5 flex gap-4 text-cream/70">
            <InstagramIcon width={18} height={18} className="hover:text-gold-light" />
            <FacebookIcon width={18} height={18} className="hover:text-gold-light" />
            <YoutubeIcon width={18} height={18} className="hover:text-gold-light" />
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-light">Explore</p>
          <ul className="mt-4 space-y-2 text-sm text-cream/80">
            <li><Link href="/properties" className="hover:text-cream">Properties</Link></li>
            <li><Link href="/experiences" className="hover:text-cream">Experiences</Link></li>
            <li><Link href="/about" className="hover:text-cream">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-cream">Contact</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-light">Support</p>
          <ul className="mt-4 space-y-2 text-sm text-cream/80">
            <li><Link href="/faq" className="hover:text-cream">FAQ</Link></li>
            <li><Link href="/policies/terms" className="hover:text-cream">Terms &amp; Conditions</Link></li>
            <li><Link href="/policies/privacy" className="hover:text-cream">Privacy Policy</Link></li>
            <li><Link href="/policies/cancellation" className="hover:text-cream">Cancellation Policy</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-light">Get in touch</p>
          <ul className="mt-4 space-y-3 text-sm text-cream/80">
            <li className="flex items-center gap-2">
              <Mail size={16} /> hello@stayuga.com
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} /> +91 00000 00000
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-cream/10 py-6">
        <Container className="flex flex-col items-center justify-between gap-2 text-xs text-cream/50 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Stayuga. All rights reserved.</p>
          <p>Handpicked villas &amp; farmhouses across India.</p>
        </Container>
      </div>
    </footer>
  );
}
