import { z } from 'zod';
import { decimalSchema, idSchema, nameSchema } from './common';

const dateSchema = z.coerce.date();

const BaseLeadSchema = z.object({
  id: idSchema,
  first_name: nameSchema,
  last_name: nameSchema.optional().nullable(),
  phone: z.string().max(15),
  email: z.string().max(255).email('Invalid email.').optional().nullable(),
  community: z.string().max(50).optional().nullable(),
  area: z.string().max(50).optional().nullable(),
  walkin_date: dateSchema.optional().nullable(),
  expected_budget: decimalSchema.optional(),
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
  stage_id: idSchema.optional().nullable(),
  team_member_id: idSchema.optional().nullable(),
  instrument_ids: z.array(idSchema),
  source_id: idSchema.optional().nullable(),
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

const updateLeadSchema = BaseLeadSchema.partial().required({
  id: true,
  first_name: true,
  phone: true,
});

export { createLeadSchema, updateLeadSchema };

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
