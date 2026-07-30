import { describe, expect, it } from "vitest";
import { apiError, apiSuccess } from "./response";

describe("API response helpers", () => {
  it("wraps successful data", async () => { const response = apiSuccess({ value: 1 }, { status: 201 }, { requestId: "abc" }); expect(response.status).toBe(201); await expect(response.json()).resolves.toEqual({ ok: true, data: { value: 1 }, requestId: "abc" }); });
  it("uses stable public errors", async () => { const response = apiError("INVALID_INPUT", "Request is invalid", 400); await expect(response.json()).resolves.toEqual({ ok: false, error: { code: "INVALID_INPUT", message: "Request is invalid" } }); });
});
