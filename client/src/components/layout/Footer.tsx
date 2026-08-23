"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Phone, MapPin } from "lucide-react";
import { InstagramIcon, FacebookIcon, YoutubeIcon } from "@/components/ui/SocialIcons";
import { apiFetch } from "@/lib/api";
import { ContactInfo, ContentBlocks } from "@/lib/types";

const DEFAULT_CONTACT: ContactInfo = {
  email: "hello@stayuga.com",
  phone: "+91 00000 00000",
  location: "Hyderabad, India",
};

export function Footer() {
  const pathname = usePathname();
  const [contact, setContact] = useState<ContactInfo>(DEFAULT_CONTACT);

  useEffect(() => {
    apiFetch<{ blocks: ContentBlocks }>("/api/content")
      .then((data) => {
        if (data.blocks["contact-info"]) setContact(data.blocks["contact-info"]);
      })
      .catch(() => {});
  }, []);

  if (pathname?.startsWith("/admin") || pathname?.startsWith("/owner")) return null;

  return (
    <footer className="border-t border-white/5 bg-charcoal py-14 text-xs text-champagne">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 md:grid-cols-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-full border border-champagne-dark text-champagne">
              <span className="font-display text-xs">S</span>
            </div>
            <span className="text-xl font-display font-light uppercase tracking-widest">Stayuga</span>
          </div>
          <p className="text-xs tracking-wide leading-relaxed text-stone-400">
            Curated · Effortless · Memorable
          </p>
          <p className="text-[11px] text-stone-500">
            Curated stays where nature, comfort, and memories meet.
          </p>
          <div className="flex gap-4 pt-1 text-stone-300">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="transition-colors hover:text-champagne"
            >
              <InstagramIcon width={18} height={18} />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="transition-colors hover:text-champagne"
            >
              <FacebookIcon width={18} height={18} />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
              className="transition-colors hover:text-champagne"
            >
              <YoutubeIcon width={18} height={18} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-champagne-dark">
            Navigation
          </h4>
          <ul className="space-y-2 text-stone-300">
            <li><Link href="/properties" className="transition-colors hover:text-white">Stays</Link></li>
            <li><Link href="/services" className="transition-colors hover:text-white">Services</Link></li>
            <li><Link href="/events" className="transition-colors hover:text-white">Events</Link></li>
            <li><Link href="/experiences" className="transition-colors hover:text-white">Experiences</Link></li>
            <li><Link href="/about" className="transition-colors hover:text-white">About &amp; FAQ</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-champagne-dark">
            Support
          </h4>
          <ul className="space-y-2 text-stone-300">
            <li><Link href="/contact" className="transition-colors hover:text-white">Contact</Link></li>
            <li><Link href="/policies/terms" className="transition-colors hover:text-white">Terms &amp; Conditions</Link></li>
            <li><Link href="/policies/privacy" className="transition-colors hover:text-white">Privacy Policy</Link></li>
            <li><Link href="/policies/cancellation" className="transition-colors hover:text-white">Cancellation Policy</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-champagne-dark">
            Contact
          </h4>
          <div className="space-y-2 text-xs text-stone-400">
            <p className="flex items-center gap-2">
              <Mail size={14} className="text-champagne-dark" /> {contact.email}
            </p>
            <p className="flex items-center gap-2">
              <Phone size={14} className="text-champagne-dark" /> {contact.phone}
            </p>
            <p className="flex items-center gap-2">
              <MapPin size={14} className="text-champagne-dark" /> {contact.location}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-white/5 px-6 pt-6 text-[11px] text-stone-500 sm:flex-row">
        <div>&copy; {new Date().getFullYear()} Stayuga. All rights reserved.</div>
        <div>Handpicked villas &amp; farmhouses across India.</div>
      </div>
    </footer>
  );
}
