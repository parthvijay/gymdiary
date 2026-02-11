import { and, asc, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { workouts, workoutExercises, sets } from "@/db/schema";

export async function createWorkout(
  userId: string,
  data: { name: string; date: string }
) {
  const [workout] = await db
    .insert(workouts)
    .values({ userId, name: data.name, date: data.date })
    .returning();
  return workout;
}

export async function getWorkoutsByDate(userId: string, date: string) {
  return db.query.workouts.findMany({
    where: and(eq(workouts.userId, userId), eq(workouts.date, date)),
    orderBy: [asc(workouts.startedAt)],
    with: {
      workoutExercises: {
        orderBy: [asc(workoutExercises.order)],
        with: {
          exercise: true,
          sets: {
            orderBy: [asc(sets.setNumber)],
          },
        },
      },
    },
  });
}

export async function getWorkoutById(userId: string, workoutId: string) {
  return db.query.workouts.findFirst({
    where: and(eq(workouts.userId, userId), eq(workouts.id, workoutId)),
    with: {
      workoutExercises: {
        orderBy: [asc(workoutExercises.order)],
        with: {
          exercise: true,
          sets: {
            orderBy: [asc(sets.setNumber)],
          },
        },
      },
    },
  });
}

export async function updateWorkout(
  userId: string,
  workoutId: string,
  data: { name: string; date: string }
) {
  const [workout] = await db
    .update(workouts)
    .set({ name: data.name, date: data.date })
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)))
    .returning();
  return workout;
}

export async function addExerciseToWorkout(
  userId: string,
  workoutId: string,
  exerciseId: string
) {
  const workout = await db.query.workouts.findFirst({
    where: and(eq(workouts.id, workoutId), eq(workouts.userId, userId)),
  });
  if (!workout) return null;

  const existing = await db.query.workoutExercises.findMany({
    where: eq(workoutExercises.workoutId, workoutId),
    orderBy: [desc(workoutExercises.order)],
    limit: 1,
  });
  const nextOrder = existing.length > 0 ? existing[0].order + 1 : 0;

  const [we] = await db
    .insert(workoutExercises)
    .values({ workoutId, exerciseId, order: nextOrder })
    .returning();
  return we;
}

export async function removeExerciseFromWorkout(
  userId: string,
  workoutExerciseId: string
) {
  const we = await db.query.workoutExercises.findFirst({
    where: eq(workoutExercises.id, workoutExerciseId),
    with: { workout: true },
  });
  if (!we || we.workout.userId !== userId) return null;

  await db
    .delete(workoutExercises)
    .where(eq(workoutExercises.id, workoutExerciseId));
  return true;
}

export async function addSetToExercise(
  userId: string,
  workoutExerciseId: string,
  data: { reps: number | null; weight: string | null }
) {
  const we = await db.query.workoutExercises.findFirst({
    where: eq(workoutExercises.id, workoutExerciseId),
    with: { workout: true },
  });
  if (!we || we.workout.userId !== userId) return null;

  const existingSets = await db.query.sets.findMany({
    where: eq(sets.workoutExerciseId, workoutExerciseId),
    orderBy: [desc(sets.setNumber)],
    limit: 1,
  });
  const nextSetNumber =
    existingSets.length > 0 ? existingSets[0].setNumber + 1 : 1;

  const [newSet] = await db
    .insert(sets)
    .values({
      workoutExerciseId,
      setNumber: nextSetNumber,
      reps: data.reps,
      weight: data.weight,
    })
    .returning();
  return newSet;
}

export async function removeSet(userId: string, setId: string) {
  const set = await db.query.sets.findFirst({
    where: eq(sets.id, setId),
    with: {
      workoutExercise: {
        with: { workout: true },
      },
    },
  });
  if (!set || set.workoutExercise.workout.userId !== userId) return null;

  await db.delete(sets).where(eq(sets.id, setId));
  return true;
}

export async function deleteWorkout(userId: string, workoutId: string) {
  const [deleted] = await db
    .delete(workouts)
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)))
    .returning();
  return deleted ?? null;
}

export type WorkoutWithDetails = Awaited<
  ReturnType<typeof getWorkoutsByDate>
>[number];
