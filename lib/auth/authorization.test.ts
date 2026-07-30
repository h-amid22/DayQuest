import { describe, expect, it } from "vitest";
import { getRole, hasRole, requireRole } from "./authorization";

describe("authorization", () => {
  it("defaults unknown users to USER", () => { expect(getRole({ role: "OWNER" })).toBe("USER"); });
  it("supports hierarchical roles", () => { expect(hasRole("ADMIN", "MANAGER")).toBe(true); expect(hasRole("USER", "MANAGER")).toBe(false); });
  it("throws when a role is insufficient", () => { expect(() => requireRole("USER", "ADMIN")).toThrow(/permission/); });
});
