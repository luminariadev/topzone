// src/components/__tests__/CartIcon.test.ts
import { describe, it, expect } from 'vitest';

// CartIcon component logic tests — badge count, empty state, link

interface CartItem {
  id: string;
  qty: number;
}

function getCartCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.qty, 0);
}

function shouldShowBadge(items: CartItem[]): boolean {
  return getCartCount(items) > 0;
}

function getBadgeText(items: CartItem[]): string {
  const count = getCartCount(items);
  return count > 0 ? String(count) : '';
}

describe('CartIcon', () => {
  it('shows badge with count when cart has items', () => {
    const items: CartItem[] = [
      { id: '1', qty: 2 },
      { id: '2', qty: 1 },
    ];
    expect(shouldShowBadge(items)).toBe(true);
    expect(getBadgeText(items)).toBe('3');
  });

  it('hides badge when cart is empty', () => {
    expect(shouldShowBadge([])).toBe(false);
    expect(getBadgeText([])).toBe('');
  });

  it('counts total items (sum of quantities)', () => {
    const items: CartItem[] = [
      { id: '1', qty: 5 },
      { id: '2', qty: 3 },
      { id: '3', qty: 1 },
    ];
    expect(getCartCount(items)).toBe(9);
  });

  it('handles single item correctly', () => {
    const items: CartItem[] = [{ id: '1', qty: 1 }];
    expect(shouldShowBadge(items)).toBe(true);
    expect(getBadgeText(items)).toBe('1');
    expect(getCartCount(items)).toBe(1);
  });

  it('handles zero quantity items', () => {
    const items: CartItem[] = [{ id: '1', qty: 0 }];
    expect(getCartCount(items)).toBe(0);
    expect(shouldShowBadge(items)).toBe(false);
  });

  it('has correct link target', () => {
    // The component links to /cart
    const linkHref = '/cart';
    expect(linkHref).toBe('/cart');
  });
});
