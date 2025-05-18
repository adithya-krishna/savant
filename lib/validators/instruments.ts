import { z } from "zod";

const InstrumentSchema = z.object({
  id: z.string().length(14, "Invalid ID"),
  name: z.string().nonempty("An Instrument name is required"),
  description: z.string().optional().nullable(),
  create_date: z.date().optional().default(new Date()),
  updated_date: z.date().optional().default(new Date()),
});

export const CreateInstrumentSchema = InstrumentSchema.omit({
  id: true,
  create_date: true,
  updated_date: true,
}).partial({
  description: true,
});

export const UpdateInstrumentSchema = InstrumentSchema.partial().required({
  id: true,
});

export type CreateInstrumentInput = z.infer<typeof CreateInstrumentSchema>;
export type UpdateInstrumentInput = z.infer<typeof UpdateInstrumentSchema>;
