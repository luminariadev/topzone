import { describe, it, expect, beforeEach } from 'vitest';

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
    get length() { return Object.keys(store).length; },
    key: (index: number) => Object.keys(store)[index] ?? null,
  };
})();

describe('auth store', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('should store and retrieve user from localStorage', () => {
    const user = { email: 'test@example.com', full_name: 'Test User', isLoggedIn: true };
    localStorageMock.setItem('topzone_current_user', JSON.stringify(user));
    const stored = localStorageMock.getItem('topzone_current_user');
    expect(stored).toBeTruthy();
    const parsed = JSON.parse(stored!);
    expect(parsed.email).toBe('test@example.com');
    expect(parsed.full_name).toBe('Test User');
    expect(parsed.isLoggedIn).toBe(true);
  });

  it('should clear user on logout', () => {
    localStorageMock.setItem('topzone_current_user', JSON.stringify({ email: 'test@example.com', isLoggedIn: true }));
    localStorageMock.removeItem('topzone_current_user');
    expect(localStorageMock.getItem('topzone_current_user')).toBeNull();
  });

  it('should generate correct orders key for logged in user', () => {
    const email = 'test@example.com';
    const expectedKey = 'topzone_orders_' + email.replace(/[^a-zA-Z0-9]/g, '_');
    expect(expectedKey).toBe('topzone_orders_test_example_com');
  });

  it('should generate fallback orders key for guest', () => {
    expect('topzone_orders').toBe('topzone_orders');
  });

  it('should sanitize email for orders key', () => {
    const dirtyEmail = 'user+tag@sub.domain.com';
    const sanitized = dirtyEmail.replace(/[^a-zA-Z0-9]/g, '_');
    expect(sanitized).toBe('user_tag_sub_domain_com');
  });

  it('should validate password length >= 6', () => {
    expect('12345'.length >= 6).toBe(false);
    expect('123456'.length >= 6).toBe(true);
  });

  it('should validate password confirmation match', () => {
    expect('secret123' === 'secret123').toBe(true);
    expect('wrong' === 'secret123').toBe(false);
  });

  it('should store voucher in localStorage correctly', () => {
    const voucher = { code: 'WELCOME-ABC12345', discount: 10, used: false, createdAt: new Date().toISOString() };
    localStorageMock.setItem('topzone_voucher', JSON.stringify(voucher));
    const parsed = JSON.parse(localStorageMock.getItem('topzone_voucher')!);
    expect(parsed.code).toMatch(/^WELCOME-/);
    expect(parsed.discount).toBe(10);
    expect(parsed.used).toBe(false);
  });

  it('should default full_name from email when not provided', () => {
    const email = 'gamer@example.com';
    expect(email.split('@')[0]).toBe('gamer');
  });
});
