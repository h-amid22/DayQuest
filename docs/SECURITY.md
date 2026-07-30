# Security baseline

- Security headers are applied centrally.
- Supabase sessions use server-managed cookies refreshed by middleware.
- Server authorization calls `auth.getUser()` instead of trusting cookie contents alone.
- Privileged roles come from `app_metadata`, not user-editable metadata.
- Zod validates configuration and request payloads.
- API errors use stable public messages; logs filter common secret-bearing fields.
- The service-role key is optional and server-only.

Before launch, configure redirect URLs and row-level security, choose a distributed rate limiter for horizontally scaled deployments, define a Content Security Policy for the final application, and add dependency scanning in the deployment platform.
