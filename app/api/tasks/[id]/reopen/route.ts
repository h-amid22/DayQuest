import type { NextRequest } from "next/server";
import { apiSuccess } from "@/lib/api/response";
import { parseOptionalJson, taskApi } from "@/lib/tasks/task-api";
import { completionSchema, taskIdSchema } from "@/lib/tasks/task-schemas";
import { TaskService } from "@/lib/tasks/task-service";

export const dynamic = "force-dynamic";
const service = new TaskService();
export function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return taskApi(request, async (user, requestId) => { const { id } = await params; completionSchema.omit({ actualMinutes: true }).parse(await parseOptionalJson(request)); return apiSuccess(await service.reopenTask(user.id, taskIdSchema.parse(id)), {}, { requestId }); }, { key: "transition", limit: 30 });
}
