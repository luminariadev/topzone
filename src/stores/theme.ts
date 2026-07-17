// src/stores/theme.ts
import { atom } from 'nanostores';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'topzone_theme';

/** Detect system color scheme preference */
function getSystemPreference(): Theme | null {
  if (typeof window === 'undefined' || !window.matchMedia) return null;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function loadTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved as Theme;
    // Fall back to system preference if no saved theme
    return getSystemPreference() || 'light';
  } catch {
    return 'light';
  }
}

function saveTheme(t: Theme) {
  try {
    if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, t);
  } catch {
    // Silently skip if storage unavailable
  }
}

export const currentTheme = atom<Theme>(loadTheme());

export function setTheme(t: Theme) {
  currentTheme.set(t);
  saveTheme(t);
}

export function toggleTheme() {
  const next = currentTheme.get() === 'dark' ? 'light' : 'dark';
  setTheme(next);
}

export function applyThemeToDocument(t: Theme) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.classList.toggle('dark', t === 'dark');
}

/** Listen for system colour scheme changes and update if user hasn't set a preference */
export function listenForSystemPreference(): () => void {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {};
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  const handler = () => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        const sys = mq.matches ? 'dark' : 'light';
        currentTheme.set(sys);
        applyThemeToDocument(sys);
      }
    } catch { /* storage unavailable */ }
  };
  mq.addEventListener('change', handler);
  return () => mq.removeEventListener('change', handler);
}
