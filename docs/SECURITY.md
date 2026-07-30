# Security baseline

- Security headers are applied centrally.
- Supabase sessions use server-managed cookies refreshed by middleware.
- Server authorization calls `auth.getUser()` instead of trusting cookie contents alone.
- Privileged roles come from `app_metadata`, not user-editable metadata.
- Zod validates configuration and request payloads.
- API errors use stable public messages; logs filter common secret-bearing fields.
- The service-role key is optional and server-only.
- Task and category APIs derive ownership exclusively from the server-verified Supabase user; request bodies cannot select a user.
- Task repository reads and writes include the authenticated user ID, and cross-user resources return the same `404` response as missing records.
- Strict Zod schemas reject unknown fields and prevent clients from setting XP, completion state, ownership, or internal relationship identifiers.
- Task mutations use stable public errors and request IDs; unexpected details are logged internally without returning Prisma or SQL messages.
- Completion, reopen, date moves, and reorder operations use database transactions. Completed-task deletion is blocked to protect audit history.

Before launch, configure redirect URLs and row-level security, choose a distributed rate limiter for horizontally scaled deployments, define a Content Security Policy for the final application, and add dependency scanning in the deployment platform.
