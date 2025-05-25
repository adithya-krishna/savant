import { z } from 'zod';
import { idSchema, nameSchema, priceSchema } from './common';

const dateSchema = z.coerce.date();

const BaseLeadSchema = z.object({
  id: idSchema,
  first_name: nameSchema,
  last_name: z.string().optional().nullable(),
  phone: z.string().max(15),
  email: z.string().max(255).optional().nullable(),
  community: z.string().max(50).optional().nullable(),
  area: z.string().max(50).optional().nullable(),
  walkin_date: dateSchema.optional().nullable(),
  expected_budget: priceSchema.optional(),
  demo_taken: z.boolean().optional().nullable().default(false),
  number_of_contact_attempts: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .nullable()
    .default(0),
  last_contacted_date: dateSchema.optional().nullable(),
  next_followup: dateSchema.optional().nullable(),
  stage_id: z.string().optional().nullable(),
  team_member_id: z.string().optional().nullable(),
  instrument_ids: z.array(z.string()).optional().nullable(),
  source_id: z.string().optional().nullable(),
  create_date: dateSchema.optional().nullable().default(new Date()),
  updated_date: dateSchema.optional().nullable().default(new Date()),
});

const createLeadSchema = BaseLeadSchema.omit({
  id: true,
  create_date: true,
  updated_date: true,
})
  .partial()
  .required({ first_name: true, phone: true });

const updateLeadSchema = BaseLeadSchema.omit({ expected_budget: true })
  .partial()
  .required({
    id: true,
  });

export { createLeadSchema, updateLeadSchema };

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
