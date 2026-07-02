// src/stores/theme.ts
import { atom } from 'nanostores';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'topzone_theme';

function loadTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return (saved === 'dark' ? 'dark' : 'light') as Theme;
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
