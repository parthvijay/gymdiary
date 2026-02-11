import { and, asc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { exercises } from "@/db/schema";

export async function getExercisesByUser(userId: string) {
  return db.query.exercises.findMany({
    where: eq(exercises.userId, userId),
    orderBy: [asc(exercises.name)],
  });
}

export async function getOrCreateExercise(userId: string, name: string) {
  const trimmed = name.trim();

  const existing = await db.query.exercises.findFirst({
    where: and(
      eq(exercises.userId, userId),
      sql`lower(${exercises.name}) = lower(${trimmed})`
    ),
  });
  if (existing) return existing;

  const [created] = await db
    .insert(exercises)
    .values({ userId, name: trimmed })
    .returning();
  return created;
}
