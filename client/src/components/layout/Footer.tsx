"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Phone, Mail } from "lucide-react";
import { NAV_ITEMS } from "@/lib/nav";
import { CONCIERGE_EMAIL, CONCIERGE_TEL_DISPLAY, INSTAGRAM_URL, WHATSAPP_URL } from "@/lib/contact";
import { apiFetch } from "@/lib/api";
import { ContactInfo, ContentBlocks } from "@/lib/types";

/*
  Motion here deliberately mirrors the header drawer: the same spring-ish
  cubic-bezier, the same ~45ms stagger between siblings, the same small
  travel distance. The footer reveals on scroll instead of on open, so it
  uses `whileInView` with `once` — it should feel like the header arriving,
  not like a looping attract animation.
*/

const EASE = [0.22, 1, 0.36, 1] as const;

const columns: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.045, delayChildren: 0.05 },
  },
};

const column: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
};

const DEFAULT_CONTACT: ContactInfo = {
  email: CONCIERGE_EMAIL,
  phone: CONCIERGE_TEL_DISPLAY,
  location: "Hyderabad, India",
};

/** Nav link with the same gold underline wipe the header uses for hover. */
function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="group link-inline relative inline-block text-white/70 transition-colors hover:text-gold-light">
      {children}
      <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-gold-light transition-transform duration-300 ease-out group-hover:scale-x-100" />
    </Link>
  );
}

function Social({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      whileHover={reduceMotion ? undefined : { y: -3, scale: 1.06 }}
      whileTap={reduceMotion ? undefined : { scale: 0.94 }}
      transition={{ type: "spring", stiffness: 420, damping: 24 }}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/70 transition-colors hover:border-gold hover:text-gold-light"
    >
      {children}
    </motion.a>
  );
}

export function Footer() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [contact, setContact] = useState<ContactInfo>(DEFAULT_CONTACT);

  const hidden = pathname?.startsWith("/admin") || pathname?.startsWith("/owner");

  useEffect(() => {
    if (hidden) return;
    apiFetch<{ blocks: ContentBlocks }>("/api/content")
      .then((data) => {
        if (data.blocks["contact-info"]) setContact(data.blocks["contact-info"]);
      })
      .catch(() => {});
  }, [hidden]);

  if (hidden) return null;

  return (
    <footer className="border-t border-white/5 bg-ink-deep py-16 text-xs text-white/70">
      <motion.div
        variants={columns}
        initial={reduceMotion ? "show" : "hidden"}
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 md:grid-cols-4"
      >
        {/* Brand */}
        <motion.div variants={column} className="space-y-4">
          <Link href="/" className="group inline-block" aria-label="Stayuga home">
            <Image
              src="/logo.svg"
              alt="Stayuga"
              width={260}
              height={78}
              className="h-14 w-auto object-contain transition-opacity group-hover:opacity-90 md:h-16"
            />
          </Link>
          <p className="text-sm tracking-wide text-gold-light">
            Curated · Effortless · Memorable
          </p>
        </motion.div>

        {/* Navigation */}
        <motion.div variants={column}>
          <h4 className="eyebrow mb-5 text-gold">Navigation</h4>
          <ul className="space-y-3">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <FooterLink href={item.href}>{item.label}</FooterLink>
              </li>
            ))}
            <li>
              <FooterLink href="/contact">Contact</FooterLink>
            </li>
          </ul>
        </motion.div>

        {/* Contact */}
        <motion.div variants={column}>
          <h4 className="eyebrow mb-5 text-gold">Concierge</h4>
          <div className="space-y-3">
            <a
              href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`}
              className="flex items-center gap-2.5 transition-colors hover:text-gold-light"
            >
              <Phone size={14} className="shrink-0 text-gold" />
              <span>{contact.phone}</span>
            </a>
            <a
              href={`mailto:${contact.email}`}
              className="flex items-center gap-2.5 transition-colors hover:text-gold-light"
            >
              <Mail size={14} className="shrink-0 text-gold" />
              <span className="break-all">{contact.email}</span>
            </a>
          </div>
        </motion.div>

        {/* Social */}
        <motion.div variants={column}>
          <h4 className="eyebrow mb-5 text-gold">Follow</h4>
          <div className="flex items-center gap-3.5">
            <Social href={INSTAGRAM_URL} label="Instagram">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.13-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </Social>

            <Social href={WHATSAPP_URL} label="WhatsApp">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
            </Social>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
        className="mx-auto mt-12 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-white/5 px-6 pt-6 text-[11px] text-white/40 sm:flex-row"
      >
        <div>&copy; {new Date().getFullYear()} Stayuga. All rights reserved.</div>
        <div>Farmhouse stays, dining, décor &amp; events — Hyderabad</div>
      </motion.div>
    </footer>
  );
}

export default Footer;
