"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  updateWorkout,
  deleteWorkout,
  addExerciseToWorkout,
  removeExerciseFromWorkout,
  addSetToExercise,
  removeSet,
} from "@/data/workouts";
import { getOrCreateExercise } from "@/data/exercises";
import {
  UpdateWorkoutSchema,
  DeleteWorkoutSchema,
  AddExerciseSchema,
  RemoveExerciseSchema,
  AddSetSchema,
  RemoveSetSchema,
} from "./schemas";

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

export async function addExerciseAction(params: {
  workoutId: string;
  exerciseName: string;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const parsed = AddExerciseSchema.safeParse(params);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const exercise = await getOrCreateExercise(userId, parsed.data.exerciseName);
  const result = await addExerciseToWorkout(
    userId,
    parsed.data.workoutId,
    exercise.id
  );

  if (!result) {
    return { error: { workoutId: ["Workout not found"] } };
  }

  revalidatePath(`/dashboard/workout/${parsed.data.workoutId}`);
  return { success: true };
}

export async function removeExerciseAction(params: {
  workoutId: string;
  workoutExerciseId: string;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const parsed = RemoveExerciseSchema.safeParse(params);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await removeExerciseFromWorkout(userId, parsed.data.workoutExerciseId);
  revalidatePath(`/dashboard/workout/${parsed.data.workoutId}`);
  return { success: true };
}

export async function addSetAction(params: {
  workoutId: string;
  workoutExerciseId: string;
  reps: number | null;
  weight: string | null;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const parsed = AddSetSchema.safeParse(params);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const result = await addSetToExercise(
    userId,
    parsed.data.workoutExerciseId,
    { reps: parsed.data.reps, weight: parsed.data.weight }
  );

  if (!result) {
    return { error: { workoutExerciseId: ["Exercise not found"] } };
  }

  revalidatePath(`/dashboard/workout/${parsed.data.workoutId}`);
  return { success: true };
}

export async function removeSetAction(params: {
  workoutId: string;
  setId: string;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const parsed = RemoveSetSchema.safeParse(params);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await removeSet(userId, parsed.data.setId);
  revalidatePath(`/dashboard/workout/${parsed.data.workoutId}`);
  return { success: true };
}

export async function deleteWorkoutAction(params: {
  workoutId: string;
  redirectDate: string;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const parsed = DeleteWorkoutSchema.safeParse(params);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const deleted = await deleteWorkout(userId, parsed.data.workoutId);
  if (!deleted) {
    return { error: { workoutId: ["Workout not found"] } };
  }

  redirect(`/dashboard?date=${parsed.data.redirectDate}`);
}
