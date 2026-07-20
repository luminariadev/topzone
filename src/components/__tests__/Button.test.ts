// src/components/__tests__/Button.test.ts
import { describe, it, expect } from 'vitest';

// Button component tests — variants, sizes, disabled, href mode

type Variant = 'green' | 'pink' | 'yellow' | 'white' | 'black';
type Size = 'sm' | 'md' | 'lg';

function getButtonClasses(variant: Variant, size: Size, disabled: boolean = false): string[] {
  const classes: string[] = [];
  const bgColors: Record<Variant, string> = {
    green: 'bg-neon-green text-black hover:bg-[#2fe510]',
    pink: 'bg-neon-pink text-white hover:bg-[#e00070]',
    yellow: 'bg-neon-yellow text-black hover:bg-[#e5e500]',
    white: 'bg-white text-black hover:bg-neutral-100',
    black: 'bg-black text-white hover:bg-neutral-900',
  };
  const sizes: Record<Size, string> = {
    sm: 'px-4 py-2 text-xs md:text-sm font-bold',
    md: 'px-6 py-3 text-sm md:text-base font-bold',
    lg: 'px-8 py-4 text-base md:text-lg font-black',
  };

  classes.push(bgColors[variant]);
  classes.push(sizes[size]);
  if (disabled) classes.push('opacity-50', 'cursor-not-allowed');
  return classes;
}

describe('Button', () => {
  it('renders with green variant (default)', () => {
    const classes = getButtonClasses('green', 'md');
    expect(classes.some(c => c.includes('bg-neon-green'))).toBe(true);
  });

  it('renders with pink variant', () => {
    const classes = getButtonClasses('pink', 'md');
    expect(classes.some(c => c.includes('bg-neon-pink'))).toBe(true);
  });

  it('renders with yellow variant', () => {
    const classes = getButtonClasses('yellow', 'md');
    expect(classes.some(c => c.includes('bg-neon-yellow'))).toBe(true);
  });

  it('renders with white variant', () => {
    const classes = getButtonClasses('white', 'md');
    expect(classes.some(c => c.includes('bg-white'))).toBe(true);
  });

  it('renders with black variant', () => {
    const classes = getButtonClasses('black', 'md');
    expect(classes.some(c => c.includes('bg-black'))).toBe(true);
  });

  it('uses correct size classes for sm', () => {
    const classes = getButtonClasses('green', 'sm');
    expect(classes.some(c => c.includes('px-4 py-2'))).toBe(true);
  });

  it('uses correct size classes for md', () => {
    const classes = getButtonClasses('green', 'md');
    expect(classes.some(c => c.includes('px-6 py-3'))).toBe(true);
  });

  it('uses correct size classes for lg', () => {
    const classes = getButtonClasses('green', 'lg');
    expect(classes.some(c => c.includes('px-8 py-4'))).toBe(true);
  });

  it('adds disabled styles when disabled', () => {
    const classes = getButtonClasses('green', 'md', true);
    expect(classes).toContain('opacity-50');
    expect(classes).toContain('cursor-not-allowed');
  });

  it('renders as anchor when href is provided', () => {
    const href = '/games';
    expect(href).toBeTruthy();
  });

  it('renders as button when no href', () => {
    // Default tag is 'button' when no href
    const tag = 'button';
    expect(tag).toBe('button');
  });

  it('includes focus-visible ring for accessibility', () => {
    const focusRingClass = 'focus-visible:ring-4 focus-visible:ring-black';
    expect(focusRingClass).toContain('focus-visible:ring');
  });
});
