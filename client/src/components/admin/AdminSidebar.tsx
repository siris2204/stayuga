"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { LayoutDashboard, Home, CalendarCheck, Users, FileText, LogOut } from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";

const LINKS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/properties", label: "Properties", icon: Home },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/admin/leads", label: "Leads", icon: Users },
  { href: "/admin/content", label: "Content", icon: FileText },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { admin, logout } = useAdminAuth();

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-line/70 bg-white">
      <div className="border-b border-line/70 px-6 py-6">
        <p className="font-display text-xl text-ink">Stayuga</p>
        <p className="text-xs text-ink-soft">Admin panel</p>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-6">
        {LINKS.map((link) => {
          const Icon = link.icon;
          const active = pathname?.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-forest text-cream" : "text-ink-soft hover:bg-sand hover:text-ink"
              )}
            >
              <Icon size={17} /> {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-line/70 p-4">
        <p className="truncate px-2 text-xs text-ink-soft">{admin?.email}</p>
        <button
          onClick={() => {
            logout();
            router.push("/admin/login");
          }}
          className="mt-2 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-ink-soft hover:bg-sand hover:text-ink"
        >
          <LogOut size={16} /> Log out
        </button>
      </div>
    </aside>
  );
}
