import type { NextRequest } from "next/server";
import { z } from "zod";
import { apiError } from "@/lib/api/response";
import { getRequestId } from "@/lib/api/request";
import { getCurrentUser } from "@/lib/auth/current-user";
import { logger } from "@/lib/logger";
import { rateLimit } from "@/lib/rate-limit";
import { TaskError } from "./task-errors";

type MutationLimit = { key: string; limit: number };

export async function taskApi(request: NextRequest | Request, handler: (user: { id: string; email: string | null }, requestId: string) => Promise<Response>, mutation?: MutationLimit): Promise<Response> {
  const requestId = getRequestId(request);
  try {
    const user = await getCurrentUser();
    if (!user) return apiError("UNAUTHORIZED", "Authentication required", 401, { requestId });
    if (mutation && !rateLimit(`tasks:${mutation.key}:${user.id}`, { limit: mutation.limit, windowMs: 60_000 }).allowed) return apiError("RATE_LIMITED", "Too many requests", 429, { requestId });
    return await handler(user, requestId);
  } catch (error) {
    if (error instanceof z.ZodError || error instanceof SyntaxError) return apiError("INVALID_INPUT", "Request is invalid", 400, { requestId });
    if (error instanceof TaskError) return apiError(error.code, error.message, error.status, { requestId });
    logger.error("Task API request failed", { requestId, errorName: error instanceof Error ? error.name : "UnknownError" });
    return apiError("INTERNAL_ERROR", "Unable to process the request", 500, { requestId });
  }
}

export async function parseOptionalJson(request: Request): Promise<unknown> {
  const text = await request.text();
  return text.trim() ? JSON.parse(text) : {};
}
