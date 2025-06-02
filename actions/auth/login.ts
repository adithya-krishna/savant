'use server';

import { signIn } from '@/auth';
import { LoginFormType, LoginSchema } from '@/lib/validators/login';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { AuthError } from 'next-auth';

export async function login(values: LoginFormType) {
  const validation = LoginSchema.safeParse(values);

  if (!validation.success) {
    return validation.error;
  }

  const { email, password } = validation.data;
  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin': {
          return {
            error: {
              title: 'Authentication Error',
              message:
                "Password mismatch. Please ensure you've entered the correct password.",
            },
          };
        }
        case 'EmailSignInError': {
          return {
            error: {
              title: 'User Not Found',
              message:
                'The email you entered does not match any account. Please verify and try again.',
            },
          };
        }
        default: {
          return {
            error: {
              title: 'Authentication Error',
              message: 'Something went wrong, please try again in some time.',
            },
          };
        }
      }
    }

    throw error;
  }
}
