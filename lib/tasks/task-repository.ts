import { Prisma, TaskStatus, XPTransactionType } from "@/generated/prisma/client";
import { db } from "@/lib/db";

type Client = Prisma.TransactionClient | typeof db;

export const publicTaskSelect = {
  id: true, title: true, description: true, status: true, priority: true, difficulty: true, scheduledDate: true,
  startTime: true, endTime: true, estimatedMinutes: true, actualMinutes: true, position: true, xpReward: true,
  completedAt: true, createdAt: true, updatedAt: true,
  category: { select: { id: true, name: true, colour: true, icon: true } },
} as const satisfies Prisma.TaskSelect;

export type PublicTaskRecord = Prisma.TaskGetPayload<{ select: typeof publicTaskSelect }>;

export class TaskRepository {
  constructor(private readonly client: Client = db) {}

  transaction<T>(operation: (repository: TaskRepository) => Promise<T>): Promise<T> {
    return db.$transaction((tx) => operation(new TaskRepository(tx)), { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  }

  ensureUser(user: { id: string; email: string }) { return this.client.user.upsert({ where: { id: user.id }, update: { email: user.email }, create: user }); }
  findCategory(userId: string, categoryId: string) { return this.client.taskCategory.findFirst({ where: { id: categoryId, userId } }); }
  listCategories(userId: string) { return this.client.taskCategory.findMany({ where: { userId }, orderBy: [{ position: "asc" }, { createdAt: "asc" }], select: { id: true, name: true, colour: true, icon: true, position: true, createdAt: true, updatedAt: true } }); }
  createCategory(userId: string, data: { name: string; colour?: string | null; icon?: string | null; position: number }) { return this.client.taskCategory.create({ data: { ...data, userId }, select: { id: true, name: true, colour: true, icon: true, position: true, createdAt: true, updatedAt: true } }); }
  findOrCreateDailyPlan(userId: string, date: Date) { return this.client.dailyPlan.upsert({ where: { userId_date: { userId, date } }, update: {}, create: { userId, date } }); }
  createTask(data: Prisma.TaskUncheckedCreateInput) { return this.client.task.create({ data, select: publicTaskSelect }); }
  listTasks(userId: string, filters: { date?: Date; status?: TaskStatus; categoryId?: string }) { return this.client.task.findMany({ where: { userId, ...(filters.date ? { scheduledDate: filters.date } : {}), ...(filters.status ? { status: filters.status } : {}), ...(filters.categoryId ? { categoryId: filters.categoryId } : {}) }, orderBy: [{ startTime: { sort: "asc", nulls: "last" } }, { position: "asc" }, { createdAt: "asc" }], select: publicTaskSelect }); }
  findTask(userId: string, taskId: string) { return this.client.task.findFirst({ where: { id: taskId, userId } }); }
  findPublicTask(userId: string, taskId: string) { return this.client.task.findFirst({ where: { id: taskId, userId }, select: publicTaskSelect }); }
  updateTask(userId: string, taskId: string, data: Prisma.TaskUncheckedUpdateManyInput) { return this.client.task.updateMany({ where: { id: taskId, userId }, data }); }
  deleteTask(userId: string, taskId: string) { return this.client.task.deleteMany({ where: { id: taskId, userId } }); }
  findTasksForReorder(userId: string, taskIds: string[], date: Date) { return this.client.task.findMany({ where: { userId, id: { in: taskIds }, scheduledDate: date }, select: { id: true } }); }
  setTaskPosition(userId: string, taskId: string, position: number) { return this.client.task.updateMany({ where: { id: taskId, userId }, data: { position } }); }
  transitionTask(userId: string, taskId: string, from: TaskStatus, data: Prisma.TaskUncheckedUpdateManyInput) { return this.client.task.updateMany({ where: { id: taskId, userId, status: from }, data }); }
  createXpTransaction(data: { userId: string; taskId: string; type: XPTransactionType; amount: number; reason: string }) { return this.client.xPTransaction.create({ data }); }
  findLatestCompletionTransaction(userId: string, taskId: string) { return this.client.xPTransaction.findFirst({ where: { userId, taskId, type: XPTransactionType.TASK_COMPLETION }, orderBy: { createdAt: "desc" } }); }
  addProgress(userId: string, amount: number) { return this.client.userProgress.upsert({ where: { userId }, create: { userId, totalXp: Math.max(0, amount), currentLevel: 1 }, update: { totalXp: { increment: amount } } }); }
  setProgress(userId: string, totalXp: number, currentLevel: number) { return this.client.userProgress.upsert({ where: { userId }, create: { userId, totalXp, currentLevel }, update: { totalXp, currentLevel } }); }
}
