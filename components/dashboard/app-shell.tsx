import type { ReactNode } from "react";
import { DashboardSidebar } from "./dashboard-sidebar";
import { DashboardTopbar } from "./dashboard-topbar";

export function AppShell({ children, email, currentDate }: { children: ReactNode; email: string | null; currentDate: string }) {
  return <div className="appShell"><a className="skipLink" href="#dashboard-content">Skip to content</a><DashboardSidebar email={email}/><div className="dashboardColumn"><DashboardTopbar email={email} currentDate={currentDate}/><main className="dashboardContent" id="dashboard-content" tabIndex={-1}>{children}</main></div></div>;
}
