import { describe, it, expect } from 'vitest';
import { slugify, truncate, generateOrderId, hashEmail, getStarArray, deepMerge, sanitizeHtml } from '../helpers';

describe('slugify', () => {
  it('should convert text to URL-friendly slug', () => {
    expect(slugify('Mobile Legends Game')).toBe('mobile-legends-game');
    expect(slugify('Free Fire')).toBe('free-fire');
    expect(slugify('Mechanical Keyboard')).toBe('mechanical-keyboard');
  });

  it('should handle special characters', () => {
    expect(slugify('Hello World!')).toBe('hello-world');
    expect(slugify('Top-Zone Store')).toBe('top-zone-store');
    expect(slugify('  Extra   Spaces  ')).toBe('extra-spaces');
  });

  it('should handle accented characters', () => {
    expect(slugify('café')).toBe('cafe');
    expect(slugify('naïve')).toBe('naive');
  });

  it('should handle empty string', () => {
    expect(slugify('')).toBe('');
  });
});

describe('truncate', () => {
  it('should truncate long text with suffix', () => {
    expect(truncate('Hello World', 5)).toBe('He...');
    expect(truncate('Short', 100)).toBe('Short');
    expect(truncate('Test', 2, '!')).toBe('T!');
  });

  it('should handle edge cases', () => {
    expect(truncate('', 10)).toBe('');
    expect(truncate('Exact', 5)).toBe('Exact');
  });
});

describe('generateOrderId', () => {
  it('should generate order ID with prefix', () => {
    const id = generateOrderId('ORD');
    expect(id).toMatch(/^ORD-\d{8}-[A-Z0-9]{6}$/);
  });

  it('should use default prefix', () => {
    const id = generateOrderId();
    expect(id).toMatch(/^ORD-\d{8}-[A-Z0-9]{6}$/);
  });

  it('should produce unique IDs on consecutive calls', () => {
    const ids = new Set();
    for (let i = 0; i < 10; i++) ids.add(generateOrderId());
    expect(ids.size).toBe(10);
  });
});

describe('hashEmail', () => {
  it('should hash email to safe identifier', () => {
    expect(hashEmail('user@example.com')).toBe('user_example_com');
    expect(hashEmail('Test@Email.ORG')).toBe('test_email_org');
  });

  it('should handle multiple special chars', () => {
    expect(hashEmail('a.b+c@test.io')).toBe('a_b_c_test_io');
  });
});

describe('getStarArray', () => {
  it('should return correct star array', () => {
    expect(getStarArray(3)).toEqual(['full', 'full', 'full', 'empty', 'empty']);
    expect(getStarArray(0)).toEqual(['empty', 'empty', 'empty', 'empty', 'empty']);
    expect(getStarArray(5)).toEqual(['full', 'full', 'full', 'full', 'full']);
  });

  it('should handle half stars', () => {
    expect(getStarArray(2.5)).toEqual(['full', 'full', 'half', 'empty', 'empty']);
    expect(getStarArray(4.5)).toEqual(['full', 'full', 'full', 'full', 'half']);
  });

  it('should handle custom maxRating', () => {
    expect(getStarArray(3, 10)).toHaveLength(10);
  });
});

describe('deepMerge', () => {
  it('should merge nested objects', () => {
    const target = { a: { b: 1, c: 2 } };
    const source = { a: { c: 3, d: 4 } };
    expect(deepMerge(target, source)).toEqual({ a: { b: 1, c: 3, d: 4 } });
  });

  it('should replace arrays', () => {
    const target = { arr: [1, 2] };
    const source = { arr: [3, 4] };
    expect(deepMerge(target, source)).toEqual({ arr: [3, 4] });
  });
});

describe('sanitizeHtml', () => {
  it('should remove script tags', () => {
    const input = '<script>alert("xss")</script><p>Safe</p>';
    expect(sanitizeHtml(input)).not.toContain('<script>');
    expect(sanitizeHtml(input)).toContain('<p>Safe</p>');
  });

  it('should remove javascript: protocol', () => {
    expect(sanitizeHtml('<a href="javascript:alert(1)">XSS</a>')).not.toContain('javascript:');
  });

  it('should remove event handlers', () => {
    expect(sanitizeHtml('<img onerror="alert(1)" src="x">')).not.toContain('onerror');
  });
});
