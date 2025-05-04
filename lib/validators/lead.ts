import { z } from "zod";

export const createLeadSchema = z.object({
  first_name: z.string().nonempty("First name is required"),
  last_name: z.string().optional(),
  country_code: z.string().default("+91").optional(),
  phone: z.string().nonempty("Phone is required"),
  email: z.string().email("Invalid email").optional(),
  parent_name: z.string().optional(),
  parent_phone: z.string().optional(),
  source: z.string().optional(),
  source_detail: z.string().optional(),
  how_heard_about_us: z.string().optional(),
  walkin_date: z.string().optional(),
  location_name: z.string().optional(),
  subject_interested: z.string().optional(),
  expected_budget: z.string().optional(),
  stage_id: z.string().optional(),
  demo_taken: z.boolean().default(false).optional(),
  color_code: z.string().optional(),
  number_of_contact_attempts: z.number().default(0).optional(),
  last_contacted_date: z.string().optional(),
  next_followup: z.string().optional(),
  counselor_id: z.string().optional(),
});

export const updateLeadSchema = createLeadSchema.extend({
  id: z.string().length(14, "Invalid ID"),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
