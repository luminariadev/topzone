// src/utils/seo.test.ts
import { describe, it, expect } from 'vitest';
import { generateProductAltText, generateMetaKeywords, auditHeadingHierarchy } from './seo';

describe('generateProductAltText', () => {
  it('generates alt text for a game product', () => {
    const result = generateProductAltText({
      productName: 'Mobile Legends',
      productType: 'game',
    });
    expect(result).toContain('Mobile Legends');
    expect(result).toContain('Top Up');
    expect(result).toContain('TopZone');
  });

  it('generates alt text with category for gear', () => {
    const result = generateProductAltText({
      productName: 'G Pro X Superlight',
      productType: 'gear',
      category: 'Mouse Gaming',
      brand: 'Logitech',
    });
    expect(result).toContain('Logitech');
    expect(result).toContain('Mouse Gaming');
  });

  it('returns fallback if no product name', () => {
    const result = generateProductAltText({});
    expect(result).toContain('TopZone');
  });
});

describe('generateMetaKeywords', () => {
  it('generates keywords from product data', () => {
    const result = generateMetaKeywords({
      productName: 'Valorant',
      category: 'FPS Game',
      tags: ['valorant points', 'vp'],
    });
    expect(result).toContain('valorant');
    expect(result).toContain('game');
  });
});

describe('auditHeadingHierarchy', () => {
  it('returns valid for h1→h2→h3 sequence', () => {
    const result = auditHeadingHierarchy([1, 2, 2, 3, 2]);
    expect(result.valid).toBe(true);
    expect(result.issues).toHaveLength(0);
  });

  it('flags missing h1', () => {
    const result = auditHeadingHierarchy([2, 3]);
    expect(result.valid).toBe(false);
    expect(result.issues.some(i => i.includes('h1'))).toBe(true);
  });

  it('flags skipped heading levels', () => {
    const result = auditHeadingHierarchy([1, 3]);
    expect(result.valid).toBe(false);
    expect(result.issues.some(i => i.includes('skip'))).toBe(true);
  });
});
