import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { NewWorkoutForm } from "./_components/new-workout-form";

export default async function NewWorkoutPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-8 text-3xl font-bold">New Workout</h1>
      <NewWorkoutForm />
    </div>
  );
}
