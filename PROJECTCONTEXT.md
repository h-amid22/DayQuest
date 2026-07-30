# DayQuest project context

## Product vision

DayQuest makes intentional days easier to plan and more satisfying to complete. It combines the utility of a dependable day planner with measured game mechanics so users can turn plans into missions, build momentum, and see meaningful progress over time. The experience should feel game-like while remaining professional, calm, and usable.

## Problem statement

Conventional task lists help capture work but often fail to connect plans to time, sustained focus, and motivating feedback. More playful productivity products can become distracting or inaccessible. DayQuest addresses this gap with a daily timeline, clear execution tools, and purposeful rewards that reinforce real progress.

## Target users

- Students and professionals who plan work around a daily schedule
- People who benefit from visible progress, streaks, and lightweight rewards
- Users seeking a structured focus routine without a childish or distracting interface
- Accessibility-conscious users who need full functionality independent of motion or sound

## Product goals

- Help users create realistic daily and weekly plans.
- Make it fast and clear to create, schedule, update, and complete missions.
- Reinforce consistency through XP, levels, streaks, and achievements.
- Support focused execution and useful reflection through sessions and analytics.
- Deliver an accessible, secure, responsive, and trustworthy experience.

## Success criteria

- Users can plan and manage a day without assistance or avoidable friction.
- Users can understand their current plan, next mission, completion state, and earned progress at a glance.
- Completion and focus flows reliably update progress without duplicate rewards.
- Weekly planning and analytics help users make more realistic future plans.
- Core journeys meet WCAG 2.2 AA expectations and remain complete with reduced motion and sound disabled.
- Security, quality, and performance checks pass consistently in continuous integration.

## MVP scope

- Daily planning on a timeline
- Weekly planning
- Task and mission management
- Recurring tasks
- XP and levels
- Streaks and achievements
- Focus sessions
- Daily and weekly analytics
- User settings, including accessibility preferences
- Authentication and per-user data access

## Explicitly out-of-scope features

- Social feeds, sharing, teams, and collaborative planning
- Leaderboards or competitive ranking
- AI scheduling, recommendations, or automatic plan generation
- Marketplace, purchasable items, or user-generated extensions
- Native mobile or desktop applications
- Rewards with monetary value

## Core user journeys

1. A user signs in and reviews today's timeline and progress.
2. A user creates missions, assigns times and priorities, and reorders the day.
3. A user completes a mission and receives clear confirmation plus the correct XP and streak update.
4. A user starts, pauses, resumes, and finishes a focus session associated with a mission.
5. A user plans the coming week and creates or adjusts recurring missions.
6. A user reviews daily and weekly completion, focus, and consistency trends.
7. A user changes planning, notification, appearance, and accessibility preferences.

## Functional requirements

- Users must authenticate before accessing personal planning data.
- Users must be able to create, view, edit, schedule, reorder, complete, reopen, and delete their own missions.
- Users must be able to organise missions on a daily timeline and review a weekly plan.
- Recurrence rules must create predictable future mission instances without duplicate awards.
- Completing an eligible mission must award XP exactly once; reopening must follow a documented reversal policy.
- Levels, streaks, and achievements must derive from auditable user activity.
- Focus sessions must track state and elapsed time reliably across supported navigation flows.
- Analytics must summarise the authenticated user's completion, XP, streak, and focus activity.
- Settings must persist per user and affect relevant experiences consistently.
- Every meaningful action must provide understandable visual feedback, including success, error, loading, and disabled states.

## Non-functional requirements

- Maintain strict TypeScript, automated linting, tests, and production-build validation.
- Use responsive layouts across supported mobile and desktop viewport sizes.
- Keep common interactions perceptibly responsive and avoid unnecessary client-side work.
- Preserve data integrity through server-side validation, transactional updates where needed, and idempotent reward operations.
- Provide useful operational logs without exposing credentials, tokens, or sensitive personal data.
- Design for reliable deployment, rollback, migration, and observability practices.
- Make time-zone and date boundaries explicit throughout planning, recurrence, streak, and analytics logic.

## Accessibility requirements

- Target WCAG 2.2 AA for all MVP journeys.
- Support keyboard-only operation with logical focus order and visible focus indicators.
- Use semantic HTML and accessible names, instructions, validation, and status announcements.
- Maintain sufficient colour contrast and never communicate state through colour alone.
- Respect `prefers-reduced-motion` and provide equivalent static feedback.
- Ensure essential functionality never depends on sound or animation.
- Support zoom, text resizing, touch targets, and reflow without loss of content or operation.

## Interaction and animation philosophy

DayQuest should feel responsive and rewarding, not noisy. Every meaningful action provides visual feedback. Animation communicates a change of state, spatial relationship, progress, or consequence; it does not exist merely as decoration. Motion must be brief, interruptible, and reduced or removed when the user prefers reduced motion. Sound may be an optional enhancement later, but no essential information or action may depend on it.

## Technology stack

- Next.js 15 App Router and React 19
- TypeScript with strict checking
- Prisma 7 and PostgreSQL
- Supabase authentication and server-managed sessions
- Zod for configuration and request validation
- ESLint, Vitest, Testing Library, and GitHub Actions

## Initial domain entities

These boundaries are now represented by the initial Prisma domain schema:

- **User profile**: application identity, display preferences, time zone, and progression summary
- **Mission**: user-owned task definition with schedule, priority, state, and optional recurrence
- **Recurrence rule**: repeat cadence and boundaries for mission generation
- **Daily plan**: a user's ordered, time-based mission view for a local calendar day
- **Focus session**: timed work interval associated with a user and optionally a mission
- **XP transaction**: immutable, idempotent record of earned or adjusted experience
- **Level**: progression threshold and derived user state
- **Streak**: consecutive qualifying-day state based on explicit time-zone rules
- **Achievement** and **user achievement**: milestone definition and earned record
- **User settings**: planning, appearance, notification, and accessibility preferences

## Authentication and authorisation approach

Supabase provides authentication. Sessions use server-managed cookies refreshed by middleware, and server authorisation verifies identity with `auth.getUser()` rather than trusting cookie contents. Roles are `USER`, `MANAGER`, and `ADMIN`, sourced only from trusted `app_metadata`; privileged roles are assigned only through a trusted server or the Supabase dashboard. All personal domain data will be user-owned and access-controlled server-side. Row-level security must be configured for every table exposed through Supabase before launch.

## Security principles

- Apply security headers centrally and define a final Content Security Policy before launch.
- Validate configuration and request payloads with Zod at trust boundaries.
- Keep the optional Supabase service-role key server-only and apply least privilege everywhere.
- Use stable public API errors; log actionable context while filtering secret-bearing fields.
- Never commit credentials, environment files, generated clients, or build output.
- Configure approved authentication redirect URLs and row-level security before launch.
- Replace the process-local rate limiter with a distributed adapter for horizontal scaling.
- Enable dependency scanning in the deployment platform.
- Follow the complete baseline in `docs/SECURITY.md`; this document supplements and does not override it.

## Architecture principles

- Prefer server components and server-side data access; introduce client components only for necessary interaction.
- Keep domain rules independent of presentation and external providers.
- Centralise authentication, authorisation, validation, logging, and error-handling boundaries.
- Route runtime database access through the shared database client.
- Model reward operations as atomic, auditable, and idempotent.
- Treat dates and time zones as explicit domain concerns.
- Evolve the schema through reviewed migrations; do not edit generated Prisma output.
- Add dependencies only when their value outweighs bundle, maintenance, and security costs.

## Current milestone

Task-backend phase: secure authenticated task and category APIs now connect the domain foundation to transactional application services. The Today interface remains a placeholder; recurrence, streaks, achievements, focus behavior, and analytics remain unimplemented.

## Completed work

- Production-oriented Next.js, TypeScript, Prisma, PostgreSQL, and Supabase foundation established
- Authentication examples for `/login`, `/protected`, and `/api/protected` retained for validation
- Central security baseline, validation, logging, health endpoint, tests, and continuous integration established
- DayQuest package metadata, application metadata, foundation homepage copy, and project documentation defined
- Generated and local environment paths excluded from version control
- Initial Prisma domain models and enums established for profiles, plans, tasks, recurrence, focus, XP, streak summaries, and achievements
- Idempotent system-achievement seed data defined without fake users or Supabase dependencies
- Database date/time conventions, indexes, uniqueness, history preservation, and deletion behavior documented
- Authenticated dashboard shell established with desktop and mobile navigation, top bar, secure user menu, loading and error states
- Placeholder routes established for today, week, missions, focus, achievements, analytics, and settings
- Shared typed navigation, responsive styling, keyboard support, reduced-motion handling, and route-level shell tests added
- Strict task and category request validation, public response mapping, and stable request-ID-aware API errors established
- User-scoped task CRUD, date moves, reorder, category listing/creation, completion, reopen, XP ledger, and progress updates implemented through service and repository layers
- Deterministic XP rewards and cumulative level calculation isolated and covered at boundary values

## Immediate next steps

1. Build the interactive Today planner UI against the authenticated task API with accessible loading, empty, validation, and optimistic-feedback states.
2. Add category selection and task scheduling controls using the documented local-date and integer-minute conventions.
3. Validate the task API and Today journey against a controlled Supabase environment, including concurrent completion requests.
4. Specify recurrence, streak, achievement, and focus-session behavior with testable examples before implementing those services.
5. Replace process-local mutation limiting with a distributed adapter before horizontally scaled deployment.

## Risks and architectural decisions

- **Time boundaries:** Daily plans and streaks are sensitive to user time zones and daylight-saving changes. Persist instants and explicit user time-zone context; test boundary cases.
- **Reward integrity:** Retries or repeated completion events could duplicate XP. Use idempotency and transactional persistence with an auditable XP ledger.
- **Recurrence complexity:** Editing one occurrence versus a series can create ambiguity. Define series semantics before schema implementation.
- **Motivation pressure:** Streaks can punish legitimate breaks. Provide transparent rules and avoid manipulative loss messaging.
- **Motion and sensory load:** Rich feedback can impair usability. Make motion purposeful, respect reduced motion, and keep all outcomes understandable without motion or sound.
- **Authorisation:** Application checks alone are insufficient for exposed database tables. Combine verified server identity, ownership checks, trusted roles, and configured row-level security.
- **Rate limiting:** The current limiter is process-local and is unsuitable for horizontally scaled production; adopt a distributed store before that deployment topology.
- **CSP:** The final asset and integration surface is not known yet; define and test a restrictive Content Security Policy before launch.
- **Scope control:** Social, leaderboard, AI scheduling, and marketplace capabilities remain outside the initial MVP to protect delivery focus.
- **Schema evolution:** The initial domain schema deliberately excludes automation and advanced recurrence structures. Evolve it only through reviewed migrations as product rules and service boundaries become concrete.
