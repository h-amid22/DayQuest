import { describe, expect, it } from "vitest";
import { isActiveRoute, navigation } from "./navigation";

describe("dashboard navigation", () => {
  it("uses unique destination paths", () => {
    const paths = navigation.map(({ href }) => href);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("matches exact and nested active routes without matching siblings", () => {
    expect(isActiveRoute("/today", "/today")).toBe(true);
    expect(isActiveRoute("/missions/archive", "/missions")).toBe(true);
    expect(isActiveRoute("/todayish", "/today")).toBe(false);
    expect(isActiveRoute("/week", "/today")).toBe(false);
  });
});
