"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X, ChevronRight } from "lucide-react";
import { NAV_ITEMS, isNavItemActive } from "@/lib/nav";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const reduceMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);

  /* --- shrink / solidify header on scroll --- */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* --- close the drawer whenever the route changes --- */
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  /* --- lock body scroll + trap Esc while drawer is open --- */
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    panelRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (pathname?.startsWith("/admin") || pathname?.startsWith("/owner")) return null;

  const solid = !isHomePage || scrolled || open;

  return (
    <>
      <header
        className={[
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          solid
            ? "bg-ink-deep shadow-md py-3 md:py-4 border-b border-white/5"
            : "bg-black/25 backdrop-blur-md border-b border-white/10 py-4 md:py-5",
        ].join(" ")}
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          {/* Brand */}
          <Link href="/" className="group flex shrink-0 items-center" aria-label="Stayuga home">
            <Image
              src="/logo.svg"
              alt="Stayuga"
              width={200}
              height={60}
              priority
              className="h-9 w-auto object-contain transition-opacity group-hover:opacity-90 sm:h-10 md:h-12"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 lg:flex xl:gap-8" aria-label="Primary">
            {NAV_ITEMS.map((item) => {
              const active = isNavItemActive(pathname, item);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={[
                    "link-inline relative py-1 uppercase tracking-widest transition-all duration-300 origin-center",
                    active
                      ? "text-gold-light font-bold text-[13px] scale-[1.08]"
                      : "text-white/75 font-normal text-xs hover:text-gold-light hover:scale-[1.03]",
                  ].join(" ")}
                >
                  {item.label}
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-0.5 left-0 right-0 h-[2px] rounded-full bg-gold-light"
                      transition={
                        reduceMotion
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 480, damping: 34 }
                      }
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right side action */}
          <div className="flex items-center gap-2">
            <Link
              href="/properties"
              className="hidden rounded-full border border-gold px-5 py-2 text-[11px] uppercase tracking-widest text-gold-light transition-all hover:bg-gold hover:text-ink-deep active:scale-95 sm:inline-flex sm:items-center xl:px-6 xl:text-xs"
            >
              Reserve
            </Link>

            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-nav"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-gold-light transition-colors hover:bg-white/10 active:scale-95 lg:hidden"
            >
              <AnimatePresence mode="wait" initial={false}>
                {open ? (
                  <motion.span
                    key="x"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: reduceMotion ? 0 : 0.18 }}
                  >
                    <X size={22} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: reduceMotion ? 0 : 0.18 }}
                  >
                    <Menu size={22} />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

      {/* Drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="scrim"
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.2 }}
              onClick={() => setOpen(false)}
            />

            <motion.div
              key="panel"
              id="mobile-nav"
              ref={panelRef}
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
              className="fixed right-0 top-0 z-50 flex h-[100dvh] w-[86%] max-w-sm flex-col bg-ink-deep shadow-2xl outline-none lg:hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 340, damping: 36 }
              }
            >
              <div
                className="flex items-center justify-between border-b border-white/10 px-5"
                style={{ height: "var(--header-h)" }}
              >
                <Image
                  src="/logo.svg"
                  alt="Stayuga"
                  width={160}
                  height={48}
                  className="h-9 w-auto object-contain"
                />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="flex h-11 w-11 items-center justify-center rounded-full text-gold-light transition-colors hover:bg-white/10 active:scale-95"
                >
                  <X size={22} />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Mobile">
                {NAV_ITEMS.map((item, i) => {
                  const active = isNavItemActive(pathname, item);
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={
                        reduceMotion
                          ? { duration: 0 }
                          : { delay: 0.05 + i * 0.045, duration: 0.3, ease: [0.22, 1, 0.36, 1] }
                      }
                    >
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        onClick={() => setOpen(false)}
                        className={[
                          "group flex items-center justify-between rounded-xl px-4 py-3.5 transition-colors",
                          active
                            ? "bg-white/[0.07] text-gold-light"
                            : "text-white/75 hover:bg-white/5 hover:text-gold-light",
                        ].join(" ")}
                      >
                        <span
                          className={[
                            "uppercase tracking-[0.18em] transition-all duration-300",
                            active ? "text-[15px] font-bold" : "text-[13px] font-light",
                          ].join(" ")}
                        >
                          {item.label}
                        </span>
                        <ChevronRight
                          size={16}
                          className={
                            active
                              ? "text-gold-light"
                              : "text-white/25 transition-transform group-hover:translate-x-0.5"
                          }
                        />
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              <div
                className="border-t border-white/10 px-5 pt-4"
                style={{ paddingBottom: "calc(1rem + var(--safe-bottom))" }}
              >
                <Link
                  href="/properties"
                  onClick={() => setOpen(false)}
                  className="flex w-full items-center justify-center rounded-full bg-gold px-6 py-3 text-xs font-semibold uppercase tracking-widest text-ink-deep transition-transform active:scale-95"
                >
                  Reserve a Stay
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Header;
