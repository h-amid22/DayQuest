import { Prisma, TaskDifficulty, TaskPriority, TaskStatus, XPTransactionType } from "@/generated/prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TaskRepository } from "./task-repository";
import { TaskService } from "./task-service";

const user = { id: "user-a", email: "user@example.test" };
const taskId = "11111111-1111-4111-8111-111111111111";
const now = new Date("2026-07-30T10:00:00.000Z");
const fullTask = { id: taskId, userId: user.id, dailyPlanId: "plan-a", categoryId: null, recurringTaskId: null, title: "Mission", description: null, status: TaskStatus.PLANNED, priority: TaskPriority.MEDIUM, difficulty: TaskDifficulty.MEDIUM, scheduledDate: new Date("2026-07-30T00:00:00.000Z"), startTime: null, endTime: null, estimatedMinutes: null, actualMinutes: null, position: 0, xpReward: 25, completedAt: null, createdAt: now, updatedAt: now };
const publicTask = { id: taskId, title: "Mission", description: null, status: TaskStatus.PLANNED, priority: TaskPriority.MEDIUM, difficulty: TaskDifficulty.MEDIUM, scheduledDate: fullTask.scheduledDate, startTime: null, endTime: null, estimatedMinutes: null, actualMinutes: null, position: 0, xpReward: 25, completedAt: null, createdAt: now, updatedAt: now, category: null };

function makeRepository() {
  const repository = {
    transaction: vi.fn(async (operation: (repository: TaskRepository) => Promise<unknown>) => operation(repository as unknown as TaskRepository)),
    ensureUser: vi.fn(), findCategory: vi.fn(), listCategories: vi.fn().mockResolvedValue([]), createCategory: vi.fn(),
    findOrCreateDailyPlan: vi.fn().mockResolvedValue({ id: "plan-a" }), createTask: vi.fn().mockResolvedValue(publicTask), listTasks: vi.fn().mockResolvedValue([]),
    findTask: vi.fn(), findPublicTask: vi.fn(), updateTask: vi.fn().mockResolvedValue({ count: 1 }), deleteTask: vi.fn().mockResolvedValue({ count: 1 }),
    findTasksForReorder: vi.fn(), setTaskPosition: vi.fn(), transitionTask: vi.fn().mockResolvedValue({ count: 1 }),
    createXpTransaction: vi.fn(), findLatestCompletionTransaction: vi.fn(), addProgress: vi.fn().mockResolvedValue({ totalXp: 25 }), setProgress: vi.fn().mockResolvedValue({ totalXp: 25, currentLevel: 1 }),
  };
  return repository;
}

describe("TaskService", () => {
  let repository: ReturnType<typeof makeRepository>;
  let service: TaskService;
  beforeEach(() => { repository = makeRepository(); service = new TaskService(repository as unknown as TaskRepository); });

  it("creates a daily plan-linked task with server-computed XP", async () => {
    const result = await service.createTask(user, { title: "Mission", scheduledDate: "2026-07-30", priority: TaskPriority.MEDIUM, difficulty: TaskDifficulty.HARD, position: 0 });
    expect(repository.ensureUser).toHaveBeenCalledWith(user);
    expect(repository.findOrCreateDailyPlan).toHaveBeenCalledWith(user.id, new Date("2026-07-30T00:00:00.000Z"));
    expect(repository.createTask).toHaveBeenCalledWith(expect.objectContaining({ userId: user.id, dailyPlanId: "plan-a", xpReward: 50 }));
    expect(result.scheduledDate).toBe("2026-07-30");
  });

  it("moves a task and its daily plan together", async () => {
    repository.findTask.mockResolvedValue(fullTask); repository.findPublicTask.mockResolvedValue({ ...publicTask, scheduledDate: new Date("2026-08-01T00:00:00.000Z") }); repository.findOrCreateDailyPlan.mockResolvedValue({ id: "plan-b" });
    await service.updateTask(user.id, taskId, { scheduledDate: "2026-08-01" });
    expect(repository.updateTask).toHaveBeenCalledWith(user.id, taskId, expect.objectContaining({ scheduledDate: new Date("2026-08-01T00:00:00.000Z"), dailyPlanId: "plan-b" }));
  });

  it.each([
    ["read", (value: TaskService) => value.getTask(user.id, taskId)],
    ["update", (value: TaskService) => value.updateTask(user.id, taskId, { title: "Changed" })],
    ["delete", (value: TaskService) => value.deleteTask(user.id, taskId)],
    ["complete", (value: TaskService) => value.completeTask(user.id, taskId, {})],
  ])("returns 404 when an owned task cannot be found for %s", async (_name, operation) => {
    repository.findTask.mockResolvedValue(null); repository.findPublicTask.mockResolvedValue(null);
    await expect(operation(service)).rejects.toMatchObject({ code: "NOT_FOUND", status: 404 });
  });

  it("blocks deletion of a completed task", async () => {
    repository.findTask.mockResolvedValue({ ...fullTask, status: TaskStatus.COMPLETED });
    await expect(service.deleteTask(user.id, taskId)).rejects.toMatchObject({ code: "CONFLICT" });
    expect(repository.deleteTask).not.toHaveBeenCalled();
  });

  it("completes once, writes XP history, and updates progress", async () => {
    repository.findTask.mockResolvedValue(fullTask); repository.findPublicTask.mockResolvedValue({ ...publicTask, status: TaskStatus.COMPLETED, completedAt: now });
    const result = await service.completeTask(user.id, taskId, { actualMinutes: 20 });
    expect(repository.transitionTask).toHaveBeenCalledWith(user.id, taskId, TaskStatus.PLANNED, expect.objectContaining({ status: TaskStatus.COMPLETED, actualMinutes: 20 }));
    expect(repository.createXpTransaction).toHaveBeenCalledWith(expect.objectContaining({ type: XPTransactionType.TASK_COMPLETION, amount: 25 }));
    expect(repository.addProgress).toHaveBeenCalledWith(user.id, 25);
    expect(result.progress).toEqual({ totalXp: 25, currentLevel: 1 });
  });

  it("does not complete or reward an already completed task", async () => {
    repository.findTask.mockResolvedValue({ ...fullTask, status: TaskStatus.COMPLETED });
    await expect(service.completeTask(user.id, taskId, {})).rejects.toMatchObject({ code: "CONFLICT" });
    expect(repository.createXpTransaction).not.toHaveBeenCalled();
  });

  it("reopens with a new negative ledger entry and preserves completion history", async () => {
    repository.findTask.mockResolvedValue({ ...fullTask, status: TaskStatus.COMPLETED, completedAt: now }); repository.findLatestCompletionTransaction.mockResolvedValue({ amount: 25 }); repository.findPublicTask.mockResolvedValue(publicTask); repository.addProgress.mockResolvedValue({ totalXp: 0 }); repository.setProgress.mockResolvedValue({ totalXp: 0, currentLevel: 1 });
    await service.reopenTask(user.id, taskId);
    expect(repository.createXpTransaction).toHaveBeenCalledWith(expect.objectContaining({ type: XPTransactionType.TASK_REVERSAL, amount: -25 }));
    expect(repository.findLatestCompletionTransaction).toHaveBeenCalled();
  });

  it("cannot reopen twice", async () => {
    repository.findTask.mockResolvedValue(fullTask);
    await expect(service.reopenTask(user.id, taskId)).rejects.toMatchObject({ code: "CONFLICT" });
    expect(repository.createXpTransaction).not.toHaveBeenCalled();
  });

  it("reorders transactionally only when every task belongs to user and date", async () => {
    const second = "22222222-2222-4222-8222-222222222222"; repository.findTasksForReorder.mockResolvedValue([{ id: taskId }, { id: second }]);
    await service.reorderTasks(user.id, { scheduledDate: "2026-07-30", orderedTaskIds: [second, taskId] });
    expect(repository.transaction).toHaveBeenCalled(); expect(repository.setTaskPosition).toHaveBeenNthCalledWith(1, user.id, second, 0); expect(repository.setTaskPosition).toHaveBeenNthCalledWith(2, user.id, taskId, 1);
    repository.findTasksForReorder.mockResolvedValue([{ id: taskId }]);
    await expect(service.reorderTasks(user.id, { scheduledDate: "2026-07-30", orderedTaskIds: [second, taskId] })).rejects.toMatchObject({ code: "NOT_FOUND" });
  });

  it("creates and lists categories only through the current user scope", async () => {
    const category = { id: "cat", name: "Work", colour: null, icon: null, position: 0, createdAt: now, updatedAt: now }; repository.createCategory.mockResolvedValue(category); repository.listCategories.mockResolvedValue([category]);
    expect(await service.createCategory(user, { name: "Work", position: 0 })).toMatchObject({ name: "Work" });
    await service.listCategories(user.id);
    expect(repository.createCategory).toHaveBeenCalledWith(user.id, { name: "Work", position: 0 }); expect(repository.listCategories).toHaveBeenCalledWith(user.id);
  });

  it("returns a stable duplicate category conflict", async () => {
    repository.transaction.mockRejectedValue(new Prisma.PrismaClientKnownRequestError("duplicate", { code: "P2002", clientVersion: "7.9.1" }));
    await expect(service.createCategory(user, { name: "Work", position: 0 })).rejects.toMatchObject({ code: "CONFLICT", status: 409 });
  });
});
