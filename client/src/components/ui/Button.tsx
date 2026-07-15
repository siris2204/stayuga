import { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import clsx from "clsx";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-wide transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none";

const variants = {
  primary: "bg-forest text-cream hover:bg-forest-light",
  gold: "bg-gold text-ink hover:bg-gold-light",
  outline: "border border-ink/20 text-ink hover:border-ink hover:bg-ink/5",
  outlineLight: "border border-cream/40 text-cream hover:border-cream hover:bg-cream/10",
  ghost: "text-ink hover:bg-ink/5",
};

type Variant = keyof typeof variants;

export function Button({
  children,
  variant = "primary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode; variant?: Variant }) {
  return (
    <button className={clsx(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}

export function LinkButton({
  children,
  variant = "primary",
  className,
  href,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  variant?: Variant;
  href: string;
}) {
  return (
    <Link href={href} className={clsx(base, variants[variant], className)} {...props}>
      {children}
    </Link>
  );
}
