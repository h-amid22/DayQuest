# Architecture

DayQuest uses the Next.js App Router. Pages and route handlers live in `app/`; reusable modules live in `lib/`. Database access uses the singleton in `lib/db.ts`, backed by Prisma's PostgreSQL adapter and a shared `pg` pool.

Public pages are organised in invisible `(marketing)` and `(auth)` route groups. Authenticated pages live in `(dashboard)` and resolve at `/today`, `/week`, `/missions`, `/focus`, `/achievements`, `/analytics`, and `/settings`; `/protected` is a compatibility redirect to `/today`. The dashboard layout verifies the Supabase user on the server and redirects unauthenticated requests to `/login` before rendering the shell. Middleware continues refreshing server-managed session cookies.

The authenticated shell is composed from server-rendered `AppShell` and `DashboardSidebar` components plus focused client boundaries for route-aware navigation, the native mobile navigation dialog, the top-bar user menu, pending logout feedback, and the route error retry action. A single typed navigation configuration supplies desktop, mobile, and page-title metadata. Logout remains a server action that calls Supabase sign-out before redirecting to `/login`; no session tokens cross component boundaries.

The top bar receives a preformatted date from the server to avoid hydration differences. It currently uses UTC as a documented deterministic placeholder until user profile time-zone reads are introduced. Progress, charts, mission lists, timers, and settings controls are presentation placeholders only and perform no planner database queries.

Supabase owns authentication. Authorization reads a generic role from trusted Supabase `app_metadata`; absent or invalid roles become `USER`. Prisma remains the application-data layer and is intentionally not coupled to the authentication provider's internal schema.

The initial domain layer models user profiles, daily plans, tasks and categories, recurring task definitions, focus sessions, XP history and cached progression, plus system achievements and per-user progress. User-owned records cascade with the application user, while optional and historical relationships use `SetNull` or `Restrict` to avoid accidental history loss. Planner calendar dates use PostgreSQL `date`; daily task times use integer minutes after local midnight. See [Database schema](DB_SCHEMA.md) for model and integrity details.

Domain mutations should live in service modules introduced with their API use cases, not in route handlers. Those services will enforce cross-user ownership, date/time validation, recurrence invariants, and atomic/idempotent progression updates. No generation, evaluation, or reward-calculation behavior is part of the schema milestone.

API routes should remain thin: validate input, authorize, apply rate limits, call a service, and serialize through shared response helpers. The in-memory limiter suits local or single-instance deployments; distributed deployments can replace its implementation without changing route contracts.
