import type { NextRequest } from "next/server";
import { z, type ZodType } from "zod";

export function getRequestId(request: Request): string { return request.headers.get("x-request-id") ?? crypto.randomUUID(); }
export async function parseJson<T>(request: NextRequest | Request, schema: ZodType<T>): Promise<T> {
  const body: unknown = await request.json();
  return schema.parse(body);
}
export function isValidationError(error: unknown): error is z.ZodError { return error instanceof z.ZodError; }
