// src/middleware/security.ts
// CSP & Security Headers via Astro Middleware
import type { APIContext } from 'astro';

const CSP_POLICY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://app.midtrans.com https://app.sandbox.midtrans.com https://va.midtrans.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://*.supabase.co https://api.midtrans.com https://api.sandbox.midtrans.com wss://*.supabase.co",
  "frame-src https://app.midtrans.com https://app.sandbox.midtrans.com https://va.midtrans.com",
  "base-uri 'self'",
  "form-action 'self'",
  "manifest-src 'self'",
].join('; ');

export function onRequest(context: APIContext, next: () => Promise<Response>) {
  return next().then((response) => {
    // Security headers
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

    // CSP for HTML responses only
    const ct = response.headers.get('Content-Type') || '';
    if (ct.includes('text/html')) {
      response.headers.set('Content-Security-Policy', CSP_POLICY);
    }

    // HSTS — enforced in production with preload readiness
    if (import.meta.env.PROD) {
      response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    } else {
      response.headers.set('Strict-Transport-Security', 'max-age=3600; includeSubDomains');
    }

    return response;
  });
}
