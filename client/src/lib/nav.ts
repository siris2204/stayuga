export interface NavItem {
  label: string;
  href: string;
  /** Match nested routes too, e.g. /properties/the-olive-retreat */
  matchPrefix?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Stays", href: "/properties", matchPrefix: true },
  { label: "Services", href: "/services" },
  { label: "Events", href: "/events" },
  { label: "About", href: "/about" },
];

export function isNavItemActive(pathname: string | null, item: NavItem): boolean {
  if (!pathname) return false;
  if (item.href === "/") return pathname === "/";
  return item.matchPrefix ? pathname.startsWith(item.href) : pathname === item.href;
}
