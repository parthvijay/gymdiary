---
description: "Authentication patterns with Clerk — server-side auth, client components, protected pages, middleware setup. Use when implementing auth flows, protecting pages, or working with user sessions."
---

# Authentication Standards

## Provider: Clerk Only

This project uses **Clerk** (`@clerk/nextjs`) as its sole authentication provider. All authentication must go through Clerk.

### Rules

1. **No other auth libraries.** Do not install or use any other authentication library (e.g., NextAuth, Auth.js, Lucia, custom JWT). Clerk handles everything.
2. **Do not roll custom auth logic.** No manual token validation, no custom session management, no password hashing. Clerk manages the full auth lifecycle.
3. **Environment variables must be set.** `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` must be defined in `.env.local`. Never commit these values to version control.

## Middleware

Auth middleware lives in `src/proxy.ts` (Next.js 16 convention). It uses `clerkMiddleware()` to protect routes.

```ts
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();
```

- Do NOT create a separate `src/middleware.ts` file. Next.js 16 uses `src/proxy.ts`.
- Do NOT modify the matcher unless you need to exclude additional static file patterns.
- The middleware runs on all routes except Next.js internals and static assets.

## ClerkProvider

`ClerkProvider` wraps the entire application in `src/app/layout.tsx`. This is required for all Clerk components and hooks to work.

- Do NOT move `ClerkProvider` to a nested layout. It must remain at the root.
- Do NOT add a second `ClerkProvider` anywhere in the component tree.

## Server-Side Auth

Use `auth()` from `@clerk/nextjs/server` in Server Components to get the authenticated user.

```tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // userId is now guaranteed to be a string
  const data = await getData(userId);
  return <PageContent data={data} />;
}
```

### Rules

1. **Always `await` the `auth()` call.** It is async in `@clerk/nextjs/server`.
2. **Always check for `userId` before proceeding.** If `userId` is `null`, the user is not authenticated — redirect them.
3. **Pass `userId` to all data helper functions.** Never query data without scoping to the authenticated user. See the data-fetching skill for details.
4. **Do NOT use `auth()` in Client Components.** It is a server-only function. Client Components receive user data via props or Clerk's client-side components.

## Client-Side Auth Components

Use Clerk's pre-built components for all auth UI. Do NOT build custom sign-in/sign-up forms.

| Component | Purpose |
|---|---|
| `SignedIn` | Renders children only when the user is authenticated |
| `SignedOut` | Renders children only when the user is NOT authenticated |
| `SignInButton` | Triggers the Clerk sign-in flow |
| `SignUpButton` | Triggers the Clerk sign-up flow |
| `UserButton` | Displays user avatar with profile/sign-out menu |

All components are imported from `@clerk/nextjs`:

```tsx
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
```

### Rules

1. **Use `mode="modal"` for sign-in and sign-up.** This keeps users on the current page instead of navigating away.
2. **Wrap sign-in/sign-up buttons in shadcn/ui `Button` components.** Clerk components accept children for custom styling.
3. **Use `SignedIn` and `SignedOut` for conditional rendering.** Do not manually check auth state in Client Components.

```tsx
<SignedOut>
  <SignInButton mode="modal">
    <Button variant="ghost">Sign In</Button>
  </SignInButton>
</SignedOut>
<SignedIn>
  <UserButton />
</SignedIn>
```

## Protected Pages

Every page that displays user-specific data MUST verify authentication at the top of the Server Component.

```tsx
const { userId } = await auth();
if (!userId) redirect("/sign-in");
```

- Do NOT rely solely on middleware for page protection. Always check `userId` in the Server Component before fetching data.
- Do NOT render a page with empty or default data for unauthenticated users. Redirect immediately.

## Rules Summary

| Rule | Required |
|---|---|
| Use Clerk as the only auth provider | Yes |
| Middleware in `src/proxy.ts` | Yes |
| `ClerkProvider` at root layout only | Yes |
| `await auth()` in Server Components for user ID | Yes |
| Check `userId` and redirect if null | Yes |
| Pass `userId` to all data queries | Yes |
| Use Clerk components for auth UI | Yes |
| Use `mode="modal"` for sign-in/sign-up | Yes |
| No custom auth forms or flows | Yes |
| No auth secrets committed to version control | Yes |
