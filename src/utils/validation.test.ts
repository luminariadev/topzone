import { describe, it, expect } from 'vitest';

import { isValidEmail, isValidPhone, validateOrder, validatePassword } from '../utils/validation';

describe('isValidEmail', () => {
  it('accepts valid email', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
  });

  it('rejects email without @', () => {
    expect(isValidEmail('userexample.com')).toBe(false);
  });

  it('rejects empty string', () => {
    expect(isValidEmail('')).toBe(false);
  });

  it('rejects null/undefined', () => {
    expect(isValidEmail(null as any)).toBe(false);
    expect(isValidEmail(undefined as any)).toBe(false);
  });

  it('accepts email with subdomain', () => {
    expect(isValidEmail('user@sub.example.co.id')).toBe(true);
  });
});

describe('isValidPhone', () => {
  it('accepts 08xx format', () => {
    expect(isValidPhone('08123456789')).toBe(true);
  });

  it('accepts +628xx format', () => {
    expect(isValidPhone('+628123456789')).toBe(true);
  });

  it('rejects too short number', () => {
    expect(isValidPhone('08123')).toBe(false);
  });

  it('handles spaces and dashes', () => {
    expect(isValidPhone('0812-3456-7890')).toBe(true);
  });
});

describe('validateOrder', () => {
  it('returns errors for empty fields', () => {
    const errors = validateOrder({});
    expect(errors.name).toBeDefined();
    expect(errors.email).toBeDefined();
    expect(errors.phone).toBeDefined();
    expect(errors.payment).toBeDefined();
  });

  it('validates email format', () => {
    const errors = validateOrder({ email: 'invalid', name: 'Test', phone: '08123456789', payment: 'qris' });
    expect(errors.email).toContain('tidak valid');
  });

  it('validates phone format', () => {
    const errors = validateOrder({ email: 'a@b.com', name: 'Test', phone: '123', payment: 'qris' });
    expect(errors.phone).toContain('tidak valid');
  });

  it('returns no errors for valid data', () => {
    const errors = validateOrder({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '081234567890',
      payment: 'qris',
    });
    expect(Object.keys(errors)).toHaveLength(0);
  });

  it('validates minimum name length', () => {
    const errors = validateOrder({ name: 'Jo', email: 'a@b.com', phone: '08123456789', payment: 'qris' });
    expect(errors.name).toContain('minimal');
  });
});

describe('validatePassword', () => {
  it('rejects short password', () => {
    const result = validatePassword('Ab1');
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('rejects password without uppercase', () => {
    const result = validatePassword('abcdefgh123');
    expect(result.isValid).toBe(false);
    expect(result.errors.some(e => e.includes('kapital'))).toBe(true);
  });

  it('rejects password without lowercase', () => {
    const result = validatePassword('ABCDEFGH123');
    expect(result.isValid).toBe(false);
  });

  it('accepts strong password', () => {
    const result = validatePassword('StrongPass123');
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('rejects empty password', () => {
    const result = validatePassword('');
    expect(result.isValid).toBe(false);
  });
});
