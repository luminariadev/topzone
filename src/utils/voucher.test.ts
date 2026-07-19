// src/utils/voucher.test.ts
import { describe, it, expect } from 'vitest';

// Simple voucher validation logic (matches what checkout uses)
function validateVoucher(voucher: {
  code?: string;
  discount_percent?: number;
  min_purchase?: number;
  expires_at?: string;
  max_uses?: number;
  used_count?: number;
  is_active?: boolean;
}): { valid: boolean; discount?: number; error?: string } {
  if (!voucher.code) return { valid: false, error: 'Kode voucher tidak valid' };
  if (voucher.is_active === false) return { valid: false, error: 'Voucher tidak aktif' };
  if (voucher.expires_at && new Date(voucher.expires_at) < new Date()) {
    return { valid: false, error: 'Voucher sudah kadaluarsa' };
  }
  if (voucher.max_uses && voucher.max_uses > 0 && (voucher.used_count || 0) >= voucher.max_uses) {
    return { valid: false, error: 'Voucher sudah habis terpakai' };
  }
  return { valid: true, discount: voucher.discount_percent || 0 };
}

function calculateDiscount(subtotal: number, discountPercent: number): number {
  if (subtotal <= 0) return 0;
  const discount = Math.round(subtotal * discountPercent / 100);
  // Cap discount at 50% of subtotal
  return Math.min(discount, Math.round(subtotal * 0.5));
}

describe('validateVoucher', () => {
  it('accepts valid voucher', () => {
    const result = validateVoucher({
      code: 'WELCOME10',
      discount_percent: 10,
      min_purchase: 50000,
      is_active: true,
      expires_at: '2099-12-31',
    });
    expect(result.valid).toBe(true);
    expect(result.discount).toBe(10);
  });

  it('rejects expired voucher', () => {
    const result = validateVoucher({
      code: 'EXPIRED',
      expires_at: '2023-01-01',
      is_active: true,
    });
    expect(result.valid).toBe(false);
    expect(result.error).toContain('kadaluarsa');
  });

  it('rejects fully used voucher', () => {
    const result = validateVoucher({
      code: 'USEDUP',
      max_uses: 5,
      used_count: 5,
      is_active: true,
    });
    expect(result.valid).toBe(false);
    expect(result.error).toContain('habis');
  });

  it('rejects inactive voucher', () => {
    const result = validateVoucher({
      code: 'INACTIVE',
      is_active: false,
    });
    expect(result.valid).toBe(false);
    expect(result.error).toContain('tidak aktif');
  });
});

describe('calculateDiscount', () => {
  it('calculates 10% discount on 100,000', () => {
    expect(calculateDiscount(100000, 10)).toBe(10000);
  });

  it('caps discount at 50%', () => {
    expect(calculateDiscount(100000, 75)).toBe(50000);
  });

  it('returns 0 for zero subtotal', () => {
    expect(calculateDiscount(0, 10)).toBe(0);
  });

  it('rounds to nearest integer', () => {
    expect(calculateDiscount(9999, 10)).toBe(1000);
  });
});
