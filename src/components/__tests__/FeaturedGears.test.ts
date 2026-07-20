// src/components/__tests__/FeaturedGears.test.ts
import { describe, it, expect } from 'vitest';

// FeaturedGears component logic tests — filtering, categories, count

interface MockGear {
  name: string;
  category?: string;
  price: number;
  brand?: string;
}

function filterGearsByTab(gears: MockGear[], tab: string): MockGear[] {
  if (tab === 'all') return gears;
  return gears.filter(g => g.category === tab);
}

function getUniqueCategories(gears: MockGear[]): string[] {
  const cats = new Set<string>();
  gears.forEach(g => { if (g.category) cats.add(g.category); });
  return [...cats].sort();
}

function getVisibleCount(gears: MockGear[], limit: number = 9): number {
  return Math.min(gears.length, limit);
}

describe('FeaturedGears', () => {
  const mockGears: MockGear[] = [
    { name: 'Mechanical Keyboard', category: 'keyboard', price: 850000, brand: 'Razer' },
    { name: 'Gaming Mouse', category: 'mouse', price: 450000, brand: 'Logitech' },
    { name: 'Noise Cancelling Headset', category: 'headset', price: 1200000 },
    { name: 'Xbox Controller', category: 'controller', price: 650000, brand: 'Microsoft' },
    { name: 'Ergonomic Chair', category: 'chair', price: 3500000 },
    { name: 'HD Webcam', category: 'webcam', price: 550000, brand: 'Logitech' },
    { name: 'Condenser Mic', category: 'microphone', price: 780000 },
    { name: '27" 4K Monitor', category: 'monitor', price: 4200000 },
    { name: 'RGB Mousepad XL', category: 'mousepad', price: 250000 },
    { name: 'Bluetooth Speaker', category: 'speaker', price: 320000 },
    { name: 'Stream Deck', category: 'streaming', price: 1500000 },
  ];

  it('filters gears by category tab', () => {
    const mice = filterGearsByTab(mockGears, 'mouse');
    expect(mice).toHaveLength(1);
    expect(mice[0].name).toBe('Gaming Mouse');
  });

  it('returns all gears for "all" tab', () => {
    const all = filterGearsByTab(mockGears, 'all');
    expect(all).toHaveLength(mockGears.length);
  });

  it('limits visible gears to 9 items', () => {
    expect(getVisibleCount(mockGears)).toBe(9);
    expect(getVisibleCount(mockGears.slice(0, 3))).toBe(3);
  });

  it('extracts unique categories', () => {
    const cats = getUniqueCategories(mockGears);
    expect(cats).toContain('keyboard');
    expect(cats).toContain('mouse');
    expect(cats).toContain('headset');
    expect(cats).not.toContain('all');
  });

  it('handles empty gears list', () => {
    expect(filterGearsByTab([], 'all')).toEqual([]);
    expect(getUniqueCategories([])).toEqual([]);
    expect(getVisibleCount([])).toBe(0);
  });

  it('returns empty for non-existent category', () => {
    expect(filterGearsByTab(mockGears, 'nonexistent')).toEqual([]);
  });
});
