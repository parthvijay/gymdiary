import { z } from "zod";

export const UpdateWorkoutSchema = z.object({
  workoutId: z.string().uuid("Invalid workout ID"),
  name: z.string().min(1, "Name is required").max(100),
  date: z.string().date("Invalid date format"),
});

export type UpdateWorkoutInput = z.infer<typeof UpdateWorkoutSchema>;
