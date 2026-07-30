import { TaskDifficulty, TaskPriority, TaskStatus } from "@/generated/prisma/client";
import { z } from "zod";
import { isCalendarDate } from "./task-time";

const date = z.string().refine(isCalendarDate, "Date must be a valid YYYY-MM-DD calendar date");
const title = z.string().trim().min(1).max(120);
const description = z.string().trim().max(2000).nullable();
const id = z.string().uuid();
const minute = z.number().int().min(0).max(1439).nullable();
const duration = z.number().int().positive().max(1440).nullable();
const position = z.number().int().nonnegative().max(100_000);
const validTimes = (value: { startTime?: number | null; endTime?: number | null }) => value.startTime == null || value.endTime == null || value.endTime > value.startTime;

export const createTaskSchema = z.object({
  title,
  description: description.optional(),
  categoryId: id.nullable().optional(),
  scheduledDate: date,
  startTime: minute.optional(),
  endTime: minute.optional(),
  estimatedMinutes: duration.optional(),
  priority: z.nativeEnum(TaskPriority).default(TaskPriority.MEDIUM),
  difficulty: z.nativeEnum(TaskDifficulty).default(TaskDifficulty.MEDIUM),
  position: position.default(0),
}).strict().refine(validTimes, { message: "End time must be greater than start time", path: ["endTime"] });

export const updateTaskSchema = z.object({
  title: title.optional(), description: description.optional(), categoryId: id.nullable().optional(), scheduledDate: date.optional(),
  startTime: minute.optional(), endTime: minute.optional(), estimatedMinutes: duration.optional(),
  priority: z.nativeEnum(TaskPriority).optional(), difficulty: z.nativeEnum(TaskDifficulty).optional(), position: position.optional(),
}).strict().refine((value) => Object.keys(value).length > 0, "At least one field is required").refine(validTimes, { message: "End time must be greater than start time", path: ["endTime"] });

export const reorderTasksSchema = z.object({
  scheduledDate: date,
  orderedTaskIds: z.array(id).min(1).max(500).refine((ids) => new Set(ids).size === ids.length, "Task IDs must be unique"),
}).strict();
export const completionSchema = z.object({ actualMinutes: z.number().int().positive().max(1440).optional() }).strict();
export const taskListQuerySchema = z.object({ date: date.optional(), status: z.nativeEnum(TaskStatus).optional(), categoryId: id.optional() }).strict();
export const createCategorySchema = z.object({
  name: z.string().trim().min(1).max(50),
  colour: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Colour must use #RRGGBB format").nullable().optional(),
  icon: z.string().trim().min(1).max(50).regex(/^[a-zA-Z0-9_-]+$/, "Icon must be a stable identifier").nullable().optional(),
  position: position.default(0),
}).strict();
export const taskIdSchema = id;

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type ReorderTasksInput = z.infer<typeof reorderTasksSchema>;
export type CompletionInput = z.infer<typeof completionSchema>;
export type TaskListQuery = z.infer<typeof taskListQuerySchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
