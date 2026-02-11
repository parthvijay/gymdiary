import { z } from "zod";

export const UpdateWorkoutSchema = z.object({
  workoutId: z.string().uuid("Invalid workout ID"),
  name: z.string().min(1, "Name is required").max(100),
  date: z.string().date("Invalid date format"),
});

export type UpdateWorkoutInput = z.infer<typeof UpdateWorkoutSchema>;

export const AddExerciseSchema = z.object({
  workoutId: z.string().uuid("Invalid workout ID"),
  exerciseName: z.string().min(1, "Exercise name is required").max(255),
});

export const RemoveExerciseSchema = z.object({
  workoutId: z.string().uuid("Invalid workout ID"),
  workoutExerciseId: z.string().uuid("Invalid workout exercise ID"),
});

export const AddSetSchema = z.object({
  workoutId: z.string().uuid("Invalid workout ID"),
  workoutExerciseId: z.string().uuid("Invalid workout exercise ID"),
  reps: z.coerce.number().int().min(0, "Reps must be 0 or more").nullable(),
  weight: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Invalid weight format")
    .nullable(),
});

export const RemoveSetSchema = z.object({
  workoutId: z.string().uuid("Invalid workout ID"),
  setId: z.string().uuid("Invalid set ID"),
});

export const DeleteWorkoutSchema = z.object({
  workoutId: z.string().uuid("Invalid workout ID"),
  redirectDate: z.string().date("Invalid date format"),
});
