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

  const workout = await createWorkout(userId, parsed.data);
  redirect(`/dashboard/workout/${workout.id}`);
}
