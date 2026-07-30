"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { logout } from "@/app/login/actions";
import { navigation } from "./navigation";
import { NavItem } from "./nav-item";
import { LogoutButton } from "./logout-button";

export function MobileNavigation({ email }: { email: string | null }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();

  useEffect(() => { dialogRef.current?.close(); }, [pathname]);

  function open() { dialogRef.current?.showModal(); }
  function close() { dialogRef.current?.close(); }

  return <><button className="mobileMenuTrigger" type="button" onClick={open} aria-label="Open navigation menu"><span/><span/><span/></button><dialog className="mobileNavDialog" ref={dialogRef} onClick={(event) => { if (event.target === dialogRef.current) close(); }}><div className="mobileNavPanel"><div className="mobileNavHeader"><Link className="wordmark" href="/today" onClick={close}><span aria-hidden="true">D</span>DayQuest</Link><button className="iconButton" type="button" onClick={close} aria-label="Close navigation menu">×</button></div><p className="mobileAccount">Signed in as <strong>{email ?? "authenticated user"}</strong></p><nav aria-label="Mobile navigation">{navigation.map((item) => <NavItem item={item} key={item.href} onNavigate={close}/>)}</nav><form action={logout}><LogoutButton/></form></div></dialog></>;
}
