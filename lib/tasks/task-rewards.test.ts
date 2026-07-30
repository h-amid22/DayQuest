import { describe, expect, it } from "vitest";
import { levelForXp, rewardForDifficulty } from "./task-rewards";

describe("task XP policy", () => {
  it.each([["EASY", 10], ["MEDIUM", 25], ["HARD", 50], ["EPIC", 100]] as const)("awards %s tasks", (difficulty, reward) => { expect(rewardForDifficulty(difficulty)).toBe(reward); });
  it.each([[-10, 1], [0, 1], [99, 1], [100, 2], [299, 2], [300, 3], [599, 3], [600, 4]] as const)("maps %i XP to level %i", (xp, level) => { expect(levelForXp(xp)).toBe(level); });
});
