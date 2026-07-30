export const navigation = [
  { label: "Today", href: "/today", icon: "sun", description: "Your daily quest" },
  { label: "Week", href: "/week", icon: "calendar", description: "Plan the week" },
  { label: "Missions", href: "/missions", icon: "check", description: "Review every mission" },
  { label: "Focus", href: "/focus", icon: "timer", description: "Make time count" },
  { label: "Achievements", href: "/achievements", icon: "trophy", description: "Track milestones" },
  { label: "Analytics", href: "/analytics", icon: "chart", description: "Understand progress" },
  { label: "Settings", href: "/settings", icon: "settings", description: "Personalise DayQuest" },
] as const;

export type NavigationItem = (typeof navigation)[number];
export type NavigationIcon = NavigationItem["icon"];

export function isActiveRoute(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function getNavigationItem(pathname: string): NavigationItem {
  return navigation.find((item) => isActiveRoute(pathname, item.href)) ?? navigation[0];
}
