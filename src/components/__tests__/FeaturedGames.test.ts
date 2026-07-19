// src/components/__tests__/FeaturedGames.test.ts
import { describe, it, expect } from 'vitest';

// FeaturedGames component logic tests

function filterGamesByTab(games: { category?: string }[], tab: string): { category?: string }[] {
  if (tab === 'all') return games;
  return games.filter(g => g.category === tab);
}

function getUniqueCategories(games: { category?: string }[]): string[] {
  const cats = new Set<string>();
  games.forEach(g => { if (g.category) cats.add(g.category); });
  return [...cats].sort();
}

describe('FeaturedGames', () => {
  const mockGames = [
    { category: 'Mobile Game', name: 'Mobile Legends' },
    { category: 'PC Game', name: 'Valorant' },
    { category: 'Mobile Game', name: 'Free Fire' },
    { category: 'PC Game', name: 'Genshin Impact' },
  ];

  it('filters games by category', () => {
    const mobile = filterGamesByTab(mockGames, 'Mobile Game');
    expect(mobile).toHaveLength(2);
    expect(mobile.every(g => g.category === 'Mobile Game')).toBe(true);
  });

  it('returns all games for "all" tab', () => {
    const all = filterGamesByTab(mockGames, 'all');
    expect(all).toHaveLength(4);
  });

  it('extracts unique categories', () => {
    const cats = getUniqueCategories(mockGames);
    expect(cats).toEqual(['Mobile Game', 'PC Game']);
  });

  it('handles empty games list', () => {
    expect(filterGamesByTab([], 'all')).toEqual([]);
    expect(getUniqueCategories([])).toEqual([]);
  });
});
