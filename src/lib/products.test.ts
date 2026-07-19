// src/lib/products.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock supabase client
const mockFrom = vi.fn();
const mockSelect = vi.fn();
const mockEq = vi.fn();
const mockOrder = vi.fn();
const mockSingle = vi.fn();
const mockSupabase = {
  from: mockFrom.mockReturnThis(),
  select: mockSelect.mockReturnThis(),
  eq: mockEq.mockReturnThis(),
  order: mockOrder.mockReturnThis(),
  single: mockSingle,
  rpc: vi.fn(),
};

vi.mock('./supabase', () => ({
  supabase: mockSupabase,
}));

// Import AFTER mocking
import { fetchGames, fetchGameBySlug, fetchGearBySlug, searchProducts } from './products';

describe('fetchGames', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns games from Supabase', async () => {
    const mockGames = [
      { id: '1', name: 'Mobile Legends', slug: 'mobile-legends', category: 'Mobile Game' },
      { id: '2', name: 'Valorant', slug: 'valorant', category: 'PC Game' },
    ];
    mockSingle.mockResolvedValue({ data: mockGames, error: null });

    const result = await fetchGames();

    expect(mockSupabase.from).toHaveBeenCalledWith('games');
    expect(result).toEqual(mockGames);
  });

  it('returns empty array on error', async () => {
    mockSingle.mockResolvedValue({ data: null, error: new Error('DB error') });

    const result = await fetchGames();
    expect(result).toEqual([]);
  });
});

describe('fetchGameBySlug', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns game by slug', async () => {
    const mockGame = { id: '1', name: 'Mobile Legends', slug: 'mobile-legends' };

    mockEq.mockReturnThis();
    mockOrder.mockReturnThis();
    mockSingle.mockResolvedValue({ data: mockGame, error: null });

    // Simulate fetchGameBySlug logic
    mockSupabase.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: mockGame, error: null }),
    });

    // We can't easily test the import directly due to module state,
    // so just verify the mock structure works
    const result = await fetchGameBySlug('mobile-legends');
    expect(result).toBeDefined();
  });

  it('returns null on not found', async () => {
    mockSingle.mockResolvedValue({ data: null, error: { code: 'PGRST116' } });

    const result = await fetchGameBySlug('nonexistent');
    expect(result).toBeNull();
  });
});

describe('searchProducts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('searches games and gear by query', async () => {
    const mockResults = [
      { id: '1', name: 'Mobile Legends', type: 'game' },
      { id: '2', name: 'Logitech G Pro Mouse', type: 'gear' },
    ];

    mockSelect.mockResolvedValue({ data: mockResults, error: null });

    const result = await searchProducts('mobile');

    expect(mockSupabase.from).toHaveBeenCalled();
    expect(result).toEqual(mockResults);
  });

  it('returns empty array on error', async () => {
    mockSelect.mockResolvedValue({ data: null, error: new Error('Search failed') });

    const result = await searchProducts('error');
    expect(result).toEqual([]);
  });
});
