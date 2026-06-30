// src/utils/helpers.ts
// Common helper functions for formatting, generation, and data manipulation

/**
 * Generate a URL-friendly slug from text
 * @param text - Text to convert to slug (e.g., "Mobile Legends Game")
 * @returns URL-friendly slug (e.g., "mobile-legends-game")
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[éèêë]/g, 'e')       // Accented chars to basic
    .replace(/[ïî]/g, 'i')
    .replace(/[æ]/g, 'ae')
    .replace(/[ü]/g, 'u')
    .replace(/[ÿ]/g, 'y')
    .replace(/[ç]/g, 'c')
    .replace(/[œ]/g, 'oe')
    .replace(/['']/g, '-')           // Apostrophes to -
    .replace(/[^a-z0-9-]/g, '')    // Remove invalid chars
    .replace(/-{2,}/g, '-')         // Replace multiple - with single -
    .replace(/^-|-$/g, '');         // Trim - from start/end
}

/**
 * Truncate text to max length with optional suffix
 * @param text - Text to truncate
 * @param maxLength - Maximum allowed length
 * @param suffix - Text to append if truncated (default: "...")
 * @returns Truncated text (not longer than maxLength)
 */
export function truncate(text: string, maxLength: number, suffix = '...'): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * Generate a unique order ID
 * @param prefix - Order ID prefix (default: "ORD")
 * @returns Unique order ID (e.g., "ORD-20240620-ABC123")
 */
export function generateOrderId(prefix = 'ORD'): string {
  const date = new Date();
  const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = prefix + '-' + dateStr + '-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Hash an email address for use as user identifier
 * @param email - Email address to hash
 * @returns Hashed email (safe for filenames, removes special chars)
 */
export function hashEmail(email: string): string {
  return email
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

/**
 * Convert a star rating to an array of full/empty star indicators
 * @param rating - Rating from 1-5 (or any number)
 * @param maxRating - Maximum possible rating (default: 5)
 * @returns Array of "full", "half", or "empty" strings
 */
export function getStarArray(rating: number, maxRating = 5): ('full' | 'half' | 'empty')[] {
  const stars = new Array(maxRating).fill('empty');
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;

  for (let i = 0; i < fullStars; i++) {
    stars[i] = 'full';
  }

  if (hasHalf && fullStars < maxRating) {
    stars[fullStars] = 'half';
  }

  return stars;
}

/**
 * Deep merge two objects (objects only, arrays will be replaced)
 * @param target - Target object
 * @param sources - Source object(s)
 * @returns Merged object
 */
export function deepMerge<T extends Record<string, unknown>, S extends Partial<T>>(target: T, ...sources: S[]): T {
  for (const source of sources) {
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        target[key] = deepMerge(target[key] || {} as T[string], source[key] as T[string]);
      } else {
        target[key] = source[key] as T[string];
      }
    }
  }
  return target;
}

/**
 * Dangerous HTML patterns to reject (defense-in-depth approach)
 */
const DANGEROUS_HTML_PATTERNS = [
  /<script\b[^>]*>/i,
  /javascript:/i,
  /on\w+\s*=/i,
  /<iframe\b[^>]*>/i,
  /<object\b[^>]*>/i,
  /<embed\b[^>]*>/i,
  /<form\b[^>]*>/i,
  /<input\b[^>]*>/i,
  /<base\b[^>]*href\s*=/i,
] as const;

/**
 * Check if HTML string contains dangerous patterns
 * @param html - HTML string to check
 * @returns true if safe, false if dangerous content detected
 */
export function isSafeHtml(html: string): boolean {
  return !DANGEROUS_HTML_PATTERNS.some(pattern => pattern.test(html));
}

/**
 * Sanitize HTML to prevent XSS (improved: rejects dangerous content, strips dangerous attributes)
 *
 * **Security note:** For user-facing HTML rendering, use a dedicated library like
 * DOMPurify or sanitize-html. This function provides basic defense-in-depth for
 * trusted server-side content only.
 *
 * @param html - HTML string to sanitize
 * @returns Sanitized HTML with dangerous content removed
 */
export function sanitizeHtml(html: string): string {
  let result = html;

  // Phase 1: Remove script tags and their content
  result = result.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');

  // Phase 2: Remove dangerous protocols
  result = result.replace(/javascript:/gi, '');
  result = result.replace(/vbscript:/gi, '');
  result = result.replace(/data:(?!image\/)/gi, '');

  // Phase 3: Remove inline event handlers
  result = result.replace(/\bon\w+\s*=\s*"[^"]*"/gi, '');
  result = result.replace(/\bon\w+\s*=\s*'[^']*'/gi, '');
  result = result.replace(/\bon\w+\s*=\s*[^\s>]+/gi, '');

  // Phase 4: Remove dangerous tags
  result = result.replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, '');
  result = result.replace(/<object\b[^>]*>[\s\S]*?<\/object>/gi, '');
  result = result.replace(/<embed\b[^>]*>/gi, '');
  result = result.replace(/<base\b[^>]*>/gi, '');
  result = result.replace(/<meta\b[^>]*http-equiv\s*=\s*["']refresh["'][^>]*>/gi, '');

  return result;
}

/**
 * Strip all HTML tags from a string (use for plain text extraction)
 * @param html - HTML string to strip
 * @returns Plain text without HTML tags
 */
export function stripHtmlTags(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}
