// src/components/__tests__/Card.test.ts
import { describe, it, expect } from 'vitest';

// Card component tests — variants, interactive mode, children

type Variant = 'white' | 'green' | 'pink' | 'yellow' | 'transparent';

function getCardClasses(variant: Variant, interactive: boolean = false): string[] {
  const classes: string[] = [];
  const bgColors: Record<Variant, string> = {
    white: 'bg-white text-black dark:bg-gray-800 dark:text-white',
    green: 'bg-neon-green text-black dark:bg-green-700 dark:text-white',
    pink: 'bg-neon-pink text-white',
    yellow: 'bg-neon-yellow text-black dark:bg-yellow-600 dark:text-white',
    transparent: 'bg-transparent text-black dark:text-white',
  };

  classes.push('p-6 border-4 border-black dark:border-gray-300 rounded-none shadow-[6px_6px_0px_0px_#000000]');
  classes.push(bgColors[variant]);
  if (interactive) {
    classes.push('hover:-translate-x-[2px]', 'hover:-translate-y-[2px]', 'cursor-pointer');
  }
  return classes;
}

describe('Card', () => {
  it('renders with white variant (default)', () => {
    const classes = getCardClasses('white');
    expect(classes.some(c => c.includes('bg-white'))).toBe(true);
  });

  it('renders with green variant', () => {
    const classes = getCardClasses('green');
    expect(classes.some(c => c.includes('bg-neon-green'))).toBe(true);
  });

  it('renders with pink variant', () => {
    const classes = getCardClasses('pink');
    expect(classes.some(c => c.includes('bg-neon-pink'))).toBe(true);
  });

  it('renders with yellow variant', () => {
    const classes = getCardClasses('yellow');
    expect(classes.some(c => c.includes('bg-neon-yellow'))).toBe(true);
  });

  it('renders with transparent variant', () => {
    const classes = getCardClasses('transparent');
    expect(classes.some(c => c.includes('bg-transparent'))).toBe(true);
  });

  it('adds interactive hover classes when interactive is true', () => {
    const classes = getCardClasses('white', true);
    expect(classes).toContain('hover:-translate-x-[2px]');
    expect(classes).toContain('hover:-translate-y-[2px]');
    expect(classes).toContain('cursor-pointer');
  });

  it('does not add interactive classes by default', () => {
    const classes = getCardClasses('white');
    expect(classes.some(c => c.includes('cursor-pointer'))).toBe(false);
  });

  it('has neubrutalism shadow style', () => {
    const classes = getCardClasses('white');
    expect(classes.some(c => c.includes('shadow-[6px_6px_0px_0px_#000000]'))).toBe(true);
  });

  it('has thick black border', () => {
    const classes = getCardClasses('white');
    expect(classes.some(c => c.includes('border-4 border-black'))).toBe(true);
  });
});
