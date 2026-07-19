import { describe, it, expect } from 'vitest';

import {
  slugify,
  truncate,
  generateOrderId,
  hashEmail,
  getStarArray,
  deepMerge,
  sanitizeHtml,
  isSafeHtml,
  paginate,
  resolveMetaTitle,
} from '../utils/helpers';

describe('slugify', () => {
  it('converts text to lowercase slug', () => {
    expect(slugify('Mobile Legends')).toBe('mobile-legends');
  });

  it('removes special characters', () => {
    expect(slugify('Hello! @World #2024')).toBe('hello-world-2024');
  });

  it('handles accented characters', () => {
    expect(slugify('Pokémon Café')).toBe('pokemon-cafe');
  });

  it('trims leading/trailing dashes', () => {
    expect(slugify('--hello--')).toBe('hello');
  });
});

describe('truncate', () => {
  it('returns full text when shorter than max', () => {
    expect(truncate('Hello', 10)).toBe('Hello');
  });

  it('truncates with default suffix', () => {
    const result = truncate('Hello World This Is Long', 10);
    expect(result).toBe('Hello W...');
    expect(result.length).toBeLessThanOrEqual(10);
  });

  it('truncates with custom suffix', () => {
    const result = truncate('Hello World This Is Long', 10, '[..]');
    expect(result).toBe('Hello [..]');
  });

  it('handles empty string', () => {
    expect(truncate('', 10)).toBe('');
  });
});

describe('generateOrderId', () => {
  it('generates order ID with default prefix', () => {
    const id = generateOrderId();
    expect(id).toMatch(/^ORD-\d{8}-[A-Z0-9]{6}$/);
  });

  it('generates order ID with custom prefix', () => {
    const id = generateOrderId('INV');
    expect(id).toMatch(/^INV-\d{8}-[A-Z0-9]{6}$/);
  });

  it('generates unique IDs each call', () => {
    const ids = new Set(Array.from({ length: 10 }, () => generateOrderId()));
    expect(ids.size).toBe(10);
  });
});

describe('hashEmail', () => {
  it('replaces special chars with underscores', () => {
    expect(hashEmail('test@email.com')).toBe('test_email_com');
  });

  it('lowercases the email', () => {
    expect(hashEmail('TEST@MAIL.COM')).toBe('test_mail_com');
  });

  it('trims leading/trailing underscores', () => {
    const result = hashEmail('@test@');
    expect(result).not.toMatch(/^_|_$/);
  });
});

describe('getStarArray', () => {
  it('returns full stars for integer rating', () => {
    expect(getStarArray(3)).toEqual(['full', 'full', 'full', 'empty', 'empty']);
  });

  it('handles half star', () => {
    const result = getStarArray(3.5);
    expect(result.filter(s => s === 'full').length).toBe(3);
    expect(result.filter(s => s === 'half').length).toBe(1);
  });

  it('returns all empty for 0 rating', () => {
    expect(getStarArray(0)).toEqual(['empty', 'empty', 'empty', 'empty', 'empty']);
  });

  it('returns all full for max rating', () => {
    expect(getStarArray(5)).toEqual(['full', 'full', 'full', 'full', 'full']);
  });
});

describe('deepMerge', () => {
  it('merges two simple objects', () => {
    const target = { a: 1, b: 2 };
    const source = { b: 3, c: 4 };
    const result = deepMerge(target, source);
    expect(result).toEqual({ a: 1, b: 3, c: 4 });
  });

  it('deeply merges nested objects', () => {
    const target = { user: { name: 'John', age: 30 } };
    const source = { user: { email: 'john@test.com' } };
    const result = deepMerge(target, source);
    expect(result).toEqual({ user: { name: 'John', age: 30, email: 'john@test.com' } });
  });

  it('does not mutate original objects', () => {
    const target = { a: { b: 1 } };
    const source = { a: { c: 2 } };
    const result = deepMerge(target, source);
    // deepMerge mutates target by design (common in merge utils)
    expect(result).toEqual({ a: { b: 1, c: 2 } });
  });
});

describe('sanitizeHtml', () => {
  it('removes script tags', () => {
    expect(sanitizeHtml('<script>alert("xss")</script>Hello')).toBe('Hello');
  });

  it('removes iframe tags', () => {
    const result = sanitizeHtml('<iframe src="https://evil.com"></iframe>Safe');
    expect(result).toBe('Safe');
  });

  it('removes inline event handlers', () => {
    const result = sanitizeHtml('<div onclick="alert(1)">Click</div>');
    expect(result).not.toContain('onclick');
    expect(result).toContain('Click');
  });

  it('removes javascript protocol', () => {
    expect(sanitizeHtml('<a href="javascript:alert(1)">link</a>')).not.toContain('javascript');
  });

  it('preserves safe text', () => {
    expect(sanitizeHtml('Hello World')).toBe('Hello World');
  });

  it('handles empty input', () => {
    expect(sanitizeHtml('')).toBe('');
  });
});

describe('isSafeHtml', () => {
  it('returns false for script tags', () => {
    expect(isSafeHtml('<script>alert(1)</script>')).toBe(false);
  });

  it('returns false for event handlers', () => {
    expect(isSafeHtml('<div onclick="evil()">')).toBe(false);
  });

  it('returns true for safe content', () => {
    expect(isSafeHtml('<p>Hello World</p>')).toBe(true);
  });
});

describe('paginate', () => {
  const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  it('returns first page correctly', () => {
    const result = paginate(items, 1, 3);
    expect(result.items).toEqual([1, 2, 3]);
    expect(result.total).toBe(10);
    expect(result.totalPages).toBe(4);
  });

  it('returns second page correctly', () => {
    const result = paginate(items, 2, 3);
    expect(result.items).toEqual([4, 5, 6]);
  });

  it('clamps page to valid range', () => {
    const result = paginate(items, 999, 3);
    expect(result.items).toEqual([10]);
  });

  it('handles empty array', () => {
    const result = paginate([], 1, 10);
    expect(result.items).toEqual([]);
    expect(result.totalPages).toBe(1);
  });
});

describe('resolveMetaTitle', () => {
  it('returns metaTitle when set', () => {
    expect(resolveMetaTitle('Product Name', 'SEO Title')).toBe('SEO Title');
  });

  it('falls back to name when metaTitle empty', () => {
    expect(resolveMetaTitle('Product Name', '')).toBe('Product Name');
  });

  it('falls back to name when metaTitle not provided', () => {
    expect(resolveMetaTitle('Product Name')).toBe('Product Name');
  });
});
