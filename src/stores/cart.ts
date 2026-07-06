// src/stores/cart.ts
import { atom, computed } from 'nanostores';
import { user, getCurrentEmail } from './auth';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  img: string;
  type: 'game' | 'gear';
}

const STORAGE_KEY = 'topzone_cart';
const SUPABASE_CART_KEY = 'topzone_supabase_cart_';
const CART_EXPIRY_KEY = 'topzone_cart_expiry_';
const CART_EXPIRY_HOURS = 24; // 24 hours

function loadCart(): CartItem[] {
  try {
    // Check cart expiry
    if (typeof localStorage !== 'undefined') {
      const expiryKey = CART_EXPIRY_KEY + (getCurrentEmail()?.replace(/[^a-zA-Z0-9]/g, '_') || 'guest');
      const expiry = localStorage.getItem(expiryKey);
      if (expiry && Date.now() > parseInt(expiry)) {
        // Cart expired, clear it
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(expiryKey);
        return [];
      }
    }

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
      // Update expiry timestamp
      const expiryKey = CART_EXPIRY_KEY + (getCurrentEmail()?.replace(/[^a-zA-Z0-9]/g, '_') || 'guest');
      localStorage.setItem(expiryKey, String(Date.now() + CART_EXPIRY_HOURS * 60 * 60 * 1000));
    }
  } catch {
    // Storage full or unavailable, cart state stays in memory
  }
}

function clearCartExpiry() {
  try {
    if (typeof localStorage !== 'undefined') {
      const expiryKey = CART_EXPIRY_KEY + (getCurrentEmail()?.replace(/[^a-zA-Z0-9]/g, '_') || 'guest');
      localStorage.removeItem(expiryKey);
    }
  } catch {}
}

// Save cart to Supabase when user is logged in
async function saveCartToSupabase(items: CartItem[]) {
  const email = getCurrentEmail();
  if (!email) return;

  try {
    const { supabase } = await import('../lib/supabase');
    if (!supabase) return;

    const key = SUPABASE_CART_KEY + email.replace(/[^a-zA-Z0-9]/g, '_');
    await supabase.from('user_data').upsert({
      key: key,
      value: JSON.stringify(items),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'key' });
  } catch (e) {
    console.warn('[cart] Supabase sync failed:', e);
  }
}

// Load cart from Supabase (for logged-in users)
async function loadCartFromSupabase(): Promise<CartItem[]> {
  const email = getCurrentEmail();
  if (!email) return [];

  try {
    const { supabase } = await import('../lib/supabase');
    if (!supabase) return [];

    const key = SUPABASE_CART_KEY + email.replace(/[^a-zA-Z0-9]/g, '_');
    const { data } = await supabase
      .from('user_data')
      .select('value')
      .eq('key', key)
      .single();

    if (data?.value) {
      return JSON.parse(data.value);
    }
  } catch (e) {
    console.warn('[cart] Supabase load failed:', e);
  }
  return [];
}

// Merge guest cart with Supabase cart on login
export async function mergeCartOnLogin(): Promise<void> {
  const localCart = loadCart();
  const supabaseCart = await loadCartFromSupabase();

  if (localCart.length === 0) {
    // Use Supabase cart
    cartItems.set(supabaseCart);
    saveCart(supabaseCart);
  } else if (supabaseCart.length > 0) {
    // Merge: combine items, sum quantities for duplicates
    const merged = [...supabaseCart];
    localCart.forEach(localItem => {
      const existing = merged.find(i => i.id === localItem.id);
      if (existing) {
        existing.qty += localItem.qty;
      } else {
        merged.push(localItem);
      }
    });
    cartItems.set(merged);
    saveCart(merged);
    saveCartToSupabase(merged);
  }
}

export const cartItems = atom<CartItem[]>(loadCart());

export const cartCount = computed(cartItems, (items) =>
  items.reduce((sum, item) => sum + item.qty, 0)
);

export const cartTotal = computed(cartItems, (items) =>
  items.reduce((sum, item) => sum + item.price * item.qty, 0)
);

/** Result of a stock check or add-to-cart operation */
export interface CartActionResult {
  success: boolean;
  message?: string;
}

/**
 * Basic stock check for cart items.
 * Currently checks game packages with explicit stock fields.
 */
export function checkStock(item: Omit<CartItem, 'qty'>, currentQty = 1): CartActionResult {
  if (item.type === 'game' && 'stock' in item) {
    const stock = (item as any).stock;
    if (stock === 0) {
      return { success: false, message: 'Stok habis, tidak bisa menambah ke keranjang.' };
    }
    if (stock != null && currentQty > stock) {
      return { success: false, message: `Stok tersisa ${stock}, tidak bisa menambah ${currentQty} item.` };
    }
  }
  return { success: true };
}

export function addToCart(item: Omit<CartItem, 'qty'>): CartActionResult {
  const current = cartItems.get();
  const existing = current.find((i) => i.id === item.id);
  const newQty = existing ? existing.qty + 1 : 1;

  const stockCheck = checkStock(item, newQty);
  if (!stockCheck.success) {
    console.warn('[cart] Stock check failed:', stockCheck.message);
    return stockCheck;
  }

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

  // Sync to Supabase if logged in
  saveCartToSupabase(updated);

  return { success: true };
}

export function removeFromCart(id: string) {
  const updated = cartItems.get().filter((i) => i.id !== id);
  cartItems.set(updated);
  saveCart(updated);
  saveCartToSupabase(updated);
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
  saveCartToSupabase(updated);
}

export function clearCart() {
  cartItems.set([]);
  saveCart([]);
  saveCartToSupabase([]);
  clearCartExpiry();
}
