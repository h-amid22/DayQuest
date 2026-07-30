# DayQuest database schema

The Prisma schema is the initial persistence foundation for DayQuest. Supabase remains the authentication provider; Prisma stores application profiles and planner data only. IDs are strings generated as UUIDs, matching the repository's existing convention and accepting Supabase user UUIDs as application `User.id` values.

## Models

### User

The application profile corresponding to a Supabase identity. It stores the unique email, the starter-compatible optional `name`, display name, avatar URL, IANA time-zone preference, onboarding state, and timestamps. `timezone` defaults to `UTC`; geographic location is never inferred. Passwords, Supabase tokens, and session data are deliberately absent. Deleting a user cascades to all user-owned planner, progression, focus, and achievement data.

### TaskCategory

A user-owned label and ordering container for tasks and recurring definitions. Names are unique per user. `colour` and `icon` are optional, and `position` controls manual ordering. Deleting a category sets the category reference on tasks and recurring definitions to null rather than deleting them.

### DailyPlan

A user-owned container for one local calendar date, with an optional daily goal and notes plus explicit plan-completion state. `[userId, date]` is unique, ensuring one daily plan per user per calendar day. Deleting a plan sets its tasks' `dailyPlanId` to null so task history survives.

### Task

A scheduled mission instance. It belongs to one user and may reference a daily plan, category, or originating recurring definition. `status` is the sole task-completion state; overdue or missed state is derived rather than stored. `xpReward` is captured on each task so later reward-rule changes do not alter history. Deleting an optional parent clears the relevant reference. Deleting a task clears its optional focus-session and XP-transaction references while preserving those historical records.

The first task API blocks deletion once a task is completed, even though the database can preserve a nullable XP source reference. This conservative application rule keeps completed mission history directly attributable. Creating or moving a task upserts the unique `[userId, date]` daily plan and updates both task date and plan link atomically.

### RecurringTask

A user-owned recurrence template, not a completed task. Frequency and interval provide the base cadence. Weekly rules use `daysOfWeek`; monthly rules use `dayOfMonth`. Nullable fields keep the MVP model simple. Generated occurrences are ordinary `Task` records linked through `recurringTaskId`. Deleting a definition clears that link without deleting generated tasks. Generation logic is intentionally not implemented yet.

### UserProgress

A one-to-one, user-owned cached summary of total XP, current level, current and longest streak, and the last qualifying local date. It accelerates common reads but is not the source of audit history. Future write flows must update it transactionally with immutable `XPTransaction` records.

### XPTransaction

An immutable, user-owned XP ledger entry. `amount` is a signed integer, allowing awards and reversals. The type and stable internal `reason` describe why it occurred; optional JSON metadata carries structured context. Optional task, focus-session, and achievement links use `SetNull`, so deleting those records does not destroy XP history. There is intentionally no `updatedAt`.

Task rewards are server-defined by stored difficulty: easy 10, medium 25, hard 50, and epic 100 XP. Completion appends a positive transaction; reopen appends a negative reversal and never edits or deletes the original. `UserProgress.currentLevel` uses cumulative thresholds where level N requires an additional `100 × N` XP to reach the next level.

### FocusSession

A user-owned timed focus record, optionally attached to a task. It tracks planned and actual duration, lifecycle state, timestamps, and the XP actually awarded. Task deletion clears the link while leaving the session and related XP history intact. Timer behavior is not implemented in this milestone.

### Achievement

A system-defined achievement with a stable unique code, display information, reward, flexible JSON criteria, and an activation flag. Achievements are deactivated instead of routinely deleted. Deletion is restricted when user progression or unlock history references the definition.

### UserAchievement

A user's progress toward one achievement. Records may exist before unlock: `progress` defaults to zero and `unlockedAt` remains null until earned. Optional JSON metadata holds criteria-specific context, and timestamps track creation and progress updates. `[userId, achievementId]` is unique, so each user has at most one progress/unlock record per achievement.

## Planner dates and times

`DailyPlan.date`, `Task.scheduledDate`, recurring boundaries, generation checkpoints, and streak checkpoints use PostgreSQL `date` through Prisma `DateTime @db.Date`. Application code must convert a user's local calendar date to a canonical date-only value consistently and must not derive it from the server's local time zone. APIs should exchange these values as `YYYY-MM-DD` calendar dates and use one shared persistence conversion utility when that layer is introduced.

Task and recurring-template `startTime` and `endTime` values are nullable integer minutes after local midnight. `0` represents 00:00, `540` represents 09:00, and `1439` represents 23:59. Future input validation must enforce the `0` through `1439` range and valid start/end ordering. Values are interpreted in the owning user's time zone for the scheduled date. Unscheduled tasks leave both fields null and use `position` for ordering.

Weekly `daysOfWeek` values use integers `0` through `6`, where `0` is Sunday and `6` is Saturday. `interval` defaults to one. The application must validate frequency-specific fields, monthly days, date ranges, and positive intervals before persistence.

## Referential integrity

- Deleting `User` cascades to all user-owned rows.
- Deleting `TaskCategory`, `DailyPlan`, or `RecurringTask` sets optional task/template references to null.
- Deleting `Task` sets references from focus sessions and XP transactions to null.
- Deleting `FocusSession` sets its XP transaction references to null.
- Deleting `Achievement` is restricted by `UserAchievement`; normal lifecycle management uses `isActive`.
- XP transactions may lose optional source references but remain in the user's ledger.

Cross-user ownership consistency is enforced at the application/service boundary in the MVP. All writes must authenticate the user, scope parent lookups by that user, validate payloads, and use transactions for multi-record progression changes. Row-level security remains required for every table exposed directly through Supabase.

## Uniqueness constraints

- `User.email`
- `TaskCategory.[userId, name]`
- `DailyPlan.[userId, date]`
- `UserProgress.userId`
- `Achievement.code`
- `UserAchievement.[userId, achievementId]`

## Query indexes

- Categories by user and manual position
- Plans by user, completion state, and date
- Tasks by user/date, user/status, plan/position, recurring definition, and category
- Active recurring definitions by user, plus category lookup
- XP transactions by user/date, type, and each optional source
- Focus sessions by user/start time and task/status
- User achievements by achievement/unlock time

Unique constraints already provide their own indexes and are not duplicated.

## Deliberately excluded from the MVP schema

- Passwords, authentication tokens, refresh tokens, and session cookies
- Spendable coins, inventories, shops, or marketplace data
- Social graphs, teams, sharing, and leaderboards
- AI schedules or recommendation data
- Permanent task `MISSED` state or duplicate `isCompleted` flag
- Soft-deletion fields and separate recurrence-rule tables
- XP calculation, recurrence generation, streak evaluation, achievement evaluation, and timer logic
