export const starterAchievements = [
  {
    code: "FIRST_MISSION",
    name: "First Mission",
    description: "Complete your first task.",
    xpReward: 25,
    criteria: { type: "completed_tasks", threshold: 1 },
  },
  {
    code: "PERFECT_DAY",
    name: "Perfect Day",
    description: "Complete every planned task in a day.",
    xpReward: 100,
    criteria: { type: "perfect_days", threshold: 1 },
  },
  {
    code: "SEVEN_DAY_STREAK",
    name: "Seven-Day Streak",
    description: "Complete at least one task for seven consecutive days.",
    xpReward: 150,
    criteria: { type: "completion_streak", threshold: 7 },
  },
  {
    code: "FOCUS_BEGINNER",
    name: "Focus Beginner",
    description: "Complete your first focus session.",
    xpReward: 25,
    criteria: { type: "completed_focus_sessions", threshold: 1 },
  },
] as const;
