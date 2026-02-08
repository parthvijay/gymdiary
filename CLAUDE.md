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

Every component and page MUST be fully accessible. These rules are non-negotiable and apply to ALL code written in this project:

1. **Every form control MUST have a label.** Use the shadcn/ui `Label` component with `htmlFor`/`id` on every `Input`, `Select`, `Textarea`, `Switch`, `Checkbox`, and `RadioGroup`. If a visible label is not appropriate, use `sr-only` class. Never leave a form control unlabelled.
2. **Every `<img>` and `<Image>` MUST have an `alt` attribute.** Use descriptive text for meaningful images, `alt=""` for decorative ones.
3. **Every icon-only button MUST have `aria-label`.** If a `Button` contains only an icon and no visible text, it requires `aria-label` describing its action.
4. **Use semantic HTML.** Use `<nav>`, `<main>`, `<section>`, `<article>`, `<header>`, `<footer>`, `<h1>`–`<h6>` appropriately. Do not use `<div>` or `<span>` for interactive elements.
5. **Sections and landmark regions MUST have labels.** Use `aria-label` or `aria-labelledby` on `<section>`, `<nav>`, and other landmark elements.
6. **Never remove focus indicators.** Do not override or hide focus-visible styles provided by shadcn/ui.
7. **All interactive elements MUST be keyboard accessible.** Do not add `tabIndex="-1"` to interactive elements. Do not use `onClick` on non-interactive elements like `<div>` or `<span>` — use `<button>` or `<a>` instead.
8. **Use ARIA attributes for dynamic content.** Loading states need `aria-busy="true"`. Live updates need `aria-live`. Expanded/collapsed sections need `aria-expanded`.
9. **Maintain sufficient color contrast.** Use shadcn/ui theme tokens. Do not override colors with values that fail WCAG AA contrast (4.5:1 for text, 3:1 for large text/UI).
10. **Pages MUST have a single `<h1>` and headings must not skip levels.** Use `<h1>` → `<h2>` → `<h3>` in order.
