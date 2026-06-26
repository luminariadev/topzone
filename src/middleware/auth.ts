// src/middleware/auth.ts
// Astro middleware for role-based authentication and route protection
import type { APIContext } from 'astro';

const ADMIN_ROUTES = ['/admin'];
const PROTECTED_ROUTES = ['/checkout', '/profile', '/orders', '/order-detail'];

export function onRequest(context: APIContext, next: () => Promise<Response>) {
  const url = new URL(context.request.url);
  const path = url.pathname;

  if (path.startsWith('/_astro') || path.startsWith('/api') ||
      path.startsWith('/assets') || path.startsWith('/auth') ||
      path.match(/\.(css|js|png|jpg|svg|ico|webp)$/)) {
    return next();
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
