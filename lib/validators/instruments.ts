import { z } from "zod";

const InstrumentSchema = z.object({
  id: z.string().length(14, "Invalid ID"),
  name: z.string().nonempty("An Instrument name is required"),
  description: z.string().optional().nullable(),
});

export const CreateInstrumentSchema = InstrumentSchema.omit({
  id: true,
}).partial({
  description: true,
});

export const UpdateInstrumentSchema = InstrumentSchema.partial().required({
  id: true,
});

export type CreateInstrumentInput = z.infer<typeof CreateInstrumentSchema>;
export type UpdateInstrumentInput = z.infer<typeof UpdateInstrumentSchema>;
