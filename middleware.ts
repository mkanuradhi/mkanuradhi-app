import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextResponse } from 'next/server';
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import Role from './enums/role';

const intlMiddleware = createMiddleware(routing);

// Define role-based route matchers
const isProtectedRoute = createRouteMatcher([
  '/(si|en)/dashboard(.*)',
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
const isPublicStaticPage = createRouteMatcher([
  '/(si|en)/policy',
  '/(si|en)/contact',
  '/(si|en)/experience',
  '/(si|en)', // homepage
]);

export default clerkMiddleware(async (auth, req) => {
  console.log(`Middleware invoked for: ${req.nextUrl.pathname}`);
  if (isPublicStaticPage(req)) {
    return intlMiddleware(req);
  }
  console.log(`----- Not a public page: ${req.nextUrl.pathname}`);

  const { pathname } = req.nextUrl;
  const locale = pathname.split('/')[1] || 'en';
  console.log(`---- Detected locale: ${locale}`);

  // Handle Protected Routes
  if (isProtectedRoute(req)) {
    const { userId, sessionClaims } = await auth();
    
    // Redirect if no user
    if (!userId) {
      return NextResponse.redirect(new URL(`/${locale}/sign-in`, req.url));
    }

    const memberRoles = sessionClaims?.metadata?.roles as Role[] || [];
    const isAdmin = memberRoles.includes(Role.ADMIN);
    const isStudent = memberRoles.includes(Role.STUDENT);

    // Redirect with locale if no roles
    if (memberRoles.length === 0) {
      return NextResponse.redirect(new URL(`/${locale}`, req.url));
    }

    // Enforce role-based access
    if (isAdminRoute(req) && !isAdmin) {
      return NextResponse.redirect(new URL(`/${locale}`, req.url));
    }

    if (isStudentRoute(req) && !isStudent) {
      return NextResponse.redirect(new URL(`/${locale}`, req.url));
    }
  }

  // Apply Internationalization
  return intlMiddleware(req);
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html|css|js|json|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
