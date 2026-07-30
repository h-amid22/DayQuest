import { beforeEach, describe, expect, it, vi } from "vitest";

const signOut = vi.fn().mockResolvedValue({ error: null });
const redirect = vi.fn(() => { throw new Error("NEXT_REDIRECT"); });
vi.mock("next/navigation", () => ({ redirect }));
vi.mock("@/lib/supabase/server", () => ({ createServerSupabaseClient: vi.fn().mockResolvedValue({ auth: { signOut } }) }));

describe("logout", () => {
  beforeEach(() => { signOut.mockClear(); redirect.mockClear(); });

  it("uses Supabase server sign-out and returns to login", async () => {
    const { logout } = await import("./actions");
    await expect(logout()).rejects.toThrow("NEXT_REDIRECT");
    expect(signOut).toHaveBeenCalledOnce();
    expect(redirect).toHaveBeenCalledWith("/login");
  });
});
