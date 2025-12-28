import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import Role from './enums/role';
 
// Middleware for next-intl
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

export default clerkMiddleware(async (authFn, req: NextRequest) => {
  const p = req.nextUrl.pathname;

  // For root path, let intl middleware handle locale detection first
  if (p === '/') {
    return intlMiddleware(req);
  }

  // Block aggressive bots to reduce invocations
  const userAgent = req.headers.get('user-agent') || '';
  const badBots = [
    'AhrefsBot', 'SemrushBot', 'MJ12bot', 'DotBot', 
    'BLEXBot', 'DataForSeoBot'
  ];
  if (badBots.some(bot => userAgent.toLowerCase().includes(bot.toLowerCase()))) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  // Extract locale from path (si or en)
  const localeMatch = p.match(/^\/(si|en)(\/|$)/);
  const locale = localeMatch ? localeMatch[1] : 'en';

  // Process internationalization first
  const intlResponse = intlMiddleware(req);

  // If NOT a protected route, return early
  if (!isProtectedRoute(req)) {
    return intlResponse || NextResponse.next();
  }

  const auth = await authFn();
  const { userId, sessionClaims } = auth;

  // Redirect to sign-in with locale prefix if not authenticated
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

  // Enforce role-based access with locale
  if (isAdminRoute(req) && !isAdmin) {
    return NextResponse.redirect(new URL(`/${locale}`, req.url));
  }

  if (isStudentRoute(req) && !isStudent) {
    return NextResponse.redirect(new URL(`/${locale}`, req.url));
  }

  return intlResponse || NextResponse.next();
});

export const config = {
  matcher: [
    "/",                 // Root path for locale detection
    "/(en|si)",          // Locale roots
    "/(en|si)/:path*"    // All localized pages
  ]
};