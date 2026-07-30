# Next.js Prisma Supabase Starter

A strict, production-oriented starting point for Next.js App Router applications using Prisma 7, PostgreSQL, and optional Supabase authentication.

## Requirements

- Node.js 20.19 or newer
- PostgreSQL (a Supabase database works)
- A Supabase project when using the authentication examples

## Setup

```bash
cp .env.example .env
npm install
npm run db:migrate
npm run dev
```

Open `http://localhost:3000`. Check `GET /api/health` for a JSON health response.

## Environment

| Variable | Purpose | Required |
| --- | --- | --- |
| `DATABASE_URL` | Pooled application PostgreSQL connection | Yes |
| `DIRECT_URL` | Direct connection for migrations and seeds | Yes |
| `NEXT_PUBLIC_SUPABASE_URL` | Public Supabase project URL | For auth |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public Supabase anonymous key | For auth |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only administrative client | No |
| `LOG_LEVEL` | `debug`, `info`, `warn`, or `error` | No |

Never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser or commit `.env`.

## Prisma

```bash
npm run db:generate
npm run db:migrate
npm run db:deploy
npm run db:seed
npm run db:studio
```

The client is generated into `generated/prisma` during `postinstall`, so generated files are not committed. Runtime queries should import `db` from `@/lib/db`. The development seed creates `developer@example.test` in the application database; it does not create a Supabase Auth identity.

## Supabase authentication

Set the project URL and anonymous key, enable email/password authentication, and create a test identity in Supabase. `/login`, `/protected`, and `/api/protected` demonstrate server-side login, logout, session verification, and access to a current user.

Roles are `USER`, `MANAGER`, and `ADMIN`, read from the authenticated user's trusted `app_metadata.role`. Assign privileged roles only through a trusted server or the Supabase dashboard. Configure row-level security separately for every exposed Supabase table.

## Quality checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

GitHub Actions runs the same checks for pushes and pull requests.

## Deployment

Provide all required environment variables on the deployment platform, run `npm run db:deploy` as a controlled release step, and run `npm run build`. The included rate limiter is process-local; replace it with a distributed adapter when deploying multiple instances. The admin Supabase client remains unavailable unless its optional service-role key is configured.

See [architecture](docs/ARCHITECTURE.md), [security](docs/SECURITY.md), and [project context](PROJECTCONTEXT.md).
