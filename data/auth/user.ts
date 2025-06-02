import { db } from '@/db';

export async function getUserByEmail(email: string) {
  try {
    const existingUser = await db.user.findUnique({
      where: { email },
      select: { id: true, email: true, emailVerified: true, password: true },
    });
    return existingUser;
  } catch {
    return null;
  }
}
