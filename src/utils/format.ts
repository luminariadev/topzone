// src/utils/format.ts
// Formatting utilities for currency, dates, and relative time

/**
 * Format a number as Indonesian Rupiah currency
 * @param amount - The numeric amount to format
 * @param currency - Currency code (default: 'IDR')
 * @returns Formatted currency string (e.g., "Rp 150.000")
 */
export function formatCurrency(amount: number, currency = 'IDR'): string {
  if (!Number.isFinite(amount)) return 'Rp 0';
  if (currency === 'IDR') {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a date as Indonesian locale string
 * @param date - Date object, ISO string, or timestamp
 * @param options - Intl.DateTimeFormatOptions (optional)
 * @returns Formatted date string (e.g., "20 Juni 2024")
 * @example
 * formatDate('2024-06-20') // "20 Juni 2024"
 * formatDate(new Date(), { month: 'short' }) // "20 Jun 2024"
 */
export function formatDate(
  date: Date | string | number,
  options?: Intl.DateTimeFormatOptions
): string {
  const d = date instanceof Date ? date : new Date(date);
  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...options,
  };
  return d.toLocaleDateString('id-ID', defaultOptions);
}

/**
 * Format a date with time as Indonesian locale string
 * @param date - Date object, ISO string, or timestamp
 * @returns Formatted date and time string (e.g., "20 Juni 2024, 14:30")
 */
export function formatDateTime(date: Date | string | number): string {
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format a relative time string (e.g., "2 jam yang lalu", "3 hari yang lalu")
 * @param date - Date object, ISO string, or timestamp to compare from now
 * @returns Relative time string in Indonesian
 */
export function formatRelativeTime(date: Date | string | number): string {
  const d = date instanceof Date ? date : new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (diffSec < 60) return 'baru saja';
  if (diffMin < 60) return `${diffMin} menit yang lalu`;
  if (diffHour < 24) return `${diffHour} jam yang lalu`;
  if (diffDay < 7) return `${diffDay} hari yang lalu`;
  if (diffWeek < 4) return `${diffWeek} minggu yang lalu`;
  if (diffMonth < 12) return `${diffMonth} bulan yang lalu`;
  return `${diffYear} tahun yang lalu`;
}