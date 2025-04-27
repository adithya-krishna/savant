// lib/validators/counselor.ts
import { z } from "zod";

export const createCounselorSchema = z.object({
  first_name: z.string().nonempty("First name is required"),
  last_name: z.string().nonempty("Last name is required"),
  email: z.string().email("Invalid email").optional(),
  phone: z.string().nonempty("Phone number is required"),
  country_code: z.string().nonempty().default("+91"),
  role: z.string().optional(),
  active: z.boolean().default(true),
});

export const updateCounselorSchema = createCounselorSchema.extend({
  id: z.string().length(14, "Invalid ID"),
});

export type CreateCounselorInput = z.infer<typeof createCounselorSchema>;
export type UpdateCounselorInput = z.infer<typeof updateCounselorSchema>;
