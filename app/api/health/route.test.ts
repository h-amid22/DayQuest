import { describe, expect, it } from "vitest";
import { GET } from "./route";

describe("GET /api/health", () => {
  it("returns a safe operational response", async () => {
    const response = await GET(new Request("http://localhost/api/health", { headers: { "x-request-id": "test-request" } }));
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ ok: true, data: { status: "ok" }, requestId: "test-request" });
  });
});
