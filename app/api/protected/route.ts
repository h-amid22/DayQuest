import { apiError, apiSuccess } from "@/lib/api/response";
import { getRequestId } from "@/lib/api/request";
import { getCurrentUser } from "@/lib/auth/current-user";
import { rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  const requestId = getRequestId(request); const user = await getCurrentUser();
  if (!user) return apiError("UNAUTHORIZED", "Authentication required", 401, { requestId });
  const result = rateLimit(`protected:${user.id}`, { limit: 30, windowMs: 60_000 });
  if (!result.allowed) return apiError("RATE_LIMITED", "Too many requests", 429, { requestId });
  return apiSuccess({ user }, {}, { requestId });
}
