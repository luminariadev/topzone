// src/utils/payment.test.ts
import { describe, it, expect } from 'vitest';

// Payment calculation logic (matches what checkout uses)
function formatRp(amount: number): string {
  return `Rp ${amount.toLocaleString('id-ID')}`;
}

function calculateTax(subtotal: number, taxPercent = 11): number {
  if (subtotal <= 0) return 0;
  return Math.round(subtotal * taxPercent / 100);
}

function calculateFinalTotal(params: {
  subtotal: number;
  discount?: number;
  shipping?: number;
  taxPercent?: number;
  pointsDiscount?: number;
}): { subtotal: number; discount: number; shipping: number; tax: number; points_discount: number; final_total: number } {
  const { subtotal, discount = 0, shipping = 0, taxPercent = 11, pointsDiscount = 0 } = params;

  const afterDiscount = Math.max(0, subtotal - discount);
  const tax = calculateTax(afterDiscount, taxPercent);
  const finalTotal = Math.max(0, afterDiscount + tax + shipping - pointsDiscount);

  return {
    subtotal,
    discount,
    shipping,
    tax,
    points_discount: pointsDiscount,
    final_total: finalTotal,
  };
}

describe('formatRp', () => {
  it('formats number to IDR', () => {
    expect(formatRp(50000)).toBe('Rp 50.000');
  });

  it('formats zero', () => {
    expect(formatRp(0)).toBe('Rp 0');
  });
});

describe('calculateTax', () => {
  it('calculates 11% tax correctly', () => {
    expect(calculateTax(100000)).toBe(11000);
  });

  it('returns 0 for zero subtotal', () => {
    expect(calculateTax(0)).toBe(0);
  });
});

describe('calculateFinalTotal', () => {
  it('calculates simple total', () => {
    const result = calculateFinalTotal({ subtotal: 100000 });
    expect(result.final_total).toBe(100000 + 11000); // subtotal + tax
  });

  it('applies discount before tax', () => {
    const result = calculateFinalTotal({ subtotal: 100000, discount: 10000 });
    expect(result.discount).toBe(10000);
    expect(result.tax).toBe(Math.round(90000 * 0.11));
  });

  it('applies points discount after tax', () => {
    const result = calculateFinalTotal({ subtotal: 50000, pointsDiscount: 5000 });
    expect(result.points_discount).toBe(5000);
    expect(result.final_total).toBe(50000 + 5500 - 5000);
  });

  it('handles free with full discount', () => {
    const result = calculateFinalTotal({ subtotal: 100000, discount: 100000 });
    expect(result.final_total).toBe(0 + 0 + 0 - 0);
  });

  it('handles shipping addition', () => {
    const result = calculateFinalTotal({ subtotal: 100000, shipping: 15000 });
    expect(result.shipping).toBe(15000);
    expect(result.final_total).toBe(100000 + 11000 + 15000);
  });
});
