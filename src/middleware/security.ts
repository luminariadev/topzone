// src/middleware/security.ts
// CSP & Security Headers via Astro Middleware
import type { APIContext } from 'astro';

const CSP_POLICY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://app.midtrans.com https://app.sandbox.midtrans.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self'",
  "connect-src 'self' https://*.supabase.co https://api.midtrans.com https://api.sandbox.midtrans.com wss:",
  "frame-src https://app.midtrans.com https://app.sandbox.midtrans.com",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

export function onRequest(context: APIContext, next: () => Promise<Response>) {
  return next().then((response) => {
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Content-Security-Policy', CSP_POLICY);
    if (import.meta.env.PROD) {
      response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    }
    return response;
  });
}
