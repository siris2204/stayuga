import { LucideIcon } from "lucide-react";

export function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-2xl border border-line/70 bg-white p-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sand text-forest">
        <Icon size={18} />
      </div>
      <p className="mt-4 font-display text-3xl text-ink">{value}</p>
      <p className="mt-1 text-sm text-ink-soft">{label}</p>
    </div>
  );
}
