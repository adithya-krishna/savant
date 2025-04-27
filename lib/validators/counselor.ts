import { z } from "zod";

const phoneRegex = new RegExp(
  /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/
);

export const createCounselorSchema = z.object({
  first_name: z.string().nonempty("First name is required"),
  last_name: z.string().nonempty("Last name is required"),
  email: z.string().email("Invalid email").optional(),
  phone: z
    .string()
    .regex(phoneRegex, "Please enter a valid phone number")
    .nonempty("Phone number is required"),
  country_code: z.string().default("+91").optional(),
  role: z.string().optional(),
  active: z.boolean().default(true).optional(),
});

export const updateCounselorSchema = createCounselorSchema.extend({
  id: z.string().length(14, "Invalid ID"),
});

export type CreateCounselorInput = z.infer<typeof createCounselorSchema>;
export type UpdateCounselorInput = z.infer<typeof updateCounselorSchema>;
