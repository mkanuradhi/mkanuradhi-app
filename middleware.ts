import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import Role from './enums/role';
 
// Middleware for next-intl
const intlMiddleware = createMiddleware(routing);

// Define role-based route matchers
const isProtectedRoute = createRouteMatcher([
  '/(si|en)/dashboard(.*)',  // Language-prefixed paths
]);
const isAdminRoute = createRouteMatcher([
  '/(si|en)/dashboard/blogs(.*)',
  '/(si|en)/dashboard/students(.*)',
  '/dashboard/blogs(.*)',
  '/dashboard/students(.*)',
]);
const isStudentRoute = createRouteMatcher([
  '/(si|en)/dashboard/courses(.*)',
  '/dashboard/courses(.*)',
]);

export default clerkMiddleware(async (authFn, req: NextRequest) => {
  const auth = await authFn();
  const { userId, sessionClaims } = auth;

  if (isProtectedRoute(req) && !userId) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  const memberRoles = sessionClaims?.metadata?.roles as Role[] || [];

  const isAdmin = memberRoles.includes(Role.ADMIN);
  const isStudent = memberRoles.includes(Role.STUDENT);

  // Enforce role-based access control
  if (isAdminRoute(req) && !isAdmin) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (isStudentRoute(req) && !isStudent) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // handle next-intl middleware for localization
  const intlResponse = intlMiddleware(req);
  if (intlResponse) {
    return intlResponse || NextResponse.next();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Clerk middleware matchers
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',

    // Protect dashboard routes
    "/dashboard/:path*",
    "/(si|en)/dashboard/:path*",

    // Match only internationalized pathnames
    '/',
    '/(si|en)/:path*',
    '/:path(home|teaching|research|publications|awards|experience|contact)*'
  ]
};