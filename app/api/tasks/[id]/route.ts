import type { NextRequest } from "next/server";
import { apiSuccess } from "@/lib/api/response";
import { taskApi } from "@/lib/tasks/task-api";
import { taskIdSchema, updateTaskSchema } from "@/lib/tasks/task-schemas";
import { TaskService } from "@/lib/tasks/task-service";

export const dynamic = "force-dynamic";
const service = new TaskService();
type Context = { params: Promise<{ id: string }> };

export function GET(request: NextRequest, context: Context) {
  return taskApi(request, async (user, requestId) => { const { id } = await context.params; return apiSuccess(await service.getTask(user.id, taskIdSchema.parse(id)), {}, { requestId }); });
}
export function PATCH(request: NextRequest, context: Context) {
  return taskApi(request, async (user, requestId) => { const { id } = await context.params; return apiSuccess(await service.updateTask(user.id, taskIdSchema.parse(id), updateTaskSchema.parse(await request.json())), {}, { requestId }); }, { key: "write", limit: 60 });
}
export function DELETE(request: NextRequest, context: Context) {
  return taskApi(request, async (user, requestId) => { const { id } = await context.params; await service.deleteTask(user.id, taskIdSchema.parse(id)); return apiSuccess({ deleted: true }, {}, { requestId }); }, { key: "delete", limit: 30 });
}
