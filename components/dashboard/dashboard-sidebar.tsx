import Link from "next/link";
import { logout } from "@/app/login/actions";
import { navigation } from "./navigation";
import { NavItem } from "./nav-item";
import { LogoutButton } from "./logout-button";
import { getUserInitials } from "./user-menu";

export function DashboardSidebar({ email }: { email: string | null }) {
  return <aside className="dashboardSidebar" aria-label="Primary navigation"><Link className="wordmark" href="/today"><span aria-hidden="true">D</span>DayQuest</Link><nav>{navigation.map((item) => <NavItem item={item} key={item.href}/>)}</nav><div className="sidebarProfile"><span className="avatar" aria-hidden="true">{getUserInitials(email)}</span><span><strong>Quest keeper</strong><small>{email ?? "Authenticated user"}</small></span></div><form action={logout}><LogoutButton/></form></aside>;
}
