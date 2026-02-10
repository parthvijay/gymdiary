# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

- `npm run dev` - Start development server
- `npm run build` - Production build
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Architecture

Next.js 16 App Router with React 19, TypeScript 5, Tailwind CSS 4, Drizzle ORM, and Clerk auth.

**Project Structure:**

- `src/app/` - App Router pages and layouts
- `src/data/` - Database helper functions (Drizzle ORM)
- `src/components/ui/` - shadcn/ui components (do not modify)
- `src/db/` - Database schema and connection
- `src/proxy.ts` - Clerk auth middleware (Next.js 16 convention)
- `public/` - Static assets

## Coding Standards

Standards for auth, data fetching, data mutations, and UI are available as skills and will load automatically when relevant. Key rules at a glance:

- **Auth**: Clerk only, `await auth()` in Server Components, always check `userId`
- **Data fetching**: Server Components only, helpers in `src/data/`, filter by `userId`
- **Data mutations**: Server Actions in colocated `actions.ts`, Zod validation, typed params
- **UI**: shadcn/ui only, all accessibility rules mandatory

## TypeScript Configuration

- **Strict mode enabled** (`strict: true`)
- Path alias: `@/*` maps to `./src/*`
- Target: ES2017, module resolution: bundler

## Git Workflow

**NEVER push directly to `main`.** Always:

1. Create a branch from `main` with a relevant prefix: `feature/`, `fix/`, `docs/`, `refactor/`, `chore/`
2. Commit and push to that branch
3. Open a PR to merge into `main`

**One PR per context.** Don't mix unrelated changes in a single PR. If a task involves distinct concerns (e.g., config changes and feature work), split them into separate branches and PRs.

**Commits** must use **Conventional Commits** (`conventionalcommits.org`):

- Format: `<type>(<optional scope>): <description>`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`, `build`
- Use lowercase, imperative mood, no period at the end
- Add a body for non-trivial changes explaining the "why"
- Examples: `feat: add workout logging page`, `fix(auth): handle expired session redirect`
