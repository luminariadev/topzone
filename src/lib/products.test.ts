// src/lib/products.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Simple test - just verify functions are exported
import { fetchGames, fetchGameBySlug, fetchGearBySlug } from './products';

describe('products exports', () => {
  it('exports fetchGames', () => {
    expect(typeof fetchGames).toBe('function');
  });

  it('exports fetchGameBySlug', () => {
    expect(typeof fetchGameBySlug).toBe('function');
  });

  it('exports fetchGearBySlug', () => {
    expect(typeof fetchGearBySlug).toBe('function');
  });
});