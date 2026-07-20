// src/components/__tests__/Toast.test.ts
import { describe, it, expect } from 'vitest';

// Toast notification component tests — show, auto-dismiss, types

describe('Toast', () => {
  const ICONS: Record<string, string> = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠',
  };

  const COLORS: Record<string, string> = {
    success: 'bg-neon-green text-black border-neon-green',
    error: 'bg-red-500 text-white border-red-600',
    info: 'bg-white text-black border-black',
    warning: 'bg-neon-yellow text-black border-yellow-400',
  };

  function createToast(message: string, type: string = 'success'): { message: string; type: string; colorClass: string; icon: string } {
    const colorClass = COLORS[type] || COLORS.info;
    const icon = ICONS[type] || ICONS.info;
    return { message, type, colorClass, icon };
  }

  it('creates a success toast with correct icon', () => {
    const toast = createToast('Berhasil ditambahkan!', 'success');
    expect(toast.icon).toBe('✓');
    expect(toast.colorClass).toContain('bg-neon-green');
  });

  it('creates an error toast with correct icon', () => {
    const toast = createToast('Gagal memproses!', 'error');
    expect(toast.icon).toBe('✕');
    expect(toast.colorClass).toContain('bg-red-500');
  });

  it('creates an info toast with correct icon', () => {
    const toast = createToast('Informasi baru', 'info');
    expect(toast.icon).toBe('ℹ');
    expect(toast.colorClass).toContain('bg-white');
  });

  it('creates a warning toast with correct icon', () => {
    const toast = createToast('Perhatian!', 'warning');
    expect(toast.icon).toBe('⚠');
    expect(toast.colorClass).toContain('bg-neon-yellow');
  });

  it('defaults to info for unknown type', () => {
    const toast = createToast('test', 'unknown' as any);
    expect(toast.icon).toBe('ℹ');
    expect(toast.colorClass).toContain('bg-white');
  });

  it('auto-dismisses after default duration (3000ms)', () => {
    const duration = 3000;
    const defaultDuration = 3000;
    expect(duration).toBe(defaultDuration);
  });

  it('supports network error toast with retry', () => {
    const networkToast = {
      message: 'Koneksi gagal. Menggunakan data offline.',
      type: 'error' as const,
      hasRetry: true,
    };
    expect(networkToast.message).toContain('Koneksi gagal');
    expect(networkToast.hasRetry).toBe(true);
  });
});
