import clsx from "clsx";

export function Badge({ children, className }: { children: string; className?: string }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full bg-sand px-3 py-1 text-xs font-medium uppercase tracking-wide text-ink-soft",
        className
      )}
    >
      {children}
    </span>
  );
}
