import type { PublicTaskRecord } from "./task-repository";
import { calendarDate } from "./task-time";

export function toPublicTask(task: PublicTaskRecord) {
  return {
    ...task,
    scheduledDate: calendarDate(task.scheduledDate),
    completedAt: task.completedAt?.toISOString() ?? null,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  };
}

export function toPublicCategory<T extends { createdAt: Date; updatedAt: Date }>(category: T) {
  return { ...category, createdAt: category.createdAt.toISOString(), updatedAt: category.updatedAt.toISOString() };
}
