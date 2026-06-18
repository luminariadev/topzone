// src/stores/auth.ts
import { atom } from 'nanostores';

export interface AppUser {
  email: string;
  full_name?: string;
  isLoggedIn: boolean;
}

const AUTH_KEY = 'topzone_current_user';

function loadUser(): AppUser | null {
  try {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export const user = atom<AppUser | null>(loadUser());

export function setLocalUser(email: string, name?: string) {
  const u: AppUser = { email, full_name: name || email.split('@')[0], isLoggedIn: true };
  localStorage.setItem(AUTH_KEY, JSON.stringify(u));
  user.set(u);
}

export function setUser(u: AppUser | null) {
  if (u) {
    setLocalUser(u.email, u.full_name);
  } else {
    logoutUser();
  }
}

export function setLoading(val: boolean) {
  // no-op kept for compatibility
}

export function logoutUser() {
  localStorage.removeItem(AUTH_KEY);
  user.set(null);
}

export function getOrdersKey(): string {
  const u = user.get();
  if (u && u.isLoggedIn) return 'topzone_orders_' + u.email.replace(/[^a-zA-Z0-9]/g, '_');
  // Fallback for anonymous: shared key
  return 'topzone_orders';
}

export function getCurrentEmail(): string | null {
  const u = user.get();
  return u && u.isLoggedIn ? u.email : null;
}
