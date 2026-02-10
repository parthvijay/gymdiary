"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { updateWorkout } from "@/data/workouts";
import { UpdateWorkoutSchema } from "./schemas";

export async function updateWorkoutAction(params: {
  workoutId: string;
  name: string;
  date: string;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const parsed = UpdateWorkoutSchema.safeParse(params);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const workout = await updateWorkout(
    userId,
    parsed.data.workoutId,
    { name: parsed.data.name, date: parsed.data.date }
  );

  if (!workout) {
    return { error: { workoutId: ["Workout not found"] } };
  }

  redirect(`/dashboard?date=${parsed.data.date}`);
}
