"use client";

import { usePathname } from "next/navigation";
import { getNavigationItem } from "./navigation";
import { MobileNavigation } from "./mobile-navigation";
import { ProgressSummary } from "./progress-summary";
import { UserMenu } from "./user-menu";

export function DashboardTopbar({ email, currentDate }: { email: string | null; currentDate: string }) {
  const item = getNavigationItem(usePathname());
  return <header className="dashboardTopbar"><div className="topbarLeading"><MobileNavigation email={email}/><div><p>{currentDate}</p><strong>{item.label}</strong></div></div><div className="topbarActions"><ProgressSummary compact/><UserMenu email={email}/></div></header>;
}
