import { and, asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { workouts, workoutExercises, sets } from "@/db/schema";

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

export type WorkoutWithDetails = Awaited<
  ReturnType<typeof getWorkoutsByDate>
>[number];
