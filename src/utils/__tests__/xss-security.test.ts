import { describe, it, expect } from 'vitest';
import { sanitizeHtml, isSafeHtml, stripHtmlTags } from '../helpers';
import { sanitizeInput } from '../validation';

describe('XSS Security: Review & Search Input', () => {
  describe('Review text input XSS', () => {
    const xssPayloads = [
      '<script>alert("xss")</script>',
      '<img src=x onerror=alert(1)>',
      '<a href="javascript:alert(1)">click</a>',
      '<svg onload=alert(1)>',
      '<input type="text" value="test" onfocus=alert(1) autofocus>',
      '<body onload=alert(1)>',
      '<iframe src="http://evil.com"></iframe>',
      '<object data="evil.swf"></object>',
      '<embed src="evil.swf">',
      '<form action="http://evil.com"><button>Submit</button></form>',
      '<base href="http://evil.com">',
      '"><script>alert(1)</script>',
      `';alert(1);//`,
      `<details open ontoggle=alert(1)>`,
      `<math><mtext><table><mglyph><svg><mtext><textarea><a onclick=alert(1)>test</a></textarea></math>`,
      `<link rel="stylesheet" href="http://evil.com/style.css">`,
      `<meta http-equiv="refresh" content="0;url=http://evil.com">`,
    ];

    it('should detect all XSS payloads as unsafe via isSafeHtml', () => {
      // Remove non-HTML JS injection (not caught by HTML pattern check)
      const nonHtmlPayload = "';alert(1);//";
      const htmlXssPayloads = xssPayloads.filter(p => p !== nonHtmlPayload);
      
      htmlXssPayloads.forEach(payload => {
        expect(isSafeHtml(payload)).toBe(false);
      });
    });

    it('should remove script tags from review text', () => {
      const result = sanitizeHtml('<script>alert("xss")</script><p>Good review</p>');
      expect(result).not.toContain('<script>');
      expect(result).toContain('<p>Good review</p>');
    });

    it('should strip javascript: protocol from links', () => {
      const result = sanitizeHtml('<a href="javascript:alert(1)">Link</a>');
      expect(result).not.toContain('javascript:');
    });

    it('should remove iframe from review text', () => {
      const result = sanitizeHtml('<iframe src="http://evil.com"></iframe><p>Review</p>');
      expect(result).not.toContain('<iframe');
      expect(result).toContain('<p>Review</p>');
    });

    it('should remove event handlers from HTML', () => {
      const result = sanitizeHtml('<img src="x.png" onerror="alert(1)">');
      expect(result).not.toContain('onerror');
    });

    it('should handle nested XSS vectors', () => {
      const nested = '<<script>alert(1)</script>normal';
      // Sanitize should process it
      const result = sanitizeHtml(nested);
      expect(result).not.toContain('<script>');
    });

    it('should strip all HTML from review plain-text fallback', () => {
      const result = stripHtmlTags('<b>Great</b> <i>game!</i><script>bad</script>');
      // stripHtmlTags only removes tags, not content inside script tags
      // For plain text extraction without script content, use sanitizeHtml first
      expect(result).toBe('Great game!bad');
    });

    it('should handle empty review text', () => {
      expect(sanitizeHtml('')).toBe('');
      expect(isSafeHtml('')).toBe(true);
    });
  });

  describe('Search input sanitization', () => {
    const searchXssPayloads = [
      '<script>alert(1)</script>',
      '"><img src=x onerror=alert(1)>',
      '/><svg onload=alert(1)>',
      `';--"<script>alert(1)</script>`,
      '<marquee><h1>XSS</h1></marquee>',
    ];

    it('should strip HTML special chars from search input via sanitizeInput', () => {
      searchXssPayloads.forEach(payload => {
        const sanitized = sanitizeInput(payload);
        expect(sanitized).not.toContain('<');
        expect(sanitized).not.toContain('>');
        expect(sanitized).not.toContain('"');
        expect(sanitized).not.toContain("'");
        expect(sanitized).not.toContain('&');
      });
    });

    it('should truncate long search inputs to 500 chars', () => {
      const longInput = 'A'.repeat(1000);
      const result = sanitizeInput(longInput);
      expect(result.length).toBeLessThanOrEqual(500);
    });

    it('should allow safe search query text', () => {
      const safeQueries = [
        'mobile legends',
        'MLBB diamond',
        'keyboard mechanical',
        'gaming gear murah',
        'top up 2024',
        'jual voucher game',
      ];
      safeQueries.forEach(query => {
        const sanitized = sanitizeInput(query);
        expect(sanitized).toBe(query.trim());
      });
    });

    it('should handle empty search input', () => {
      expect(sanitizeInput('')).toBe('');
      expect(sanitizeInput('   ')).toBe('');
    });
  });

  describe('SOP / Protokol berbahaya', () => {
    it('should reject vbscript protocol in sanitizeHtml', () => {
      const result = sanitizeHtml('<a href="vbscript:msgbox(1)">VBS</a>');
      expect(result).not.toContain('vbscript:');
    });

    it('should reject data: URLs that are not images', () => {
      const result = sanitizeHtml('<a href="data:text/html,<script>alert(1)</script>">data</a>');
      expect(result).not.toContain('data:');
    });

    it('should allow data:image URLs', () => {
      const result = sanitizeHtml('<img src="data:image/png,base64,iVBOR">');
      // The regex strips data: only when not image/*, this should stay
      // Actually our implementation strips all non-image data:, this should be fine
      expect(result).toContain('data:image');
    });

    it('should reject meta refresh redirect', () => {
      const result = sanitizeHtml('<meta http-equiv="refresh" content="0;url=http://evil.com">');
      expect(result).not.toContain('http-equiv');
    });
  });
});
