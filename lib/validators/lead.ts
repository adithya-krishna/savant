import { z } from "zod";

export const LeadsSchema = z.object({
  id: z.string().length(14, "Invalid ID"),
  first_name: z.string().max(100).nonempty("First name is required."),
  last_name: z.string().max(100).optional().nullable(),
  phone: z.string().max(15).nonempty("Phone is required."),
  email: z.string().max(255).email("Invalid email.").optional().nullable(),
  address: z.string().optional().nullable(),
  area: z.string().optional().nullable(),
  walkin_date: z.string().optional().nullable(),
  expected_budget: z.string().optional().nullable(),
  demo_taken: z.boolean().optional().default(false),
  color_code: z.string().max(7).optional().nullable(),
  number_of_contact_attempts: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .default(0),
  last_contacted_date: z.string().optional().nullable(),
  next_followup: z.string().optional().nullable(),
  stage_id: z.string().max(20).optional().nullable(),
  team_member_id: z.string().max(20).optional().nullable(),
  instrument_id: z.string().max(20).optional().nullable(),
  source_id: z.string().max(20).optional().nullable(),
  create_date: z.date().optional().default(new Date()),
  updated_date: z.date().optional().default(new Date()),
});

export const createLeadSchema = LeadsSchema.omit({
  id: true,
  create_date: true,
  updated_date: true,
}).partial({
  last_name: true,
  address: true,
  area: true,
  email: true,
  walkin_date: true,
  expected_budget: true,
  demo_taken: true,
  color_code: true,
  number_of_contact_attempts: true,
  last_contacted_date: true,
  next_followup: true,
  stage_id: true,
  team_member_id: true,
  instrument_id: true,
  source_id: true,
});

export const updateLeadSchema = LeadsSchema.partial().required({ id: true });

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
