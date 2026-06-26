// src/stores/auth.ts
import { atom } from 'nanostores';

export interface AppUser {
  email: string;
  full_name?: string;
  isLoggedIn: boolean;
}

const AUTH_KEY = 'topzone_current_user';

function isBrowser() {
  try { return typeof window !== 'undefined'; } catch { return false; }
}

function loadUser(): AppUser | null {
  try {
    if (!isBrowser()) return null;
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export const user = atom<AppUser | null>(null);

// Lazy init - only in browser
if (isBrowser()) {
  user.set(loadUser());
}

export function setLocalUser(email: string, name?: string) {
  if (!isBrowser()) return;
  const u: AppUser = { email, full_name: name || email.split('@')[0], isLoggedIn: true };
  localStorage.setItem(AUTH_KEY, JSON.stringify(u));
  user.set(u);
}

export function setUser(u: AppUser | null) {
  if (!isBrowser()) return;
  if (u) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(u));
    user.set(u);
  } else {
    logoutUser();
  }
}

export function setLoading(val: boolean) {
  // no-op kept for compatibility
}

export function logoutUser() {
  if (!isBrowser()) return;
  localStorage.removeItem(AUTH_KEY);
  user.set(null);
}

export function getOrdersKey(): string {
  const u = user.get();
  if (u && u.isLoggedIn) return 'topzone_orders_' + u.email.replace(/[^a-zA-Z0-9]/g, '_');
  return 'topzone_orders';
}

export function getCurrentEmail(): string | null {
  const u = user.get();
  return u && u.isLoggedIn ? u.email : null;
}
