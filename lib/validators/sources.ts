import { z } from "zod";

const SourceSchema = z.object({
  id: z.string().length(14, "Invalid ID"),
  source: z.string().nonempty("A Source name is required"),
  description: z.string().optional().nullable(),
});

export const CreateSourceSchema = SourceSchema.omit({
  id: true,
}).partial({
  description: true,
});

export const UpdateSourceSchema = SourceSchema.partial().required({
  id: true,
});

export type CreateInstrumentInput = z.infer<typeof CreateSourceSchema>;
export type UpdateInstrumentInput = z.infer<typeof UpdateSourceSchema>;
