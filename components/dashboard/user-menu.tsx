import { logout } from "@/app/login/actions";
import { LogoutButton } from "./logout-button";

export function getUserInitials(email: string | null): string {
  if (!email) return "DQ";
  const name = email.split("@")[0];
  const parts = name.split(/[._-]+/).filter(Boolean);
  return (parts.length > 1 ? `${parts[0][0]}${parts[1][0]}` : name.slice(0, 2)).toUpperCase();
}

export function UserMenu({ email }: { email: string | null }) {
  return <details className="userMenu"><summary aria-label="Open user menu"><span className="avatar" aria-hidden="true">{getUserInitials(email)}</span><span className="userMeta"><strong>Quest keeper</strong><small>{email ?? "Authenticated user"}</small></span><span aria-hidden="true">⌄</span></summary><div className="userMenuPanel"><p><strong>Signed in</strong><span>{email ?? "Secure account"}</span></p><a href="/settings">Account settings</a><form action={logout}><LogoutButton compact/></form></div></details>;
}
