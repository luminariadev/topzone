// src/lib/csrf.ts
// CSRF Token generation and validation utility

const CSRF_COOKIE_NAME = 'topzone_csrf';
const CSRF_HEADER_NAME = 'x-csrf-token';

/**
 * Generate a CSRF token.
 * Falls back from Web Crypto API to Math.random-based generation
 * for environments where Crypto is unavailable.
 */
export function generateCsrfToken(): string {
  try {
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const array = new Uint8Array(32);
      crypto.getRandomValues(array);
      return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }
  } catch {
    // Fall through to Math.random fallback
  }
  // Fallback for environments without Web Crypto (some server runtimes)
  return Array.from({ length: 64 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
}

/**
 * Validate a CSRF token from request header against cookie.
 * Uses constant-time comparison to prevent timing attacks.
 */
export function validateCsrfToken(requestCsrf: string | null, cookieCsrf: string | null): boolean {
  if (!requestCsrf || !cookieCsrf) return false;
  if (requestCsrf.length !== cookieCsrf.length) return false;
  let result = 0;
  for (let i = 0; i < requestCsrf.length; i++) {
    result |= requestCsrf.charCodeAt(i) ^ cookieCsrf.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Create Set-Cookie header for CSRF token
 */
export function setCsrfCookieHeader(token: string): string {
  const secure = typeof window === 'undefined' || location.protocol === 'https:';
  return `${CSRF_COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400${secure ? '; Secure' : ''}`;
}

export { CSRF_COOKIE_NAME, CSRF_HEADER_NAME };
