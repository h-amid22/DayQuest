import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { starterAchievements } from "./seed-data";

const schema = readFileSync(resolve(process.cwd(), "prisma/schema.prisma"), "utf8");

describe("DayQuest domain schema", () => {
  it("stores XP transaction amounts as signed integers", () => {
    const transactionModel = schema.match(/model XPTransaction \{([\s\S]*?)\n\}/)?.[1];
    expect(transactionModel).toMatch(/\bamount\s+Int\b/);
    expect(transactionModel).not.toMatch(/amount[^\n]*@default/);
  });

  it("uses task status as the sole completion state", () => {
    const taskModel = schema.match(/model Task \{([\s\S]*?)\n\}/)?.[1];
    expect(taskModel).toMatch(/\bstatus\s+TaskStatus\s+@default\(PLANNED\)/);
    expect(taskModel).not.toMatch(/\bisCompleted\b/);
  });

  it("defines unique, stable achievement codes", () => {
    const codes = starterAchievements.map(({ code }) => code);
    expect(new Set(codes).size).toBe(codes.length);
    expect(codes).toEqual([
      "FIRST_MISSION",
      "PERFECT_DAY",
      "SEVEN_DAY_STREAK",
      "FOCUS_BEGINNER",
    ]);
  });
});
