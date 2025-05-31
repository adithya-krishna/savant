import { z } from 'zod';
import { idSchema } from './common';

const dateSchema = z.coerce.date();

const EventSeriesBaseSchema = z.object({
  id: idSchema,
  title: z.string().trim().nonempty('Title cannot be empty'),
  recurrence_rule: z
    .string()
    .trim()
    .nonempty('Recurrence string cannot be empty'),
  start_date: dateSchema,
  end_date: dateSchema.optional().nullable(),
  host_id: idSchema.optional().nullable(),
  enrollment_id: idSchema.optional().nullable(),
  created_at: dateSchema.default(new Date()),
  updated_at: dateSchema.default(new Date()),
});

export const EventSeriesCreateSchema = EventSeriesBaseSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
}).partial({
  end_date: true,
  host_id: true,
  enrollment_id: true,
});

export const EventSeriesUpdateSchema = EventSeriesBaseSchema.partial().required(
  { id: true },
);

export type EventSeriesCreateInput = z.infer<typeof EventSeriesCreateSchema>;
export type EventSeriesUpdateInput = z.infer<typeof EventSeriesUpdateSchema>;
