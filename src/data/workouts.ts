import { and, asc, eq } from "drizzle-orm";
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

export type WorkoutWithDetails = Awaited<
  ReturnType<typeof getWorkoutsByDate>
>[number];
