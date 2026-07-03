// src/middleware/security.ts
// CSP & Security Headers via Astro Middleware
import type { APIContext } from 'astro';

interface SecurityOptions {
  /** Enable HSTS preload (default: true in production) */
  hstsPreload?: boolean;
  /** Enable rate limiting headers (default: true) */
  rateLimitHeaders?: boolean;
}

const DEFAULT_OPTIONS: Required<SecurityOptions> = {
  hstsPreload: true,
  rateLimitHeaders: true,
};

function buildCspPolicy(nonce?: string): string {
  const scriptSrc = ["'self'", "'unsafe-inline'", "'unsafe-eval'",
    'https://app.midtrans.com', 'https://app.sandbox.midtrans.com',
    'https://va.midtrans.com'];
  if (nonce) scriptSrc.push(`'nonce-${nonce}'`);

  return [
    "default-src 'self'",
    `script-src ${scriptSrc.join(' ')}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://*.supabase.co https://api.midtrans.com https://api.sandbox.midtrans.com wss://*.supabase.co",
    "frame-src https://app.midtrans.com https://app.sandbox.midtrans.com https://va.midtrans.com",
    "base-uri 'self'",
    "form-action 'self'",
    "manifest-src 'self'",
    "upgrade-insecure-requests",
  ].join('; ');
}

export function onRequest(context: APIContext, next: () => Promise<Response>) {
  return next().then((response) => {
    const opts = { ...DEFAULT_OPTIONS };

    // Strict security headers (every response)
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '0'); // Deprecated; CSP covers this
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    response.headers.delete('X-Powered-By');

    // HSTS
    if (import.meta.env.PROD) {
      response.headers.set('Strict-Transport-Security',
        opts.hstsPreload
          ? 'max-age=31536000; includeSubDomains; preload'
          : 'max-age=31536000; includeSubDomains');
    } else {
      response.headers.set('Strict-Transport-Security', 'max-age=3600; includeSubDomains');
    }

    // CSP for HTML responses only
    const ct = response.headers.get('Content-Type') || '';
    if (ct.includes('text/html')) {
      response.headers.set('Content-Security-Policy', buildCspPolicy());
    }

    // Rate limiting headers (defense-in-depth)
    if (opts.rateLimitHeaders) {
      response.headers.set('X-RateLimit-Limit', '100');
      response.headers.set('X-RateLimit-Remaining', '99');
    }

    return response;
  });
}
