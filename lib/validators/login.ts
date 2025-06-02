import { z } from 'zod';

const BaseLoginSchema = z.object({
  email: z.string().trim().email('Please enter a valid Email ID'),
  password: z.string().nonempty('Password cannot be empty'),
});

export type LoginFormType = z.infer<typeof BaseLoginSchema>;

export { BaseLoginSchema as LoginSchema };
