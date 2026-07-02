// src/stores/cart.ts
import { atom, computed } from 'nanostores';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  img: string;
  type: 'game' | 'gear';
}

const STORAGE_KEY = 'topzone_cart';

function loadCart(): CartItem[] {
  try {
    const saved = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  } catch {
    // Storage full or unavailable, cart state stays in memory
  }
}

export const cartItems = atom<CartItem[]>(loadCart());

export const cartCount = computed(cartItems, (items) =>
  items.reduce((sum, item) => sum + item.qty, 0)
);

export const cartTotal = computed(cartItems, (items) =>
  items.reduce((sum, item) => sum + item.price * item.qty, 0)
);

export function addToCart(item: Omit<CartItem, 'qty'>) {
  const current = cartItems.get();
  const existing = current.find((i) => i.id === item.id);
  let updated: CartItem[];
  if (existing) {
    updated = current.map((i) =>
      i.id === item.id ? { ...i, qty: i.qty + 1 } : i
    );
  } else {
    updated = [...current, { ...item, qty: 1 }];
  }
  cartItems.set(updated);
  saveCart(updated);
}

export function removeFromCart(id: string) {
  const updated = cartItems.get().filter((i) => i.id !== id);
  cartItems.set(updated);
  saveCart(updated);
}

export function updateQty(id: string, qty: number) {
  if (qty <= 0) {
    removeFromCart(id);
    return;
  }
  const updated = cartItems.get().map((i) =>
    i.id === id ? { ...i, qty } : i
  );
  cartItems.set(updated);
  saveCart(updated);
}

export function clearCart() {
  cartItems.set([]);
  saveCart([]);
}
