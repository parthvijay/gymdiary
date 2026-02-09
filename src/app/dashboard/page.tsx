import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { format } from "date-fns";
import { Dumbbell, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getWorkoutsByDate, type WorkoutWithDetails } from "@/data/workouts";
import { DashboardDatePicker } from "./_components/date-picker";

function WorkoutCard({ workout }: { workout: WorkoutWithDetails }) {
  const totalSets = workout.workoutExercises.reduce(
    (sum, we) => sum + we.sets.length,
    0
  );
  const workoutName = workout.name ?? "Untitled Workout";

  return (
    <article aria-label={workoutName}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{workoutName}</CardTitle>
            {workout.completedAt ? (
              <Badge variant="default">Completed</Badge>
            ) : (
              <Badge variant="secondary">In Progress</Badge>
            )}
          </div>
          <CardDescription>
            {workout.startedAt && format(workout.startedAt, "h:mm a")}
            {workout.startedAt && workout.completedAt && " – "}
            {workout.completedAt && format(workout.completedAt, "h:mm a")}
            {!workout.startedAt && !workout.completedAt && "Not started"}
            {" · "}
            {workout.workoutExercises.length}{" "}
            {workout.workoutExercises.length === 1 ? "exercise" : "exercises"}
            {" · "}
            {totalSets} {totalSets === 1 ? "set" : "sets"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {workout.workoutExercises.map((we, index) => (
            <section key={we.id} aria-label={we.exercise.name}>
              {index > 0 && <Separator className="mb-4" />}
              <h3 className="mb-2 text-sm font-medium">{we.exercise.name}</h3>
              <table
                className="w-full text-sm"
                aria-label={`Sets for ${we.exercise.name}`}
              >
                <thead>
                  <tr className="text-muted-foreground text-xs font-medium">
                    <th className="py-1 text-left font-medium">Set</th>
                    <th className="py-1 text-left font-medium">Reps</th>
                    <th className="py-1 text-left font-medium">Weight (lbs)</th>
                  </tr>
                </thead>
                <tbody>
                  {we.sets.map((set) => (
                    <tr key={set.id}>
                      <td className="py-1">{set.setNumber}</td>
                      <td className="py-1">{set.reps ?? "–"}</td>
                      <td className="py-1">{set.weight ?? "–"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          ))}
        </CardContent>
      </Card>
    </article>
  );
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const params = await searchParams;
  const today = format(new Date(), "yyyy-MM-dd");
  const dateParam = params.date ?? today;
  const parsed = new Date(dateParam + "T00:00:00");
  const dateString = isNaN(parsed.getTime()) ? today : dateParam;
  const displayDate = isNaN(parsed.getTime()) ? new Date() : parsed;

  const workouts = await getWorkoutsByDate(userId, dateString);

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/dashboard/workout/new">
              <Plus aria-hidden="true" />
              New Workout
            </Link>
          </Button>
          <DashboardDatePicker date={displayDate} />
        </div>
      </div>

      <section aria-label="Workouts list" className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">
          Workouts for {format(displayDate, "MMMM d, yyyy")}
        </h2>

        {workouts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Dumbbell
                className="text-muted-foreground mb-3 size-10"
                aria-hidden="true"
              />
              <p className="text-muted-foreground text-sm">
                No workouts logged for this date.
              </p>
            </CardContent>
          </Card>
        ) : (
          workouts.map((workout) => (
            <WorkoutCard key={workout.id} workout={workout} />
          ))
        )}
      </section>
    </div>
  );
}
