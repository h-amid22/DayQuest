import { describe, expect, it, vi } from "vitest";

const redirect = vi.fn(() => { throw new Error("NEXT_REDIRECT"); });
vi.mock("next/navigation", () => ({ redirect }));

describe("protected route compatibility", () => {
  it("redirects the old protected URL to today", async () => {
    const { default: ProtectedCompatibilityPage } = await import("./page");
    expect(() => ProtectedCompatibilityPage()).toThrow("NEXT_REDIRECT");
    expect(redirect).toHaveBeenCalledWith("/today");
  });
});
