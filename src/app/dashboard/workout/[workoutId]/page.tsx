import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { getWorkoutById } from "@/data/workouts";
import { getExercisesByUser } from "@/data/exercises";
import { EditWorkoutForm } from "./_components/edit-workout-form";

export default async function EditWorkoutPage({
  params,
}: {
  params: Promise<{ workoutId: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const { workoutId } = await params;
  const workout = await getWorkoutById(userId, workoutId);
  if (!workout) notFound();

  const userExercises = await getExercisesByUser(userId);

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-8 text-3xl font-bold">Edit Workout</h1>
      <EditWorkoutForm workout={workout} userExercises={userExercises} />
    </div>
  );
}
