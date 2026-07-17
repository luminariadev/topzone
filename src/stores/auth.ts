// src/stores/auth.ts
import { atom } from 'nanostores';

export interface AppUser {
  email: string;
  full_name?: string;
  avatar_url?: string;
  isLoggedIn: boolean;
  /** User ID from Supabase Auth (set after real auth) */
  id?: string;
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

/**
 * Update specific fields of the current user without logging them out.
 * Merges updates into existing user data in both localStorage and store.
 */
export function updateLocalUser(updates: Partial<AppUser>) {
  if (!isBrowser()) return;
  const current = loadUser();
  if (!current) return;

  const u: AppUser = { ...current, ...updates, isLoggedIn: true };
  localStorage.setItem(AUTH_KEY, JSON.stringify(u));
  user.set(u);
}

/**
 * Alias for updateLocalUser — merges partial data into existing user.
 */
export function mergeLocalUser(data: Partial<AppUser>) {
  if (!isBrowser()) return;
  const current = loadUser();
  if (!current) return;

  const u: AppUser = { ...current, ...data, isLoggedIn: current.isLoggedIn || true };
  localStorage.setItem(AUTH_KEY, JSON.stringify(u));
  user.set(u);
}

/**
 * Set or clear the current user. Passing null logs the user out.
 */
export function setUser(u: AppUser | null) {
  if (!isBrowser()) return;
  if (u) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(u));
    user.set(u);
  } else {
    logoutUser();
  }
}

/**
 * Convenience method to quickly set a local-only user (for demo / fallback auth).
 */
export function setLocalUser(email: string, fullName?: string) {
  if (!isBrowser()) return;
  const u: AppUser = {
    email,
    full_name: fullName || email.split('@')[0],
    isLoggedIn: true,
  };
  localStorage.setItem(AUTH_KEY, JSON.stringify(u));
  user.set(u);
}

/**
 * Log the user out: clear localStorage and reset store to null.
 */
export function logoutUser() {
  if (!isBrowser()) return;
  localStorage.removeItem(AUTH_KEY);
  user.set(null);
}

/**
 * Get the localStorage key prefix for storing this user's orders.
 * Includes a hashed email to scope keys per user.
 */
export function getOrdersKey(): string {
  const u = user.get();
  if (u && u.isLoggedIn) return 'topzone_orders_' + u.email.replace(/[^a-zA-Z0-9]/g, '_');
  return 'topzone_orders';
}

/**
 * Get the current user's email, or null if not logged in.
 */
export function getCurrentEmail(): string | null {
  const u = user.get();
  return u && u.isLoggedIn ? u.email : null;
}

/**
 * Check if user is authenticated (logged in).
 */
export function isLoggedIn(): boolean {
  const u = user.get();
  return u?.isLoggedIn === true;
}
