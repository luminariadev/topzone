// src/middleware/auth.ts
// Astro middleware for role-based authentication and route protection
import type { APIContext } from 'astro';

const ADMIN_ROUTES: ReadonlyArray<string> = ['/admin'];
const PROTECTED_ROUTES: ReadonlyArray<string> = ['/checkout', '/profile', '/orders', '/order-detail'];

export function onRequest(context: APIContext, next: () => Promise<Response>) {
  const url = new URL(context.request.url);
  const path = url.pathname;

  // Skip auth for static assets and API routes (API handles its own auth)
  if (
    path.startsWith('/_astro') ||
    path.startsWith('/api') ||
    path.startsWith('/assets') ||
    path.startsWith('/auth') ||
    path.match(/\.(css|js|png|jpg|svg|ico|webp)$/)
  ) {
    return next();
  }

  // Admin routes: require admin cookie
  if (isAdminRoute(path)) {
    const adminToken = context.cookies.get('sb-admin-token')?.value;
    if (!adminToken) {
      return context.redirect('/login?reason=admin-required');
    }
  }

  // Protected routes: require auth cookie
  if (isProtectedRoute(path)) {
    const authToken = context.cookies.get('sb-auth-token')?.value;
    if (!authToken) {
      return context.redirect('/login?reason=auth-required');
    }
  }

  return next();
}

export function isProtectedRoute(path: string): boolean {
  return PROTECTED_ROUTES.some((route) => path.startsWith(route));
}

export function isAdminRoute(path: string): boolean {
  return ADMIN_ROUTES.some((route) => path.startsWith(route));
}

export function getAuthToken(context: APIContext): string | null {
  const cookies = context.request.headers.get('cookie') || '';
  const match = cookies.match(/sb-auth-token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}
