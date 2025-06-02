import Credentials from 'next-auth/providers/credentials';
import { type NextAuthConfig } from 'next-auth';
import { LoginSchema } from '@/lib/validators/login';
import { getUserByEmail } from '@/data/auth/user';
import bcrypt from 'bcryptjs';

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        const validation = LoginSchema.safeParse(credentials);
        if (validation.success) {
          const { email, password } = validation.data;
          const user = await getUserByEmail(email);
          if (!user || !user.password) {
            return null;
          }
          const passwordMatch = await bcrypt.compare(password, user.password);
          if (passwordMatch) return user;
        }
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
