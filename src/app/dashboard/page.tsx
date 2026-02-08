"use client";

import { useState } from "react";
import { CalendarIcon, Dumbbell, Plus } from "lucide-react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Set {
  id: string;
  setNumber: number;
  reps: number | null;
  weight: string | null;
}

interface WorkoutExercise {
  id: string;
  exerciseName: string;
  order: number;
  sets: Set[];
}

interface Workout {
  id: string;
  name: string | null;
  date: string;
  startedAt: string | null;
  completedAt: string | null;
  exercises: WorkoutExercise[];
}

const MOCK_WORKOUTS: Workout[] = [
  {
    id: "1",
    name: "Morning Push Day",
    date: new Date().toISOString(),
    startedAt: new Date(new Date().setHours(7, 0, 0, 0)).toISOString(),
    completedAt: new Date(new Date().setHours(8, 15, 0, 0)).toISOString(),
    exercises: [
      {
        id: "e1",
        exerciseName: "Bench Press",
        order: 0,
        sets: [
          { id: "s1", setNumber: 1, reps: 10, weight: "135" },
          { id: "s2", setNumber: 2, reps: 8, weight: "155" },
          { id: "s3", setNumber: 3, reps: 6, weight: "175" },
        ],
      },
      {
        id: "e2",
        exerciseName: "Overhead Press",
        order: 1,
        sets: [
          { id: "s4", setNumber: 1, reps: 10, weight: "65" },
          { id: "s5", setNumber: 2, reps: 8, weight: "75" },
          { id: "s6", setNumber: 3, reps: 8, weight: "75" },
        ],
      },
      {
        id: "e3",
        exerciseName: "Tricep Pushdown",
        order: 2,
        sets: [
          { id: "s7", setNumber: 1, reps: 12, weight: "40" },
          { id: "s8", setNumber: 2, reps: 12, weight: "40" },
          { id: "s9", setNumber: 3, reps: 10, weight: "45" },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "Evening Cardio",
    date: new Date().toISOString(),
    startedAt: new Date(new Date().setHours(18, 0, 0, 0)).toISOString(),
    completedAt: null,
    exercises: [
      {
        id: "e4",
        exerciseName: "Treadmill Run",
        order: 0,
        sets: [{ id: "s10", setNumber: 1, reps: null, weight: null }],
      },
    ],
  },
];

function WorkoutCard({ workout }: { workout: Workout }) {
  const totalSets = workout.exercises.reduce(
    (sum, ex) => sum + ex.sets.length,
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
            {workout.startedAt &&
              format(new Date(workout.startedAt), "h:mm a")}
            {workout.startedAt && workout.completedAt && " – "}
            {workout.completedAt &&
              format(new Date(workout.completedAt), "h:mm a")}
            {!workout.startedAt && !workout.completedAt && "Not started"}
            {" · "}
            {workout.exercises.length}{" "}
            {workout.exercises.length === 1 ? "exercise" : "exercises"}
            {" · "}
            {totalSets} {totalSets === 1 ? "set" : "sets"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {workout.exercises.map((exercise, index) => (
            <section key={exercise.id} aria-label={exercise.exerciseName}>
              {index > 0 && <Separator className="mb-4" />}
              <h3 className="mb-2 text-sm font-medium">
                {exercise.exerciseName}
              </h3>
              <table
                className="w-full text-sm"
                aria-label={`Sets for ${exercise.exerciseName}`}
              >
                <thead>
                  <tr className="text-muted-foreground text-xs font-medium">
                    <th className="py-1 text-left font-medium">Set</th>
                    <th className="py-1 text-left font-medium">Reps</th>
                    <th className="py-1 text-left font-medium">Weight (lbs)</th>
                  </tr>
                </thead>
                <tbody>
                  {exercise.sets.map((set) => (
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

export default function DashboardPage() {
  const [date, setDate] = useState<Date>(new Date());

  // TODO: replace with actual data fetching based on `date`
  const workouts = MOCK_WORKOUTS;

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Button>
            <Plus aria-hidden="true" />
            New Workout
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
                aria-label="Pick a date"
              >
                <CalendarIcon aria-hidden="true" />
                {format(date, "PPP")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(day) => day && setDate(day)}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <section aria-label="Workouts list" className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">
          Workouts for {format(date, "MMMM d, yyyy")}
        </h2>

        {workouts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Dumbbell className="text-muted-foreground mb-3 size-10" aria-hidden="true" />
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
