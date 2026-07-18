// src/utils/a11y.ts
// Accessibility utilities for TopZone
// Keyboard trap, focus management, reduced motion detection, and toast announcements

/**
 * Trap focus within a container (for modals, dialogs, etc.)
 * @param container - The container element to trap focus within
 * @returns Cleanup function to remove event listener
 */
export function trapFocus(container: HTMLElement): () => void {
  const focusableSelector = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

  const handler = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    const focusable = container.querySelectorAll<HTMLElement>(focusableSelector);
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      // Shift+Tab: if focus is on first element, move to last
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      // Tab: if focus is on last element, move to first
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  document.addEventListener('keydown', handler);
  return () => document.removeEventListener('keydown', handler);
}

/**
 * Move focus to an element by ID with smooth scroll
 */
export function focusAndScrollTo(elementId: string): void {
  const el = document.getElementById(elementId);
  if (!el) return;

  el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  // Clean up tabindex after focus for non-interactive elements
  setTimeout(() => {
    if (el.getAttribute('tabindex') === '-1') {
      el.removeAttribute('tabindex');
    }
  }, 300);
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Announce a message to screen readers via a live region
 * @param message - The message to announce
 * @param polite - If true, uses aria-live="polite" (default); false uses "assertive"
 */
export function announceToScreenReader(message: string, polite = true): void {
  let announcer = document.getElementById('sr-announcer') as HTMLDivElement | null;

  if (!announcer) {
    announcer = document.createElement('div');
    announcer.id = 'sr-announcer';
    announcer.setAttribute('aria-live', polite ? 'polite' : 'assertive');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    document.body.appendChild(announcer);
  }

  // Clear first then set to trigger announcement even if same text
  announcer.textContent = '';
  setTimeout(() => {
    announcer!.textContent = message;
  }, 50);
}

/**
 * Initialize screen reader announcer (call once on page load)
 */
export function initScreenReaderAnnouncer(): void {
  if (document.getElementById('sr-announcer')) return;

  const announcer = document.createElement('div');
  announcer.id = 'sr-announcer';
  announcer.setAttribute('aria-live', 'polite');
  announcer.setAttribute('aria-atomic', 'true');
  announcer.className = 'sr-only';
  document.body.appendChild(announcer);
}

/**
 * Generate a unique ID prefix for ARIA references
 */
let idCounter = 0;
export function generateAriaId(prefix: string): string {
  return `${prefix}-${++idCounter}-${Date.now()}`;
}

/**
 * Make an element announce its content when it becomes visible
 * Useful for form validation messages
 */
export function setupLiveValidation(containerEl: HTMLElement): void {
  const errorEls = containerEl.querySelectorAll('[data-validation-message]');
  errorEls.forEach(el => {
    el.setAttribute('aria-live', 'polite');
    el.setAttribute('aria-atomic', 'true');
  });
}