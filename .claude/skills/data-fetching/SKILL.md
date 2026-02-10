---
description: "Data fetching standards — Server Components only, Drizzle ORM helpers in src/data/, user data isolation. Use when reading data from database or rendering user-specific content."
---

# Data Fetching Standards

## Server Components Only

**ALL data fetching MUST be done in React Server Components.** No exceptions.

Do NOT fetch data via:
- Route Handlers (`app/api/` routes)
- Client Components (`"use client"`)
- `useEffect`, `fetch` in the browser, or any client-side data fetching library (SWR, React Query, etc.)

Server Components call data helper functions directly. The data is passed to Client Components as props when interactivity is needed.

## Data Helper Functions (`/src/data/`)

All database queries MUST live in helper functions inside the `src/data/` directory.

- Use **Drizzle ORM** for every query. Do NOT use raw SQL.
- Each helper function must accept the authenticated user's ID and scope all queries to that user.
- Never expose a helper that can query across users.

Example structure:

```
src/data/
  workouts.ts    — getWorkouts(userId), createWorkout(userId, data), ...
  exercises.ts   — getExercises(userId), ...
```

Example helper:

```ts
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function getWorkouts(userId: string) {
  return db.select().from(workouts).where(eq(workouts.userId, userId));
}

export async function getWorkoutById(userId: string, workoutId: string) {
  const [workout] = await db
    .select()
    .from(workouts)
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)));
  return workout ?? null;
}
```

## User Data Isolation (CRITICAL)

A logged-in user must ONLY be able to access their own data. Every query MUST include a `userId` filter. There are no admin routes, no cross-user queries, no exceptions.

How to enforce this:

1. Obtain the user ID from Clerk's `auth()` in the Server Component.
2. Pass that user ID into the data helper function.
3. The helper function always filters by `userId`.

```tsx
// src/app/workouts/page.tsx (Server Component)
import { auth } from "@clerk/nextjs/server";
import { getWorkouts } from "@/data/workouts";

export default async function WorkoutsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const workouts = await getWorkouts(userId);
  return <WorkoutList workouts={workouts} />;
}
```

## Rules Summary

| Rule | Required |
|---|---|
| Fetch data in Server Components only | Yes |
| Use helper functions in `src/data/` | Yes |
| Use Drizzle ORM (no raw SQL) | Yes |
| Filter every query by `userId` | Yes |
| Never expose cross-user data | Yes |
| No Route Handlers for data fetching | Yes |
| No client-side data fetching | Yes |
