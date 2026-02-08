# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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
- `clerkMiddleware()` in `src/middleware.ts` handles auth
- Components: `SignInButton`, `SignUpButton`, `UserButton`, `SignedIn`, `SignedOut`
- Server-side auth: import `auth()` from `@clerk/nextjs/server` (use async/await)
- Environment variables in `.env.local`: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`

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

## Accessibility (MANDATORY)

Every component and page MUST be fully accessible. See `docs/ui.md` for complete accessibility rules — they are non-negotiable.
