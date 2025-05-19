import { z } from "zod";
import { idSchema } from "./common";

export const createStageSchema = z.object({
  name: z.string().nonempty("Stage name is required"),
});

export const updateStageSchema = createStageSchema.extend({
  id: idSchema,
});

export type CreateStageInput = z.infer<typeof createStageSchema>;
export type UpdateStageInput = z.infer<typeof updateStageSchema>;
