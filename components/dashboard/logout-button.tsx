"use client";

import { useFormStatus } from "react-dom";

export function LogoutButton({ compact = false }: { compact?: boolean }) {
  const { pending } = useFormStatus();
  return <button className={compact ? "logoutButton compact" : "logoutButton"} type="submit" disabled={pending}>{pending ? "Signing out…" : "Sign out"}</button>;
}
