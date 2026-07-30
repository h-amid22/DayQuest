import type { NextRequest } from "next/server";
import { apiSuccess } from "@/lib/api/response";
import { taskApi } from "@/lib/tasks/task-api";
import { createCategorySchema } from "@/lib/tasks/task-schemas";
import { TaskService } from "@/lib/tasks/task-service";

export const dynamic = "force-dynamic";
const service = new TaskService();
export function GET(request: NextRequest) { return taskApi(request, async (user, requestId) => apiSuccess(await service.listCategories(user.id), {}, { requestId })); }
export function POST(request: NextRequest) { return taskApi(request, async (user, requestId) => apiSuccess(await service.createCategory(user, createCategorySchema.parse(await request.json())), { status: 201 }, { requestId }), { key: "category", limit: 30 }); }
