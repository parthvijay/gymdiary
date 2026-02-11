"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addExerciseAction } from "../actions";

interface AddExerciseFormProps {
  workoutId: string;
  userExercises: { id: string; name: string }[];
}

export function AddExerciseForm({
  workoutId,
  userExercises,
}: AddExerciseFormProps) {
  const [exerciseName, setExerciseName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const result = await addExerciseAction({
      workoutId,
      exerciseName: exerciseName.trim(),
    });

    if (result?.error) {
      const messages = Object.values(result.error).flat();
      setError(messages[0] ?? "Failed to add exercise");
      setSubmitting(false);
      return;
    }

    setExerciseName("");
    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2">
      <div className="flex flex-1 flex-col gap-2">
        <Label htmlFor="exercise-name">Exercise name</Label>
        <Input
          id="exercise-name"
          list="exercise-suggestions"
          value={exerciseName}
          onChange={(e) => setExerciseName(e.target.value)}
          placeholder="e.g. Bench Press, Squat"
          aria-describedby={error ? "exercise-error" : undefined}
          aria-invalid={error ? true : undefined}
        />
        <datalist id="exercise-suggestions">
          {userExercises.map((ex) => (
            <option key={ex.id} value={ex.name} />
          ))}
        </datalist>
        {error && (
          <p id="exercise-error" className="text-destructive text-sm">
            {error}
          </p>
        )}
      </div>
      <Button type="submit" disabled={submitting} aria-busy={submitting}>
        <Plus aria-hidden="true" />
        {submitting ? "Adding..." : "Add Exercise"}
      </Button>
    </form>
  );
}
