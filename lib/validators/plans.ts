import { z } from 'zod';
import { priceSchema } from './common';

const PlansSchema = z.object({
  code: z.string().length(6, 'Invalid ID'),
  name: z.string().nonempty('A Plan name is required'),
  price: priceSchema,
  total_slots: z
    .number({
      required_error: 'Total slots is required.',
      invalid_type_error: 'Total slots must be a number.',
    })
    .positive('Total slots must be a non-negative number.'),
  description: z.string().optional().nullable(),
});

export const CreatePlanSchema = PlansSchema.omit({
  code: true,
})
  .partial({
    description: true,
  })
  .required({
    name: true,
    price: true,
  });

export const UpdatePlanSchema = PlansSchema.partial().required({
  code: true,
});

export type CreatePlanInput = z.infer<typeof CreatePlanSchema>;
export type UpdatePlanInput = z.infer<typeof UpdatePlanSchema>;
