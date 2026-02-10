"use client";

import { useState } from "react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
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
import { updateWorkoutAction } from "../actions";

interface EditWorkoutFormProps {
  workout: {
    id: string;
    name: string | null;
    date: string;
  };
}

export function EditWorkoutForm({ workout }: EditWorkoutFormProps) {
  const [date, setDate] = useState<Date>(parseISO(workout.date));
  const [errors, setErrors] = useState<{
    workoutId?: string[];
    name?: string[];
    date?: string[];
  }>({});
  const [submitting, setSubmitting] = useState(false);

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
              defaultValue={workout.name ?? ""}
              placeholder="e.g. Upper Body, Leg Day"
              aria-describedby={errors.name ? "name-error" : undefined}
              aria-invalid={errors.name ? true : undefined}
            />
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
            <Button type="submit" disabled={submitting} aria-busy={submitting}>
              {submitting ? "Saving..." : "Save Changes"}
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard">Cancel</Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
