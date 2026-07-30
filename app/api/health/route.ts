import { apiSuccess } from "@/lib/api/response";
import { getRequestId } from "@/lib/api/request";

export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  return apiSuccess({ status: "ok", timestamp: new Date().toISOString() }, { status: 200 }, { requestId: getRequestId(request) });
}
