import { describe, it, expect, beforeEach } from 'vitest';

const store: Record<string, string> = {};
const localStorageMock = {
  getItem: (key: string) => store[key] ?? null,
  setItem: (key: string, value: string) => { store[key] = value; },
  removeItem: (key: string) => { delete store[key]; },
  clear: () => { Object.keys(store).forEach(k => delete store[k]); },
  get length() { return Object.keys(store).length; },
  key: (i: number) => Object.keys(store)[i] ?? null,
};
Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });
Object.defineProperty(globalThis, 'window', { value: {} as any });

// Mock supabase import before cart
import('../lib/supabase').then(m => {
  // supabase mock
});

// We import through a proxy to avoid dynamic imports in cart
import {
  cartItems,
  cartCount,
  cartTotal,
  addToCart,
  removeFromCart,
  updateQty,
  clearCart,
  checkStock,
} from '../stores/cart';

describe('Cart Store', () => {
  beforeEach(() => {
    localStorageMock.clear();
    clearCart();
  });

  const sampleGame = {
    id: 'game-1',
    name: 'Mobile Legends',
    price: 15000,
    img: '/img/ml.jpg',
    type: 'game' as const,
  };

  const sampleGear = {
    id: 'gear-1',
    name: 'Gaming Mouse',
    price: 250000,
    img: '/img/mouse.jpg',
    type: 'gear' as const,
  };

  it('should start with empty cart', () => {
    expect(cartItems.get()).toEqual([]);
    expect(cartCount.get()).toBe(0);
    expect(cartTotal.get()).toBe(0);
  });

  it('should add item to cart', () => {
    const result = addToCart(sampleGame);
    expect(result.success).toBe(true);
    expect(cartItems.get()).toHaveLength(1);
    expect(cartItems.get()[0].id).toBe('game-1');
    expect(cartCount.get()).toBe(1);
  });

  it('should increase quantity when adding existing item', () => {
    addToCart(sampleGame);
    addToCart(sampleGame);
    expect(cartItems.get()).toHaveLength(1);
    expect(cartItems.get()[0].qty).toBe(2);
    expect(cartCount.get()).toBe(2);
    expect(cartTotal.get()).toBe(30000);
  });

  it('should add multiple different items', () => {
    addToCart(sampleGame);
    addToCart(sampleGear);
    expect(cartItems.get()).toHaveLength(2);
    expect(cartCount.get()).toBe(2);
    expect(cartTotal.get()).toBe(265000); // 15000 + 250000
  });

  it('should remove item from cart', () => {
    addToCart(sampleGame);
    addToCart(sampleGear);
    expect(cartItems.get()).toHaveLength(2);
    removeFromCart('game-1');
    expect(cartItems.get()).toHaveLength(1);
    expect(cartItems.get()[0].id).toBe('gear-1');
    expect(cartCount.get()).toBe(1);
  });

  it('should update item quantity', () => {
    addToCart(sampleGame);
    updateQty('game-1', 5);
    expect(cartItems.get()[0].qty).toBe(5);
    expect(cartTotal.get()).toBe(75000);
  });

  it('should remove item when updateQty to 0', () => {
    addToCart(sampleGame);
    updateQty('game-1', 0);
    expect(cartItems.get()).toHaveLength(0);
  });

  it('should remove item when updateQty to negative', () => {
    addToCart(sampleGame);
    updateQty('game-1', -1);
    expect(cartItems.get()).toHaveLength(0);
  });

  it('should clear entire cart', () => {
    addToCart(sampleGame);
    addToCart(sampleGear);
    expect(cartItems.get()).toHaveLength(2);
    clearCart();
    expect(cartItems.get()).toEqual([]);
    expect(cartCount.get()).toBe(0);
    expect(cartTotal.get()).toBe(0);
  });

  it('should persist cart to localStorage', () => {
    addToCart(sampleGame);
    const raw = localStorageMock.getItem('topzone_cart');
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].id).toBe('game-1');
  });

  it('should not add item when stock is 0', () => {
    const outOfStockItem = { ...sampleGame, stock: 0 as any };
    const result = checkStock(outOfStockItem, 1);
    expect(result.success).toBe(false);
    expect(result.message).toContain('Stok habis');
  });

  it('should allow add when stock is sufficient', () => {
    const inStockItem = { ...sampleGame, stock: 5 as any };
    const result = checkStock(inStockItem, 3);
    expect(result.success).toBe(true);
  });
});
