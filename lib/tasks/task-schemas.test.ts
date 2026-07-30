import { describe, expect, it } from "vitest";
import { completionSchema, createCategorySchema, createTaskSchema, reorderTasksSchema, updateTaskSchema } from "./task-schemas";

const valid = { title: " Mission ", scheduledDate: "2026-07-30" };
const id = "11111111-1111-4111-8111-111111111111";

describe("task request validation", () => {
  it("normalises valid creation defaults and trims text", () => { expect(createTaskSchema.parse(valid)).toMatchObject({ title: "Mission", priority: "MEDIUM", difficulty: "MEDIUM", position: 0 }); });
  it.each(["2026-02-30", "30-07-2026", "2026-13-01"])("rejects invalid date %s", (scheduledDate) => { expect(() => createTaskSchema.parse({ ...valid, scheduledDate })).toThrow(); });
  it("rejects invalid minute ranges and end before start", () => {
    expect(() => createTaskSchema.parse({ ...valid, startTime: -1 })).toThrow();
    expect(() => createTaskSchema.parse({ ...valid, endTime: 1440 })).toThrow();
    expect(() => createTaskSchema.parse({ ...valid, startTime: 600, endTime: 500 })).toThrow();
  });
  it("rejects empty, overlong, and unknown task fields", () => {
    expect(() => createTaskSchema.parse({ ...valid, title: "" })).toThrow();
    expect(() => createTaskSchema.parse({ ...valid, title: "x".repeat(121) })).toThrow();
    expect(() => createTaskSchema.parse({ ...valid, xpReward: 999 })).toThrow();
    expect(() => createTaskSchema.parse({ ...valid, userId: id })).toThrow();
  });
  it("rejects empty updates and protected update fields", () => {
    expect(() => updateTaskSchema.parse({})).toThrow();
    expect(() => updateTaskSchema.parse({ status: "COMPLETED" })).toThrow();
  });
  it("rejects duplicate reorder IDs", () => { expect(() => reorderTasksSchema.parse({ scheduledDate: valid.scheduledDate, orderedTaskIds: [id, id] })).toThrow(); });
  it("validates completion duration and unknown fields", () => {
    expect(completionSchema.parse({ actualMinutes: 30 })).toEqual({ actualMinutes: 30 });
    expect(() => completionSchema.parse({ actualMinutes: 0 })).toThrow();
    expect(() => completionSchema.parse({ xpReward: 10 })).toThrow();
  });
  it("trims category names and validates conservative colours", () => {
    expect(createCategorySchema.parse({ name: " Work ", colour: "#12aBcD" }).name).toBe("Work");
    expect(() => createCategorySchema.parse({ name: "Work", colour: "red" })).toThrow();
  });
});
