# DayQuest

> Plan your day. Complete your missions. Level up your life.

DayQuest is a gamified, highly interactive day planner that helps people organise their time, follow through on meaningful work, and understand their progress. Daily tasks become missions, focused effort builds momentum, and completion earns visible rewards without compromising the clarity expected from a professional planning tool.

## Project status

DayQuest is currently in the **foundation phase**. The repository provides the production-oriented application foundation, authentication examples, database tooling, tests, and security baseline. Planner functionality and its domain schema have not been implemented yet.

## Planned features

- Daily timeline and mission planning
- Weekly planning
- Task creation, organisation, completion, and recurring tasks
- XP, levels, streaks, and achievements
- Focus sessions
- Daily and weekly progress analytics
- Personal settings and accessibility preferences
- Secure authentication and protected user experiences

## Technology stack

- Next.js 15 App Router and React 19
- TypeScript in strict mode
- Prisma 7 with PostgreSQL
- Supabase authentication
- Zod validation
- ESLint
- Vitest and Testing Library
- GitHub Actions continuous integration

## Local development

Requirements:

- Node.js 20.19 or newer
- npm
- PostgreSQL (a Supabase database is supported)
- A Supabase project to validate the included authentication examples

Set up and start the application:

```bash
cp .env.example .env.local
npm install
npm run db:migrate
npm run dev
```

Open `http://localhost:3000`. The health endpoint is available at `GET /api/health`.

## Environment setup

Use `.env.example` as the sole reference for required and optional configuration. Copy it to a local environment file, supply your own development credentials, and never place secrets in source code. Public Supabase values are used by the authentication examples; administrative credentials must remain server-only.

## Available npm scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Run the production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Check TypeScript types |
| `npm test` | Run the test suite once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run db:generate` | Generate the Prisma client |
| `npm run db:migrate` | Create and apply a development migration |
| `npm run db:deploy` | Apply migrations in a deployment environment |
| `npm run db:seed` | Seed development data |
| `npm run db:studio` | Open Prisma Studio |

## Security

DayQuest uses centrally applied security headers, server-managed Supabase session cookies, server-side identity verification, trusted role metadata, validated configuration and request payloads, stable public API errors, secret-aware logging, and a server-only optional service-role client.

Before launch, deployment owners must configure approved authentication redirects and row-level security, adopt distributed rate limiting for horizontally scaled deployments, define the final Content Security Policy, and enable dependency scanning. See [Security](docs/SECURITY.md) for the authoritative baseline.

Never commit environment files, generated folders, build output, or local credentials. In particular, keep `.env`, `.env.local`, `.env.*.local`, `generated/prisma`, `.next`, and `node_modules` out of version control. Keep `.env.example` committed and free of secrets so it remains the canonical setup template.

Additional documentation is available in [Architecture](docs/ARCHITECTURE.md) and [Project context](PROJECTCONTEXT.md).
