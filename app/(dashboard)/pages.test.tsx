import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import TodayPage from "./today/page";
import WeekPage from "./week/page";
import MissionsPage from "./missions/page";
import FocusPage from "./focus/page";
import AchievementsPage from "./achievements/page";
import AnalyticsPage from "./analytics/page";
import SettingsPage from "./settings/page";

const pages = [
  [TodayPage, "Today’s Quest"],
  [WeekPage, "Your Week"],
  [MissionsPage, "Missions"],
  [FocusPage, "Focus"],
  [AchievementsPage, "Achievements"],
  [AnalyticsPage, "Analytics"],
  [SettingsPage, "Settings"],
] as const;

describe("dashboard placeholder pages", () => {
  it.each(pages)("renders the %s page heading", (Page, heading) => {
    render(<Page/>);
    expect(screen.getByRole("heading", { level: 1, name: heading })).toBeInTheDocument();
  });
});
