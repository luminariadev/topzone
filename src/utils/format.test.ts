import { describe, it, expect } from 'vitest';

import { formatCurrency, formatDate, formatDateTime, formatRelativeTime } from '../utils/format';

describe('formatCurrency', () => {
  it('formats basic IDR amount', () => {
    const result = formatCurrency(15000);
    expect(result).toMatch(/Rp/);
    expect(result).toMatch(/15\.?000/);
  });

  it('formats zero', () => {
    expect(formatCurrency(0)).toMatch(/0/);
  });

  it('formats large numbers', () => {
    const result = formatCurrency(1000000);
    expect(result).toMatch(/1\.?000\.?000/);
  });

  it('returns Rp 0 for NaN', () => {
    expect(formatCurrency(NaN)).toBe('Rp 0');
  });

  it('returns Rp 0 for Infinity', () => {
    expect(formatCurrency(Infinity)).toBe('Rp 0');
  });

  it('returns Rp 0 for -Infinity', () => {
    expect(formatCurrency(-Infinity)).toBe('Rp 0');
  });

  it('formats thousands separator correctly', () => {
    const result = formatCurrency(5000000);
    expect(result).toMatch(/5/);
    expect(result).toMatch(/000/);
  });
});

describe('formatDate', () => {
  it('formats ISO string to Indonesian date', () => {
    const result = formatDate('2024-06-20');
    expect(result).toContain('Juni');
    expect(result).toContain('2024');
    expect(result).toContain('20');
  });

  it('formats Date object', () => {
    const result = formatDate(new Date(2024, 0, 15));
    expect(result).toContain('Januari');
    expect(result).toContain('15');
  });

  it('supports custom options (short month)', () => {
    const result = formatDate('2024-06-20', { month: 'short' });
    expect(result).toContain('Jun');
  });
});

describe('formatDateTime', () => {
  it('includes time component', () => {
    const result = formatDateTime('2024-06-20T14:30:00');
    expect(result).toContain('14');
    expect(result).toContain('30');
  });
});

describe('formatRelativeTime', () => {
  it('returns "baru saja" for recent', () => {
    expect(formatRelativeTime(new Date())).toBe('baru saja');
  });

  it('returns minutes for recent activity', () => {
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
    expect(formatRelativeTime(fiveMinAgo)).toMatch(/menit/);
  });

  it('returns hours for older activity', () => {
    const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);
    expect(formatRelativeTime(threeHoursAgo)).toMatch(/jam/);
  });

  it('returns days for much older activity', () => {
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    expect(formatRelativeTime(twoDaysAgo)).toMatch(/hari/);
  });

  it('returns months for very old activity', () => {
    const twoMonthsAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
    expect(formatRelativeTime(twoMonthsAgo)).toMatch(/bulan/);
  });
});
