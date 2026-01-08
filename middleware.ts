import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
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

// Clerk middleware - only handles protected routes
const handleProtectedRoute = clerkMiddleware(async (auth, req: NextRequest) => {
  const p = req.nextUrl.pathname;

  const intlResponse = intlMiddleware(req);
  
  // Extract locale
  const localeMatch = p.match(/^\/(si|en)(\/|$)/);
  const locale = localeMatch ? localeMatch[1] : 'en';

  const { userId, sessionClaims } = await auth();

  // Redirect to sign-in if not authenticated
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

  return intlResponse || NextResponse.next();
});

// Main middleware function
const middleware = async (req: NextRequest, event: NextFetchEvent) => {
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

  // If it's a protected route, use Clerk middleware
  if (isProtectedRoute(req)) {
    return handleProtectedRoute(req, event);
  }

  // For public routes, just use intl middleware
  // This prevents Clerk from adding no-cache headers
  return intlMiddleware(req);
};

export default middleware;

export const config = {
  matcher: [
    "/",                 // Root path for locale detection
    "/(en|si)",          // Locale roots
    "/(en|si)/:path*"    // All localized pages
  ]
};