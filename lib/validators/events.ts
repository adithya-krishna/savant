import { z } from 'zod';
import { idSchema } from './common';

const isoDate = z.string().transform(s => new Date(s));

export const baseEventSchema = z.object({
  id: idSchema,
  title: z.string().max(255),
  description: z.string().max(65_535).optional().nullable(),
  start_date_time: isoDate,
  end_date_time: isoDate,
  series_id: idSchema.optional().nullable(),
  host_id: idSchema.optional().nullable(),
  created_by_id: idSchema.optional().nullable(),
  guests: z.array(idSchema).optional(),
});

export const createEventSchema = baseEventSchema
  .omit({
    id: true,
    created_by_id: true,
  })
  .extend({
    created_by_id: idSchema.optional(),
  });

export const updateEventSchema = baseEventSchema.partial().required({
  id: true,
});

export type EventCreateInput = z.infer<typeof createEventSchema>;
export type EventUpdateInput = z.infer<typeof updateEventSchema>;
