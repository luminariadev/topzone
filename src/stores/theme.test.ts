import { describe, it, expect, beforeEach } from 'vitest';

// Mock localStorage
const store: Record<string, string> = {};
const localStorageMock = {
  getItem: (key: string) => store[key] ?? null,
  setItem: (key: string, value: string) => { store[key] = value; },
  removeItem: (key: string) => { delete store[key]; },
  clear: () => { Object.keys(store).forEach(k => delete store[k]); },
  get length() { return Object.keys(store).length; },
  key: (i: number) => Object.keys(store)[i] ?? null,
};
Object.defineProperty(global, 'localStorage', { value: localStorageMock, writable: true });

// Mock window.matchMedia
Object.defineProperty(global, 'window', {
  value: { matchMedia: () => ({ matches: false, addEventListener: () => {}, removeEventListener: () => {} }) },
  writable: true,
});

// Import after mocks
import { currentTheme, setTheme, toggleTheme, applyThemeToDocument, Theme } from './theme';

describe('Theme Store', () => {
  beforeEach(() => {
    localStorageMock.clear();
    currentTheme.set('light');
  });

  it('starts with light theme by default', () => {
    expect(currentTheme.get()).toBe('light');
  });

  it('setTheme changes theme', () => {
    setTheme('dark');
    expect(currentTheme.get()).toBe('dark');
  });

  it('setTheme persists to localStorage', () => {
    setTheme('dark');
    expect(localStorage.getItem('topzone_theme')).toBe('dark');
  });

  it('toggleTheme switches between light and dark', () => {
    toggleTheme();
    expect(currentTheme.get()).toBe('dark');
    toggleTheme();
    expect(currentTheme.get()).toBe('light');
  });

  it('applyThemeToDocument calls classList.toggle with true for dark', () => {
    let calledWith: [string, boolean] | null = null;
    // Override document.documentElement for this test
    const savedDocEl = global.document?.documentElement;
    (global.document as any) = {
      documentElement: {
        classList: { toggle: (cls: string, val: boolean) => { calledWith = [cls, val]; } },
        style: {},
      },
    };
    applyThemeToDocument('dark');
    if (savedDocEl) (global.document as any) = savedDocEl;
    expect(calledWith).toEqual(['dark', true]);
  });
});
