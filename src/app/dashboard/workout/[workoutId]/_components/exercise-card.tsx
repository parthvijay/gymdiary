"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { removeExerciseAction, addSetAction, removeSetAction } from "../actions";

interface ExerciseCardProps {
  workoutId: string;
  workoutExercise: {
    id: string;
    exercise: { name: string };
    sets: {
      id: string;
      setNumber: number;
      reps: number | null;
      weight: string | null;
    }[];
  };
}

export function ExerciseCard({
  workoutId,
  workoutExercise,
}: ExerciseCardProps) {
  const [removingExercise, setRemovingExercise] = useState(false);
  const [removingSetId, setRemovingSetId] = useState<string | null>(null);
  const [addingSet, setAddingSet] = useState(false);
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleRemoveExercise() {
    setRemovingExercise(true);
    await removeExerciseAction({
      workoutId,
      workoutExerciseId: workoutExercise.id,
    });
    setRemovingExercise(false);
  }

  async function handleRemoveSet(setId: string) {
    setRemovingSetId(setId);
    await removeSetAction({ workoutId, setId });
    setRemovingSetId(null);
  }

  async function handleAddSet(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setAddingSet(true);

    const result = await addSetAction({
      workoutId,
      workoutExerciseId: workoutExercise.id,
      reps: reps ? Number(reps) : null,
      weight: weight || null,
    });

    if (result?.error) {
      const messages = Object.values(result.error).flat();
      setError(messages[0] ?? "Failed to add set");
      setAddingSet(false);
      return;
    }

    setReps("");
    setWeight("");
    setAddingSet(false);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">
            {workoutExercise.exercise.name}
          </CardTitle>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={handleRemoveExercise}
            disabled={removingExercise}
            aria-label={`Remove ${workoutExercise.exercise.name}`}
            aria-busy={removingExercise}
          >
            <X aria-hidden="true" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {workoutExercise.sets.length > 0 && (
          <table
            className="w-full text-sm"
            aria-label={`Sets for ${workoutExercise.exercise.name}`}
          >
            <thead>
              <tr className="text-muted-foreground text-xs font-medium">
                <th className="py-1 text-left font-medium">Set</th>
                <th className="py-1 text-left font-medium">Reps</th>
                <th className="py-1 text-left font-medium">Weight (lbs)</th>
                <th className="py-1 text-right font-medium">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {workoutExercise.sets.map((set) => (
                <tr key={set.id}>
                  <td className="py-1">{set.setNumber}</td>
                  <td className="py-1">{set.reps ?? "–"}</td>
                  <td className="py-1">{set.weight ?? "–"}</td>
                  <td className="py-1 text-right">
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => handleRemoveSet(set.id)}
                      disabled={removingSetId === set.id}
                      aria-label={`Remove set ${set.setNumber}`}
                      aria-busy={removingSetId === set.id}
                    >
                      <X aria-hidden="true" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <form
          onSubmit={handleAddSet}
          className="flex items-end gap-2"
          aria-label={`Add set to ${workoutExercise.exercise.name}`}
        >
          <div className="flex flex-col gap-1">
            <Label htmlFor={`reps-${workoutExercise.id}`} className="text-xs">
              Reps
            </Label>
            <Input
              id={`reps-${workoutExercise.id}`}
              type="number"
              min="0"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              placeholder="0"
              className="w-20"
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label
              htmlFor={`weight-${workoutExercise.id}`}
              className="text-xs"
            >
              Weight (lbs)
            </Label>
            <Input
              id={`weight-${workoutExercise.id}`}
              type="number"
              min="0"
              step="0.01"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="0"
              className="w-24"
            />
          </div>
          <Button
            type="submit"
            variant="outline"
            size="sm"
            disabled={addingSet}
            aria-busy={addingSet}
          >
            <Plus aria-hidden="true" />
            {addingSet ? "Adding..." : "Add Set"}
          </Button>
        </form>
        {error && (
          <p className="text-destructive text-sm" role="alert">
            {error}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
