import type { TaskDifficulty } from "@/generated/prisma/client";

export const TASK_XP_REWARDS = { EASY: 10, MEDIUM: 25, HARD: 50, EPIC: 100 } as const satisfies Record<TaskDifficulty, number>;
export function rewardForDifficulty(difficulty: TaskDifficulty): number { return TASK_XP_REWARDS[difficulty]; }

// Level N requires N * 100 additional XP to reach level N + 1.
export function levelForXp(totalXp: number): number {
  let level = 1;
  let remaining = Math.max(0, totalXp);
  while (remaining >= level * 100) { remaining -= level * 100; level += 1; }
  return level;
}
