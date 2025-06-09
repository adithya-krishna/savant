import NextAuth from 'next-auth';
import authConfig from '@/auth.config';

import {
  DEFAULT_LOGIN_PAGE,
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from '@/routes';
import { NextResponse } from 'next/server';
import { format } from 'date-fns';

const { auth } = NextAuth(authConfig);

export default auth(req => {
  const { nextUrl } = req;

  if (nextUrl.pathname === '/slots') {
    const today = format(new Date(), 'yyyy-MM-dd');
    const url = nextUrl.clone();
    url.pathname = `/slots/${today}`;
    return NextResponse.redirect(url);
  }

  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      const url = new URL(DEFAULT_LOGIN_REDIRECT, nextUrl);
      return NextResponse.redirect(url);
    }
    return;
  }

  if (!isLoggedIn && !isPublicRoute) {
    const url = new URL(DEFAULT_LOGIN_PAGE, nextUrl);
    return NextResponse.redirect(url);
  }

  return;
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
