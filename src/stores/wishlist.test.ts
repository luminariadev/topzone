import { describe, it, expect, beforeEach } from 'vitest';

// Mock localStorage
const store: Record<string, string> = {};
const localStorageMock = {
  getItem: (key: string) => store[key] ?? null,
  setItem: (key: string, value: string) => { store[key] = value; },
  removeItem: (key: string) => { delete store[key]; },
  clear: () => { Object.keys(store).forEach(k => delete store[k]); },
  get length() { return Object.keys(store).length; },
  key: (i: number) => Object.keys(store)[i] ?? null,
};
Object.defineProperty(global, 'localStorage', { value: localStorageMock, writable: true });
Object.defineProperty(global, 'window', {
  value: { matchMedia: () => ({ matches: false, addEventListener: () => {}, removeEventListener: () => {} }) },
  writable: true,
});

import { wishlistItems, addToWishlist, removeFromWishlist, toggleWishlist, isInWishlist, clearWishlist, WishlistItem } from './wishlist';

const sampleItem: WishlistItem = {
  id: 'game-1',
  name: 'Mobile Legends',
  img: '/assets/ml.png',
  price: 50000,
  type: 'game',
  slug: 'mobile-legends',
};

const sampleGear: WishlistItem = {
  id: 'gear-1',
  name: 'G Pro X Superlight',
  img: '/assets/mouse.png',
  price: 1500000,
  type: 'gear',
  slug: 'g-pro-x-superlight',
};

describe('Wishlist Store', () => {
  beforeEach(() => {
    localStorageMock.clear();
    wishlistItems.set([]);
  });

  it('starts with empty wishlist', () => {
    expect(wishlistItems.get()).toHaveLength(0);
  });

  it('addToWishlist adds an item', () => {
    addToWishlist(sampleItem);
    expect(wishlistItems.get()).toHaveLength(1);
    expect(wishlistItems.get()[0].name).toBe('Mobile Legends');
  });

  it('does not add duplicate items', () => {
    addToWishlist(sampleItem);
    addToWishlist(sampleItem);
    expect(wishlistItems.get()).toHaveLength(1);
  });

  it('removeFromWishlist removes an item by id', () => {
    addToWishlist(sampleItem);
    addToWishlist(sampleGear);
    expect(wishlistItems.get()).toHaveLength(2);

    removeFromWishlist('game-1');
    expect(wishlistItems.get()).toHaveLength(1);
    expect(wishlistItems.get()[0].id).toBe('gear-1');
  });

  it('toggleWishlist adds if not present, removes if present', () => {
    // Add
    const added = toggleWishlist(sampleItem);
    expect(added).toBe(true);
    expect(wishlistItems.get()).toHaveLength(1);

    // Remove
    const removed = toggleWishlist(sampleItem);
    expect(removed).toBe(false);
    expect(wishlistItems.get()).toHaveLength(0);
  });

  it('isInWishlist returns correct boolean', () => {
    expect(isInWishlist('game-1')).toBe(false);
    addToWishlist(sampleItem);
    expect(isInWishlist('game-1')).toBe(true);
    expect(isInWishlist('gear-1')).toBe(false);
  });

  it('clearWishlist empties the list', () => {
    addToWishlist(sampleItem);
    addToWishlist(sampleGear);
    clearWishlist();
    expect(wishlistItems.get()).toHaveLength(0);
  });

  it('persists to localStorage on add', () => {
    addToWishlist(sampleItem);
    const saved = localStorage.getItem('topzone_wishlist');
    expect(saved).not.toBeNull();
    const parsed = JSON.parse(saved!);
    expect(parsed).toHaveLength(1);
  });
});
