"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import clsx from "clsx";

const NAV_LINKS = [
  { href: "/properties", label: "Stays" },
  { href: "/services", label: "Services" },
  { href: "/events", label: "Events" },
  { href: "/about", label: "About" },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname?.startsWith("/admin") || pathname?.startsWith("/owner")) return null;

  const isHomePage = pathname === "/";
  const solid = !isHomePage || scrolled;

  return (
    <header
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        solid
          ? "bg-charcoal py-4 shadow-md border-b border-white/5"
          : "bg-black/25 backdrop-blur-md border-b border-white/10 py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-champagne-dark text-champagne transition-transform group-hover:scale-105">
            <span className="font-display text-sm font-semibold">S</span>
          </div>
          <span className="text-xl font-display font-light uppercase tracking-widest text-champagne md:text-2xl">
            Stayuga
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "text-xs uppercase tracking-widest transition-colors",
                  active ? "font-medium text-champagne" : "text-white/80 hover:text-champagne"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:block">
          <Link
            href="/properties"
            className="rounded-full border border-champagne-dark px-6 py-2 text-xs uppercase tracking-widest text-champagne transition-all hover:bg-champagne-dark hover:text-charcoal active:scale-95"
          >
            Book Now
          </Link>
        </div>

        <button
          className="p-2 text-champagne md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-charcoal md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm uppercase tracking-widest text-white/80 hover:bg-white/5 hover:text-champagne"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/properties"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full border border-champagne-dark px-6 py-2.5 text-center text-xs uppercase tracking-widest text-champagne"
            >
              Book Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
