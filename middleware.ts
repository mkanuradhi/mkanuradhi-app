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
  '/(si|en)/dashboard/courses(.*)',
  '/(si|en)/dashboard/publications(.*)',
  '/(si|en)/dashboard/students(.*)',
]);
const isStudentRoute = createRouteMatcher([
  '/(si|en)/dashboard/student/courses(.*)',
]);

export default clerkMiddleware(async (authFn, req: NextRequest) => {
  // Process internationalization first, but do NOT override authentication
  const intlResponse = intlMiddleware(req);

  // If the requested page is NOT a protected route, just return the intl response
  if (!isProtectedRoute(req)) {
    return intlResponse || NextResponse.next();
  }

  const auth = await authFn();
  const { userId, sessionClaims } = auth;

  // If user tries to access protected routes but is not signed in, redirect to sign-in
  if (!userId) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  const memberRoles = sessionClaims?.metadata?.roles as Role[] || [];

  const isAdmin = memberRoles.includes(Role.ADMIN);
  const isStudent = memberRoles.includes(Role.STUDENT);

  // If user has no roles, redirect them to the home page
  if (memberRoles.length === 0) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Enforce role-based access control
  if (isAdminRoute(req) && !isAdmin) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (isStudentRoute(req) && !isStudent) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return intlResponse || NextResponse.next();
});

export const config = {
  matcher: [
    // Clerk middleware matchers
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',

    // Protect dashboard routes
    "/(si|en)/dashboard/:path*",

    // Match only internationalized pathnames
    '/',
    '/(si|en)/:path*'
  ]
};