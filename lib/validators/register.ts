import { z } from 'zod';

export const RegisterSchema = z.object({
  email: z.string().trim().email(),
  name: z.string().trim().nonempty('Please enter your full name'),
  username: z.string().trim().optional(),
  password: z
    .string()
    .trim()
    .min(8, 'Password must be at least 8 characters long'),
});

export type RegisterFormType = z.infer<typeof RegisterSchema>;
