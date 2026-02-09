import { z } from "zod";

export const CreateWorkoutSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  date: z.string().date("Invalid date format"),
});

export type CreateWorkoutInput = z.infer<typeof CreateWorkoutSchema>;
