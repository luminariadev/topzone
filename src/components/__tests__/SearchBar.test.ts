// src/components/__tests__/SearchBar.test.ts
import { describe, it, expect } from 'vitest';

// SearchBar component logic tests — search filtering, empty state, edge cases

interface Product {
  name: string;
  category?: string;
  badge?: string;
  type: 'game' | 'gear';
  slug: string;
}

function searchProducts(products: Product[], query: string): Product[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return products.filter(p =>
    p.name.toLowerCase().includes(q) ||
    (p.category && p.category.toLowerCase().includes(q)) ||
    (p.badge && p.badge.toLowerCase().includes(q))
  ).slice(0, 6);
}

describe('SearchBar', () => {
  const mockProducts: Product[] = [
    { name: 'Mobile Legends', category: 'Mobile Game', type: 'game', slug: 'mobile-legends' },
    { name: 'Valorant', category: 'PC Game', type: 'game', slug: 'valorant' },
    { name: 'Genshin Impact', category: 'Cross Platform', type: 'game', slug: 'genshin-impact' },
    { name: 'PUBG Mobile', category: 'Mobile Game', badge: 'Populer', type: 'game', slug: 'pubg-mobile' },
    { name: 'Mechanical Keyboard', category: 'keyboard', type: 'gear', slug: 'mechanical-keyboard' },
    { name: 'Gaming Mouse', category: 'mouse', type: 'gear', slug: 'gaming-mouse' },
    { name: 'Gaming Headset', category: 'headset', type: 'gear', slug: 'gaming-headset' },
  ];

  it('returns matching results for product name', () => {
    const results = searchProducts(mockProducts, 'mobile');
    expect(results.length).toBeGreaterThanOrEqual(2);
    expect(results.every(r => r.name.toLowerCase().includes('mobile'))).toBe(true);
  });

  it('returns results for category search', () => {
    const results = searchProducts(mockProducts, 'PC Game');
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe('Valorant');
  });

  it('returns empty array for empty query', () => {
    expect(searchProducts(mockProducts, '')).toEqual([]);
    expect(searchProducts(mockProducts, '   ')).toEqual([]);
  });

  it('returns empty array for no matches', () => {
    expect(searchProducts(mockProducts, 'xyznonexistent')).toEqual([]);
  });

  it('limits results to 6 items', () => {
    const manyProducts: Product[] = Array.from({ length: 10 }, (_, i) => ({
      name: `Game ${i}`,
      category: 'Test',
      type: 'game' as const,
      slug: `game-${i}`,
    }));
    const results = searchProducts(manyProducts, 'game');
    expect(results).toHaveLength(6);
  });

  it('matches by badge text', () => {
    const results = searchProducts(mockProducts, 'Populer');
    expect(results.some(r => r.name === 'PUBG Mobile')).toBe(true);
  });

  it('is case-insensitive', () => {
    const upper = searchProducts(mockProducts, 'VALORANT');
    const lower = searchProducts(mockProducts, 'valorant');
    expect(upper).toEqual(lower);
  });

  it('returns both games and gears that match', () => {
    const results = searchProducts(mockProducts, 'gaming');
    expect(results.length).toBeGreaterThanOrEqual(2);
    const types = results.map(r => r.type);
    expect(types).toContain('gear');
  });
});
