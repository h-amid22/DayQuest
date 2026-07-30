import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DayQuest",
  description: "A gamified day planner for planning missions, building streaks, and levelling up each day.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
