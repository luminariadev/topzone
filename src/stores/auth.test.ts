import { describe, it, expect, beforeEach } from 'vitest';

// Mock localStorage for Node environment
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

// Mock window
Object.defineProperty(globalThis, 'window', { value: {} as any });

import {
  user,
  setUser,
  setLocalUser,
  logoutUser,
  getOrdersKey,
  getCurrentEmail,
  isLoggedIn,
  updateLocalUser,
  mergeLocalUser,
} from '../stores/auth';

describe('Auth Store', () => {
  beforeEach(() => {
    localStorageMock.clear();
    // Reset store by logging out
    logoutUser();
  });

  it('should start with null user (not logged in)', () => {
    expect(user.get()).toBeNull();
    expect(isLoggedIn()).toBe(false);
  });

  it('should set a user via setLocalUser', () => {
    setLocalUser('test@example.com', 'Test User');
    const u = user.get();
    expect(u).not.toBeNull();
    expect(u!.email).toBe('test@example.com');
    expect(u!.full_name).toBe('Test User');
    expect(u!.isLoggedIn).toBe(true);
    expect(isLoggedIn()).toBe(true);
  });

  it('should persist user to localStorage', () => {
    setLocalUser('persist@test.com');
    const raw = localStorageMock.getItem('topzone_current_user');
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!);
    expect(parsed.email).toBe('persist@test.com');
  });

  it('should logout user and clear localStorage', () => {
    setLocalUser('logout@test.com');
    expect(isLoggedIn()).toBe(true);
    logoutUser();
    expect(user.get()).toBeNull();
    expect(isLoggedIn()).toBe(false);
    expect(localStorageMock.getItem('topzone_current_user')).toBeNull();
  });

  it('should return correct orders key for logged-in user', () => {
    setLocalUser('user@domain.com');
    const key = getOrdersKey();
    expect(key).toBe('topzone_orders_user_domain_com');
  });

  it('should return default orders key when not logged in', () => {
    logoutUser();
    const key = getOrdersKey();
    expect(key).toBe('topzone_orders');
  });

  it('should get current email when logged in', () => {
    setLocalUser('email@test.com');
    expect(getCurrentEmail()).toBe('email@test.com');
  });

  it('should return null email when not logged in', () => {
    logoutUser();
    expect(getCurrentEmail()).toBeNull();
  });

  it('should update user fields with updateLocalUser', () => {
    setLocalUser('update@test.com', 'Old Name');
    updateLocalUser({ full_name: 'New Name' });
    const u = user.get();
    expect(u!.full_name).toBe('New Name');
    expect(u!.email).toBe('update@test.com');
  });

  it('should merge user data with mergeLocalUser', () => {
    setLocalUser('merge@test.com');
    mergeLocalUser({ avatar_url: 'https://example.com/avatar.png' });
    const u = user.get();
    expect(u!.avatar_url).toBe('https://example.com/avatar.png');
    expect(u!.email).toBe('merge@test.com');
  });

  it('should set user to null via setUser(null)', () => {
    setLocalUser('test@test.com');
    expect(isLoggedIn()).toBe(true);
    setUser(null);
    expect(user.get()).toBeNull();
    expect(isLoggedIn()).toBe(false);
  });

  it('should handle setUser with valid user object', () => {
    const newUser = { email: 'full@test.com', full_name: 'Full Name', isLoggedIn: true };
    setUser(newUser);
    expect(user.get()?.email).toBe('full@test.com');
  });
});
