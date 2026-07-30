import type { ReactNode } from "react";

export function PlaceholderPanel({ title, description, children, className = "" }: { title: string; description?: string; children?: ReactNode; className?: string }) {
  return <section className={`placeholderPanel ${className}`.trim()}><div className="panelHeading"><h2>{title}</h2>{description && <p>{description}</p>}</div>{children}</section>;
}

export function ComingNextButton({ children }: { children: ReactNode }) {
  return <button className="button comingNext" type="button" disabled>{children}<span>Coming next</span></button>;
}
