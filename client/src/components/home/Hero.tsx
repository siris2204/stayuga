"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { LinkButton } from "@/components/ui/Button";

export function Hero({ heading, subheading }: { heading: string; subheading: string }) {
  return (
    <section className="relative flex min-h-[85vh] items-end overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=2000"
        alt="A luxury villa surrounded by hills at golden hour"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/30 to-ink/10" />

      <div className="relative w-full px-6 pb-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-gold-light"
          >
            Handpicked villas &amp; farmhouses
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="max-w-3xl font-display text-4xl leading-tight text-cream sm:text-5xl lg:text-6xl"
          >
            {heading}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-5 max-w-xl text-base text-cream/85 sm:text-lg"
          >
            {subheading}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <LinkButton href="/properties" variant="gold">
              Explore properties
            </LinkButton>
            <LinkButton href="/experiences" variant="outlineLight">
              View experiences
            </LinkButton>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
