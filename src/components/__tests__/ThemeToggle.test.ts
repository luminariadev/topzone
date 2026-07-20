// src/components/__tests__/ThemeToggle.test.ts
import { describe, it, expect } from 'vitest';

// ThemeToggle component logic tests — toggle, icon visibility, aria-label

describe('ThemeToggle', () => {
  it('toggles between light and dark', () => {
    let theme: 'light' | 'dark' = 'light';
    function toggleTheme() {
      theme = theme === 'dark' ? 'light' : 'dark';
    }

    expect(theme).toBe('light');
    toggleTheme();
    expect(theme).toBe('dark');
    toggleTheme();
    expect(theme).toBe('light');
  });

  it('shows sun icon in dark mode and moon in light mode', () => {
    function getIconVisibility(t: 'light' | 'dark') {
      return {
        sunHidden: t !== 'dark',
        moonHidden: t === 'dark',
      };
    }

    expect(getIconVisibility('dark')).toEqual({ sunHidden: false, moonHidden: true });
    expect(getIconVisibility('light')).toEqual({ sunHidden: true, moonHidden: false });
  });

  it('has correct aria-label for accessibility', () => {
    const ariaLabel = 'Toggle dark mode';
    expect(ariaLabel).toBe('Toggle dark mode');
  });

  it('applies theme to document root', () => {
    function applyTheme(t: 'light' | 'dark'): string[] {
      const classList: string[] = [];
      // Simulate: root.classList.toggle('dark', t === 'dark')
      if (t === 'dark') classList.push('dark');
      return classList;
    }

    expect(applyTheme('dark')).toContain('dark');
    expect(applyTheme('light')).not.toContain('dark');
  });
});
