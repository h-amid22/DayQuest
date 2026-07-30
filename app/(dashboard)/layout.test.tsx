import { describe, expect, it, vi } from "vitest";

const redirect = vi.fn(() => { throw new Error("NEXT_REDIRECT"); });
vi.mock("next/navigation", () => ({ redirect, usePathname: () => "/today" }));
vi.mock("@/lib/auth/current-user", () => ({ getCurrentUser: vi.fn().mockResolvedValue(null) }));
vi.mock("@/app/login/actions", () => ({ logout: vi.fn() }));

describe("dashboard authentication", () => {
  it("redirects unauthenticated dashboard access to login", async () => {
    const { default: DashboardLayout } = await import("./layout");
    await expect(DashboardLayout({ children: <p>Private</p> })).rejects.toThrow("NEXT_REDIRECT");
    expect(redirect).toHaveBeenCalledWith("/login");
  });
});
