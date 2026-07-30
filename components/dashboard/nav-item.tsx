"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavIcon } from "./nav-icon";
import { isActiveRoute, type NavigationItem } from "./navigation";

export function NavItem({ item, onNavigate }: { item: NavigationItem; onNavigate?: () => void }) {
  const pathname = usePathname();
  const active = isActiveRoute(pathname, item.href);
  return <Link className="dashboardNavItem" href={item.href} aria-current={active ? "page" : undefined} onClick={onNavigate}><NavIcon name={item.icon}/><span><strong>{item.label}</strong><small>{item.description}</small></span></Link>;
}
