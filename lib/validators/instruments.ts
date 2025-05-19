import { z } from 'zod';
import { idSchema, nameSchema } from './common';

const InstrumentBaseSchema = z.object({
  id: idSchema,
  name: nameSchema,
  description: z
    .string()
    .max(255, { message: 'Description must be 255 characters or less' })
    .optional(),
});

const InstrumentCreateSchema = InstrumentBaseSchema.omit({ id: true })
  .partial({ description: true })
  .required({ name: true });

const InstrumentUpdateSchema = InstrumentBaseSchema.partial().required({
  name: true,
});

export { InstrumentBaseSchema, InstrumentCreateSchema, InstrumentUpdateSchema };

export type CreateInstrumentInput = z.infer<typeof InstrumentCreateSchema>;
export type UpdateInstrumentInput = z.infer<typeof InstrumentUpdateSchema>;
