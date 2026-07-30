import { describe, expect, it } from "vitest";
import { calendarDate, isCalendarDate, planningDate } from "./task-time";

describe("planning dates", () => {
  it("round trips a date without server timezone dependence", () => { expect(calendarDate(planningDate("2026-07-30"))).toBe("2026-07-30"); });
  it("rejects impossible calendar dates", () => { expect(isCalendarDate("2026-02-29")).toBe(false); });
});
