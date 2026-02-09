# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Before Writing Any Code

**ALWAYS read the relevant documentation in `docs/` BEFORE implementing anything.** These documents define the project's patterns, conventions, and mandatory standards. Code that ignores them will need to be rewritten.

| Document | Covers |
|---|---|
| `docs/auth.md` | Authentication — Clerk setup, server-side auth, client components, protected pages |
| `docs/data-fetching.md` | Data fetching — Server Components, data helpers, user data isolation |
| `docs/data-mutations.md` | Data mutations — Server Actions, Zod validation, typed params, data helpers |
| `docs/ui.md` | UI components — shadcn/ui only, accessibility rules, styling |

## Build & Development Commands

- `npm run dev` - Start development server
- `npm run build` - Production build
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Architecture

This is a Next.js 16 application using the **App Router** (not Pages Router).

**Tech Stack:**

- Next.js 16 with React 19
- TypeScript 5
- Tailwind CSS 4 for styling
- ESLint 9 with Next.js core-web-vitals and TypeScript rules

**Project Structure:**

- `src/app/` - App Router pages and layouts
- `src/proxy.ts` - Clerk authentication proxy (Next.js 16 convention)
- `public/` - Static assets

## Authentication

Uses **Clerk** (`@clerk/nextjs`) for authentication:

- `ClerkProvider` wraps the app in `layout.tsx`
- `clerkMiddleware()` in `src/proxy.ts` handles auth (Next.js 16 convention)
- Components: `SignInButton`, `SignUpButton`, `UserButton`, `SignedIn`, `SignedOut`
- Server-side auth: import `auth()` from `@clerk/nextjs/server` (use async/await)
- Environment variables in `.env.local`: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`
- See `docs/auth.md` for full authentication coding standards

## TypeScript Configuration

- **Strict mode enabled** (`strict: true`) - enforces stricter type checking
- Path alias: `@/*` maps to `./src/*` for cleaner imports
- Target: ES2017
- Module resolution: bundler (optimized for Next.js)
- Incremental compilation enabled for faster builds

## UI Components

- **ONLY use shadcn/ui components** — no custom UI components, no third-party UI libraries
- Install components via `npx shadcn@latest add <component>`
- Do not modify generated files in `src/components/ui/`
- See `docs/ui.md` for full UI coding standards

**Styling:**

- Tailwind CSS with PostCSS
- Global CSS variables in `globals.css` for theming
- Light/dark mode via `prefers-color-scheme`
- Geist font family (sans and mono)

## Data Fetching (CRITICAL)

- **ALL data fetching MUST happen in Server Components** — no Route Handlers, no client-side fetching
- Database queries MUST use helper functions in `src/data/` with **Drizzle ORM** (no raw SQL)
- Every query MUST filter by `userId` — a user can ONLY access their own data
- See `docs/data-fetching.md` for full data fetching standards

## Data Mutations (CRITICAL)

- **ALL data mutations MUST be done via Server Actions** in colocated `actions.ts` files
- Mutations MUST call helper functions in `src/data/` — never use `db` directly in actions
- Server Action parameters MUST be typed — do NOT use `FormData`
- ALL Server Actions MUST validate arguments with **Zod** (`safeParse`)
- See `docs/data-mutations.md` for full data mutation standards

## Git Workflow

**NEVER push directly to `main`.** Always:

1. Create a branch from `main` with a relevant prefix: `feature/`, `fix/`, `docs/`, `refactor/`, `chore/`
2. Commit and push to that branch
3. Open a PR to merge into `main`

**Commits** must use **Conventional Commits** (`conventionalcommits.org`):

- Format: `<type>(<optional scope>): <description>`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`, `build`
- Use lowercase, imperative mood, no period at the end
- Add a body for non-trivial changes explaining the "why"
- Examples: `feat: add workout logging page`, `fix(auth): handle expired session redirect`

## Accessibility (MANDATORY)

Every component and page MUST be fully accessible. See `docs/ui.md` for complete accessibility rules — they are non-negotiable.
