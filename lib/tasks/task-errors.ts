export type TaskErrorCode = "NOT_FOUND" | "CONFLICT" | "INVALID_INPUT" | "UNAUTHORIZED";

export class TaskError extends Error {
  constructor(public readonly code: TaskErrorCode, message: string, public readonly status: number) {
    super(message);
    this.name = "TaskError";
  }
}

export const taskNotFound = () => new TaskError("NOT_FOUND", "Task not found", 404);
export const categoryNotFound = () => new TaskError("NOT_FOUND", "Category not found", 404);
export const taskConflict = (message: string) => new TaskError("CONFLICT", message, 409);
export const invalidTaskInput = (message: string) => new TaskError("INVALID_INPUT", message, 400);
