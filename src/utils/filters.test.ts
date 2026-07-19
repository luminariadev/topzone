import { describe, it, expect } from 'vitest';

import {
  filterByPriceRange,
  filterByCategory,
  filterByBrand,
  sortProducts,
  searchProducts,
  filterByRating,
  applyProductFilters,
} from '../utils/filters';

const sampleProducts = [
  { id: '1', name: 'Mobile Legends', price: 15000, category: 'game', brand: 'Moonton', status: 'published', avgRating: 4.5 },
  { id: '2', name: 'Free Fire', price: 12000, category: 'game', brand: 'Garena', status: 'published', avgRating: 4.0 },
  { id: '3', name: 'Gaming Mouse', price: 250000, category: 'gear', brand: 'Logitech', status: 'published', avgRating: 4.8 },
  { id: '4', name: 'Mechanical Keyboard', price: 500000, category: 'gear', brand: 'Razer', status: 'draft', avgRating: 4.2 },
  { id: '5', name: 'Genshin Impact', price: 0, category: 'game', brand: 'Hoyoverse', status: 'published', avgRating: 4.6 },
] as any[];

describe('filterByPriceRange', () => {
  it('filters by min price only', () => {
    const result = filterByPriceRange(sampleProducts, 100000, 0);
    expect(result).toHaveLength(2);
    expect(result.map(p => p.name)).toEqual(expect.arrayContaining(['Gaming Mouse', 'Mechanical Keyboard']));
  });

  it('filters by max price only', () => {
    const result = filterByPriceRange(sampleProducts, 0, 20000);
    expect(result).toHaveLength(3);
  });

  it('filters by price range', () => {
    const result = filterByPriceRange(sampleProducts, 10000, 50000);
    expect(result).toHaveLength(2);
  });
});

describe('filterByCategory', () => {
  it('returns all items when category is "all"', () => {
    expect(filterByCategory(sampleProducts, 'all')).toHaveLength(5);
  });

  it('filters by specific category', () => {
    const result = filterByCategory(sampleProducts, 'game');
    expect(result).toHaveLength(3);
  });
});

describe('filterByBrand', () => {
  it('returns all items when brand is "all"', () => {
    expect(filterByBrand(sampleProducts, 'all')).toHaveLength(5);
  });

  it('filters by specific brand', () => {
    const result = filterByBrand(sampleProducts, 'Logitech');
    expect(result).toHaveLength(1);
  });
});

describe('searchProducts', () => {
  it('finds products by name', () => {
    const result = searchProducts(sampleProducts, 'Mobile');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Mobile Legends');
  });

  it('returns all items for empty query', () => {
    expect(searchProducts(sampleProducts, '')).toHaveLength(5);
  });

  it('is case-insensitive', () => {
    expect(searchProducts(sampleProducts, 'MOBILE')).toHaveLength(1);
  });

  it('returns empty for no match', () => {
    expect(searchProducts(sampleProducts, 'xyznonexistent')).toHaveLength(0);
  });
});

describe('sortProducts', () => {
  it('sorts by price ascending', () => {
    const result = sortProducts(sampleProducts, 'price-asc');
    expect(result[0].price).toBe(0);
    expect(result[result.length - 1].price).toBe(500000);
  });

  it('sorts by price descending', () => {
    const result = sortProducts(sampleProducts, 'price-desc');
    expect(result[0].price).toBe(500000);
  });

  it('sorts by name ascending', () => {
    const result = sortProducts(sampleProducts, 'name-asc');
    expect(result[0].name).toBe('Free Fire');
  });

  it('sorts by name descending', () => {
    const result = sortProducts(sampleProducts, 'name-desc');
    expect(result[3].name).toBe('Gaming Mouse');
  });

  it('sorts by newest (priority)', () => {
    const result = sortProducts(sampleProducts, 'newest');
    expect(result).toHaveLength(5);
  });

  it('returns unsorted for unknown sort', () => {
    const result = sortProducts(sampleProducts, 'unknown' as any);
    expect(result).toHaveLength(5);
  });
});

describe('filterByRating', () => {
  it('filters by minimum rating', () => {
    const result = filterByRating(sampleProducts, 4.5);
    expect(result.length).toBeGreaterThanOrEqual(2);
  });

  it('returns all for minRating 0', () => {
    expect(filterByRating(sampleProducts, 0)).toHaveLength(5);
  });

  it('returns all for minRating >5', () => {
    expect(filterByRating(sampleProducts, 6)).toHaveLength(5);
  });
});

describe('applyProductFilters', () => {
  it('combines multiple filters', () => {
    const result = applyProductFilters(sampleProducts, {
      status: 'published',
      category: 'game',
      sortBy: 'price_asc',
      searchQuery: '',
      brand: 'all',
      minPrice: 0,
      maxPrice: 0,
    });
    expect(result.length).toBeGreaterThan(0);
    result.forEach(p => {
      expect(p.status).toBe('published');
    });
  });
});
