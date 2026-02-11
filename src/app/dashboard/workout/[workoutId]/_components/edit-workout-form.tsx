"use client";

import { useState } from "react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { CalendarIcon, Dumbbell, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import type { WorkoutWithDetails } from "@/data/workouts";
import { updateWorkoutAction, deleteWorkoutAction } from "../actions";
import { AddExerciseForm } from "./add-exercise-form";
import { ExerciseCard } from "./exercise-card";

interface EditWorkoutFormProps {
  workout: WorkoutWithDetails;
  userExercises: { id: string; name: string }[];
}

export function EditWorkoutForm({
  workout,
  userExercises,
}: EditWorkoutFormProps) {
  const [date, setDate] = useState<Date>(parseISO(workout.date));
  const [errors, setErrors] = useState<{
    workoutId?: string[];
    name?: string[];
    date?: string[];
  }>({});
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    await deleteWorkoutAction({
      workoutId: workout.id,
      redirectDate: workout.date,
    });
    setDeleting(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const result = await updateWorkoutAction({
      workoutId: workout.id,
      name: formData.get("name") as string,
      date: format(date, "yyyy-MM-dd"),
    });

    if (result?.error) {
      setErrors(result.error);
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Workout Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                list="workout-name-suggestions"
                defaultValue={workout.name ?? ""}
                placeholder="e.g. Upper Body, Leg Day"
                aria-describedby={errors.name ? "name-error" : undefined}
                aria-invalid={errors.name ? true : undefined}
              />
              <datalist id="workout-name-suggestions">
                <option value="Upper Body" />
                <option value="Lower Body" />
                <option value="Push" />
                <option value="Pull" />
                <option value="Leg Day" />
                <option value="Chest & Triceps" />
                <option value="Back & Biceps" />
                <option value="Shoulders & Arms" />
                <option value="Full Body" />
                <option value="Cardio" />
                <option value="Core" />
              </datalist>
              {errors.name && (
                <p id="name-error" className="text-destructive text-sm">
                  {errors.name[0]}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="date-trigger">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date-trigger"
                    variant="outline"
                    className={cn(
                      "w-[240px] justify-start text-left font-normal"
                    )}
                    aria-label={`Pick a date, currently ${format(date, "PPP")}`}
                  >
                    <CalendarIcon aria-hidden="true" />
                    {format(date, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(day) => day && setDate(day)}
                  />
                </PopoverContent>
              </Popover>
              {errors.date && (
                <p id="date-error" className="text-destructive text-sm">
                  {errors.date[0]}
                </p>
              )}
            </div>

            {errors.workoutId && (
              <p className="text-destructive text-sm" role="alert">
                {errors.workoutId[0]}
              </p>
            )}

            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={submitting}
                aria-busy={submitting}
              >
                {submitting ? "Saving..." : "Save Changes"}
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Separator />

      <section aria-label="Exercises" aria-live="polite">
        <h2 className="mb-4 text-xl font-semibold">Exercises</h2>

        {workout.workoutExercises.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Dumbbell
                className="text-muted-foreground mb-3 size-10"
                aria-hidden="true"
              />
              <p className="text-muted-foreground text-sm">
                No exercises added yet. Add your first exercise below.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col gap-4">
            {workout.workoutExercises.map((we) => (
              <ExerciseCard
                key={we.id}
                workoutId={workout.id}
                workoutExercise={we}
              />
            ))}
          </div>
        )}

        <div className="mt-4">
          <AddExerciseForm
            workoutId={workout.id}
            userExercises={userExercises}
          />
        </div>
      </section>

      <Separator />

      <section aria-label="Danger zone">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" disabled={deleting} aria-busy={deleting}>
              <Trash2 aria-hidden="true" />
              {deleting ? "Deleting..." : "Delete Workout"}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this workout?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the workout, all its exercises, and
                all sets. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </section>
    </div>
  );
}
