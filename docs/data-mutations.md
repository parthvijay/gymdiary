# Data Mutation Standards

## Server Actions Only

**ALL data mutations MUST be done via Server Actions.** No exceptions.

Do NOT mutate data via:
- Route Handlers (`app/api/` routes)
- Client-side `fetch` calls
- Direct database calls inside Server Components
- `useEffect` or any client-side mutation library

## Server Action Files

Server Actions MUST live in colocated files named `actions.ts` inside the route segment that uses them.

```
src/app/dashboard/
  page.tsx            — Server Component (reads data, renders UI)
  actions.ts          — Server Actions for this page
  _components/
    workout-form.tsx  — Client Component (calls actions)
```

- Every `actions.ts` file MUST start with the `"use server"` directive at the top of the file.
- Do NOT define Server Actions inline inside Server Components or Client Components.
- Do NOT put Server Actions in `src/data/`. That directory is for data helper functions only.

```ts
// src/app/dashboard/actions.ts
"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createWorkout } from "@/data/workouts";
import { CreateWorkoutSchema } from "./schemas";

export async function createWorkoutAction(params: { name: string; date: string }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const parsed = CreateWorkoutSchema.safeParse(params);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await createWorkout(userId, parsed.data);
}
```

## Data Helper Functions (`src/data/`)

All database calls MUST live in helper functions inside `src/data/`. Server Actions call these helpers — they never use `db` directly.

- Use **Drizzle ORM** for every mutation. Do NOT use raw SQL.
- Each helper function MUST accept `userId` as its first argument and scope all operations to that user.
- Mutation helpers handle the database call only. They do NOT validate input or check auth — that is the Server Action's job.

```ts
// src/data/workouts.ts
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function createWorkout(userId: string, data: { name: string; date: string }) {
  const [workout] = await db
    .insert(workouts)
    .values({ userId, name: data.name, date: data.date })
    .returning();
  return workout;
}

export async function deleteWorkout(userId: string, workoutId: string) {
  await db
    .delete(workouts)
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)));
}
```

## Typed Parameters (No FormData)

Server Action parameters MUST be typed. Do NOT use `FormData` as a parameter type.

**Correct** — typed parameters:

```ts
"use server";

export async function updateExerciseAction(params: { id: string; name: string }) {
  // ...
}
```

**Incorrect** — FormData:

```ts
"use server";

// DO NOT do this
export async function updateExerciseAction(formData: FormData) {
  const name = formData.get("name") as string;
  // ...
}
```

When calling Server Actions from Client Components, pass a typed object:

```tsx
"use client";

import { updateExerciseAction } from "./actions";

function ExerciseForm({ exerciseId }: { exerciseId: string }) {
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const name = new FormData(form).get("name") as string;

    await updateExerciseAction({ id: exerciseId, name });
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* ... */}
    </form>
  );
}
```

## Zod Validation (MANDATORY)

Every Server Action MUST validate its arguments using **Zod**. No exceptions.

- Define Zod schemas in a colocated `schemas.ts` file next to the `actions.ts` file that uses them.
- Use `safeParse` — not `parse` — so validation errors are handled gracefully instead of throwing.
- Return structured error objects to the client. Do NOT throw validation errors.

```
src/app/dashboard/
  page.tsx
  actions.ts    — imports schemas, validates params
  schemas.ts    — Zod schemas for this route's actions
```

```ts
// src/app/dashboard/schemas.ts
import { z } from "zod";

export const CreateWorkoutSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  date: z.string().date("Invalid date format"),
});

export type CreateWorkoutInput = z.infer<typeof CreateWorkoutSchema>;
```

```ts
// src/app/dashboard/actions.ts
"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createWorkout } from "@/data/workouts";
import { CreateWorkoutSchema } from "./schemas";

export async function createWorkoutAction(params: {
  name: string;
  date: string;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const parsed = CreateWorkoutSchema.safeParse(params);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await createWorkout(userId, parsed.data);
  // revalidate or redirect as needed
}
```

### Validation Rules

1. **Always validate in the Server Action.** Even if the client validates too, the server is the source of truth.
2. **Use `safeParse`, not `parse`.** Never let Zod throw — return errors to the caller.
3. **Return field-level errors.** Use `parsed.error.flatten().fieldErrors` so Client Components can display errors per field.
4. **Do NOT validate inside `src/data/` helpers.** Helpers trust that the Server Action already validated the input.

## Authentication in Server Actions

Every Server Action MUST verify the user is authenticated before doing anything else.

```ts
"use server";

export async function someAction(params: { /* ... */ }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // validate, then mutate
}
```

- Call `auth()` at the top of every Server Action. Do NOT skip this.
- Redirect unauthenticated users — do NOT return an error for missing auth.
- Pass `userId` to all data helper functions. See `docs/data-fetching.md` for data isolation rules.

## Full Example

```
src/app/workouts/new/
  page.tsx        — Server Component
  actions.ts      — Server Actions
  schemas.ts      — Zod schemas
  _components/
    workout-form.tsx  — Client Component
```

**Schema:**

```ts
// src/app/workouts/new/schemas.ts
import { z } from "zod";

export const CreateWorkoutSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  date: z.string().date("Invalid date format"),
});
```

**Server Action:**

```ts
// src/app/workouts/new/actions.ts
"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createWorkout } from "@/data/workouts";
import { CreateWorkoutSchema } from "./schemas";

export async function createWorkoutAction(params: {
  name: string;
  date: string;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const parsed = CreateWorkoutSchema.safeParse(params);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await createWorkout(userId, parsed.data);
  revalidatePath("/workouts");
}
```

**Data Helper:**

```ts
// src/data/workouts.ts
import { db } from "@/db";
import { workouts } from "@/db/schema";

export async function createWorkout(userId: string, data: { name: string; date: string }) {
  const [workout] = await db
    .insert(workouts)
    .values({ userId, name: data.name, date: data.date })
    .returning();
  return workout;
}
```

**Client Component:**

```tsx
// src/app/workouts/new/_components/workout-form.tsx
"use client";

import { createWorkoutAction } from "../actions";

function WorkoutForm() {
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const result = await createWorkoutAction({
      name: formData.get("name") as string,
      date: formData.get("date") as string,
    });

    if (result?.error) {
      // display field errors
    }
  }

  return <form onSubmit={handleSubmit}>{/* ... */}</form>;
}
```

## Rules Summary

| Rule | Required |
|---|---|
| Mutate data via Server Actions only | Yes |
| Server Actions in colocated `actions.ts` files | Yes |
| `"use server"` directive at top of `actions.ts` | Yes |
| Typed parameters (no `FormData` type) | Yes |
| Validate all params with Zod (`safeParse`) | Yes |
| Zod schemas in colocated `schemas.ts` files | Yes |
| Authenticate with `auth()` in every Server Action | Yes |
| Database calls in `src/data/` helpers only | Yes |
| Use Drizzle ORM (no raw SQL) | Yes |
| Filter every mutation by `userId` | Yes |
| No Route Handlers for mutations | Yes |
| No client-side mutation calls | Yes |
