import { describe, expect, it } from "vitest";
import { parseServerEnv } from "./env";

const valid = { DATABASE_URL: "postgresql://localhost/app", DIRECT_URL: "postgresql://localhost/app", NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co", NEXT_PUBLIC_SUPABASE_ANON_KEY: "public-key" };
describe("environment validation", () => {
  it("accepts valid configuration", () => { expect(parseServerEnv(valid)).toMatchObject(valid); });
  it("rejects invalid configuration", () => { expect(() => parseServerEnv({ ...valid, NEXT_PUBLIC_SUPABASE_URL: "not-a-url" })).toThrow(); });
});
