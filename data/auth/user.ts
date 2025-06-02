import { db } from '@/db';

export async function getUserByEmail(email: string) {
  try {
    const existingUser = await db.user.findUnique({
      where: { email },
    });
    return existingUser;
  } catch {
    return null;
  }
}
