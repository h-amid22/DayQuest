import { Prisma, TaskStatus, XPTransactionType } from "@/generated/prisma/client";
import { categoryNotFound, invalidTaskInput, taskConflict, taskNotFound, TaskError } from "./task-errors";
import { toPublicCategory, toPublicTask } from "./task-mapper";
import { TaskRepository } from "./task-repository";
import type { CompletionInput, CreateCategoryInput, CreateTaskInput, ReorderTasksInput, TaskListQuery, UpdateTaskInput } from "./task-schemas";
import { assertTimeRange, planningDate } from "./task-time";
import { levelForXp, rewardForDifficulty } from "./task-rewards";

export type AuthenticatedTaskUser = { id: string; email: string | null };
function emailFor(user: AuthenticatedTaskUser): string { if (!user.email) throw new TaskError("UNAUTHORIZED", "An authenticated email is required", 401); return user.email; }

export class TaskService {
  constructor(private readonly repository = new TaskRepository()) {}

  createTask(user: AuthenticatedTaskUser, input: CreateTaskInput) {
    return this.repository.transaction(async (repository) => {
      await repository.ensureUser({ id: user.id, email: emailFor(user) });
      if (input.categoryId && !(await repository.findCategory(user.id, input.categoryId))) throw categoryNotFound();
      const date = planningDate(input.scheduledDate);
      const plan = await repository.findOrCreateDailyPlan(user.id, date);
      const task = await repository.createTask({ userId: user.id, dailyPlanId: plan.id, title: input.title, description: input.description, categoryId: input.categoryId, scheduledDate: date, startTime: input.startTime, endTime: input.endTime, estimatedMinutes: input.estimatedMinutes, priority: input.priority, difficulty: input.difficulty, position: input.position, xpReward: rewardForDifficulty(input.difficulty) });
      return toPublicTask(task);
    });
  }

  async listTasks(userId: string, filters: TaskListQuery) { return (await this.repository.listTasks(userId, { ...filters, date: filters.date ? planningDate(filters.date) : undefined })).map(toPublicTask); }
  async getTask(userId: string, taskId: string) { const task = await this.repository.findPublicTask(userId, taskId); if (!task) throw taskNotFound(); return toPublicTask(task); }

  updateTask(userId: string, taskId: string, input: UpdateTaskInput) {
    return this.repository.transaction(async (repository) => {
      const existing = await repository.findTask(userId, taskId);
      if (!existing) throw taskNotFound();
      if (existing.status === TaskStatus.COMPLETED && input.difficulty && input.difficulty !== existing.difficulty) throw taskConflict("Completed task difficulty cannot be changed");
      try { assertTimeRange(input.startTime === undefined ? existing.startTime : input.startTime, input.endTime === undefined ? existing.endTime : input.endTime); } catch { throw invalidTaskInput("End time must be greater than start time"); }
      if (input.categoryId && !(await repository.findCategory(userId, input.categoryId))) throw categoryNotFound();
      const data: Prisma.TaskUncheckedUpdateManyInput = {};
      for (const field of ["title", "description", "categoryId", "startTime", "endTime", "estimatedMinutes", "priority", "difficulty", "position"] as const) if (input[field] !== undefined) Object.assign(data, { [field]: input[field] });
      if (input.scheduledDate) { const date = planningDate(input.scheduledDate); const plan = await repository.findOrCreateDailyPlan(userId, date); data.scheduledDate = date; data.dailyPlanId = plan.id; }
      if (input.difficulty && input.difficulty !== existing.difficulty) data.xpReward = rewardForDifficulty(input.difficulty);
      if ((await repository.updateTask(userId, taskId, data)).count !== 1) throw taskNotFound();
      const task = await repository.findPublicTask(userId, taskId); if (!task) throw taskNotFound(); return toPublicTask(task);
    });
  }

  async deleteTask(userId: string, taskId: string) { const task = await this.repository.findTask(userId, taskId); if (!task) throw taskNotFound(); if (task.status === TaskStatus.COMPLETED) throw taskConflict("Completed tasks cannot be deleted"); if ((await this.repository.deleteTask(userId, taskId)).count !== 1) throw taskNotFound(); }

  reorderTasks(userId: string, input: ReorderTasksInput) {
    return this.repository.transaction(async (repository) => {
      const tasks = await repository.findTasksForReorder(userId, input.orderedTaskIds, planningDate(input.scheduledDate));
      if (tasks.length !== input.orderedTaskIds.length) throw taskNotFound();
      await Promise.all(input.orderedTaskIds.map((id, position) => repository.setTaskPosition(userId, id, position)));
      return input;
    });
  }

  completeTask(userId: string, taskId: string, input: CompletionInput) {
    return this.repository.transaction(async (repository) => {
      const task = await repository.findTask(userId, taskId); if (!task) throw taskNotFound(); if (task.status === TaskStatus.COMPLETED) throw taskConflict("Task is already completed");
      const changed = await repository.transitionTask(userId, taskId, task.status, { status: TaskStatus.COMPLETED, completedAt: new Date(), ...(input.actualMinutes === undefined ? {} : { actualMinutes: input.actualMinutes }) });
      if (changed.count !== 1) throw taskConflict("Task state changed; retry the request");
      await repository.createXpTransaction({ userId, taskId, type: XPTransactionType.TASK_COMPLETION, amount: task.xpReward, reason: "Task completed" });
      const progress = await repository.addProgress(userId, task.xpReward); const currentLevel = levelForXp(progress.totalXp); const saved = await repository.setProgress(userId, progress.totalXp, currentLevel);
      const updated = await repository.findPublicTask(userId, taskId); if (!updated) throw taskNotFound();
      return { task: toPublicTask(updated), progress: { totalXp: saved.totalXp, currentLevel: saved.currentLevel } };
    });
  }

  reopenTask(userId: string, taskId: string) {
    return this.repository.transaction(async (repository) => {
      const task = await repository.findTask(userId, taskId); if (!task) throw taskNotFound(); if (task.status !== TaskStatus.COMPLETED) throw taskConflict("Only completed tasks can be reopened");
      const completion = await repository.findLatestCompletionTransaction(userId, taskId); if (!completion) throw taskConflict("Task completion reward history was not found");
      if ((await repository.transitionTask(userId, taskId, TaskStatus.COMPLETED, { status: TaskStatus.PLANNED, completedAt: null })).count !== 1) throw taskConflict("Task state changed; retry the request");
      const reversal = -Math.abs(completion.amount); await repository.createXpTransaction({ userId, taskId, type: XPTransactionType.TASK_REVERSAL, amount: reversal, reason: "Task completion reversed" });
      const progress = await repository.addProgress(userId, reversal); const totalXp = Math.max(0, progress.totalXp); const saved = await repository.setProgress(userId, totalXp, levelForXp(totalXp));
      const updated = await repository.findPublicTask(userId, taskId); if (!updated) throw taskNotFound();
      return { task: toPublicTask(updated), progress: { totalXp: saved.totalXp, currentLevel: saved.currentLevel } };
    });
  }

  async listCategories(userId: string) { return (await this.repository.listCategories(userId)).map(toPublicCategory); }
  async createCategory(user: AuthenticatedTaskUser, input: CreateCategoryInput) {
    try { return await this.repository.transaction(async (repository) => { await repository.ensureUser({ id: user.id, email: emailFor(user) }); return toPublicCategory(await repository.createCategory(user.id, input)); }); }
    catch (error) { if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") throw taskConflict("A category with this name already exists"); throw error; }
  }
}
