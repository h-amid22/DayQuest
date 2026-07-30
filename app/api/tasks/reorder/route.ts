import type { NextRequest } from "next/server";
import { apiSuccess } from "@/lib/api/response";
import { taskApi } from "@/lib/tasks/task-api";
import { reorderTasksSchema } from "@/lib/tasks/task-schemas";
import { TaskService } from "@/lib/tasks/task-service";

export const dynamic = "force-dynamic";
const service = new TaskService();
export function POST(request: NextRequest) {
  return taskApi(request, async (user, requestId) => apiSuccess(await service.reorderTasks(user.id, reorderTasksSchema.parse(await request.json())), {}, { requestId }), { key: "reorder", limit: 30 });
}
