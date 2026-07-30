import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth/current-user", () => ({ getCurrentUser: vi.fn().mockResolvedValue(null) }));
vi.mock("@/lib/logger", () => ({ logger: { error: vi.fn() } }));
import { taskApi } from "./task-api";

describe("task API authentication", () => {
  it("rejects unauthenticated requests before invoking task logic", async () => {
    const handler = vi.fn();
    const response = await taskApi(new Request("http://localhost/api/tasks"), handler);
    expect(response.status).toBe(401);
    expect(handler).not.toHaveBeenCalled();
    await expect(response.json()).resolves.toMatchObject({ ok: false, error: { code: "UNAUTHORIZED" } });
  });
});
