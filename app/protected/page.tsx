import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { logout } from "@/app/login/actions";

export const dynamic = "force-dynamic";
export default async function ProtectedPage() {
  const user = await getCurrentUser(); if (!user) redirect("/login");
  return <main className="shell"><span className="eyebrow">Authenticated</span><h1>Protected page</h1><p className="notice">Signed in as {user.email ?? user.id} with the {user.role} role.</p><form action={logout}><button className="button" type="submit">Sign out</button></form></main>;
}
