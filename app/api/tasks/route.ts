import type { NextRequest } from "next/server";
import { apiSuccess } from "@/lib/api/response";
import { taskApi } from "@/lib/tasks/task-api";
import { createTaskSchema, taskListQuerySchema } from "@/lib/tasks/task-schemas";
import { TaskService } from "@/lib/tasks/task-service";

export const dynamic = "force-dynamic";
const service = new TaskService();

export function GET(request: NextRequest) {
  return taskApi(request, async (user, requestId) => {
    const query = taskListQuerySchema.parse(Object.fromEntries(request.nextUrl.searchParams));
    return apiSuccess(await service.listTasks(user.id, query), {}, { requestId });
  });
}

export function POST(request: NextRequest) {
  return taskApi(request, async (user, requestId) => apiSuccess(await service.createTask(user, createTaskSchema.parse(await request.json())), { status: 201 }, { requestId }), { key: "write", limit: 60 });
}
