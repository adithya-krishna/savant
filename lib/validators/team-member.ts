import { z } from "zod";

const phoneRegex = new RegExp(
  /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/
);

export const TeamMemberRoleEnum = z.enum([
  "STAFF",
  "INSTRUCTOR",
  "ADMIN",
  "SUPER_ADMIN",
]);

export const TeamMemberSchema = z.object({
  id: z.string().max(20),
  first_name: z.string().max(100).nonempty("First name is required"),
  last_name: z.string().max(100).nonempty("Last name is required"),
  email: z.string().max(255).email("Invalid email").optional().nullable(),
  phone: z
    .string()
    .regex(phoneRegex, "Please enter a valid phone number")
    .nonempty("Phone number is required"),
  role: TeamMemberRoleEnum.default("STAFF"),
  active: z.boolean().optional().default(true),
  create_date: z.date().optional().default(new Date()),
  updated_date: z.date().optional().default(new Date()),
});

export const createTeamMemberSchema = TeamMemberSchema.omit({
  id: true,
  create_date: true,
  updated_date: true,
}).partial({
  email: true,
  role: true,
  active: true,
});

export const updateTeamMemberSchema = TeamMemberSchema.partial().required({
  id: true,
});

export type CreateTeamMemberInput = z.infer<typeof createTeamMemberSchema>;
export type UpdateTeamMemberInput = z.infer<typeof updateTeamMemberSchema>;
