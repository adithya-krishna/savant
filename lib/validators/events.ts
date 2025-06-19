import { z } from 'zod';
import { idSchema } from './common';

const isoDate = z.string().transform(s => new Date(s));

export const baseEventSchema = z.object({
  id: idSchema,
  title: z.string().max(255),
  description: z.string().max(65_535).optional().nullable(),
  start_date_time: isoDate,
  end_date_time: isoDate,
  host_id: idSchema,
  created_by_id: idSchema.optional().nullable(),
  guests: z.array(idSchema).optional(),
});

export const createEventSchema = baseEventSchema.omit({ id: true }).required({
  title: true,
  start_date_time: true,
  end_date_time: true,
  host_id: true,
  guests: true,
});

export const updateEventSchema = baseEventSchema.partial().required({
  id: true,
});

export type EventCreateInput = z.infer<typeof createEventSchema>;
export type EventUpdateInput = z.infer<typeof updateEventSchema>;
