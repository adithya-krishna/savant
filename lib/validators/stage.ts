// lib/validators/stage.ts
import { z } from "zod";

export const createStageSchema = z.object({
  name: z.string().nonempty("Stage name is required"),
});

export const updateStageSchema = createStageSchema.extend({
  id: z.string().length(14, "Invalid ID"),
});

export type CreateStageInput = z.infer<typeof createStageSchema>;
export type UpdateStageInput = z.infer<typeof updateStageSchema>;
