import { z } from 'zod';
import { idSchema } from './common';

const SourceSchema = z.object({
  id: idSchema,
  source: z.string().nonempty('A Source name is required'),
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
