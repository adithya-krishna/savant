'use server';

import { getUserByEmail } from '@/data/auth/user';
import { db } from '@/db';
import { hashPassword } from '@/lib/utils/hash';
import { RegisterSchema, RegisterFormType } from '@/lib/validators/register';

export async function register(values: RegisterFormType) {
  const validation = RegisterSchema.safeParse(values);

  if (!validation.success) {
    return validation.error;
  }

  const { email, password } = validation.data;

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return {
      error: { message: 'Email already exists, try logging in instead' },
    };
  }

  const hashedPassword = await hashPassword(password);

  await db.user.create({
    data: {
      ...validation.data,
      password: hashedPassword,
    },
  });

  return { success: { message: 'Registraion successful!' } };
}
