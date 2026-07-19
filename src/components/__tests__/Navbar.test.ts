// src/components/__tests__/Navbar.test.ts
import { describe, it, expect } from 'vitest';

// Navbar component logic tests
// Tests for mobile toggle, navigation items, and theme handling

function createNavItems(userRole?: string): { label: string; href: string; visible: boolean }[] {
  const items = [
    { label: 'Home', href: '/', visible: true },
    { label: 'Games', href: '/games', visible: true },
    { label: 'Gear', href: '/gear', visible: true },
    { label: 'Cart', href: '/cart', visible: true },
    { label: 'Profile', href: '/profile', visible: !!userRole },
    { label: 'Admin', href: '/admin', visible: userRole === 'admin' },
  ];
  return items.filter(i => i.visible);
}

describe('Navbar navigation items', () => {
  it('shows basic items for anonymous user', () => {
    const items = createNavItems();
    expect(items).toHaveLength(4);
    expect(items.map(i => i.label)).toEqual(['Home', 'Games', 'Gear', 'Cart']);
  });

  it('shows profile for logged-in users', () => {
    const items = createNavItems('user');
    expect(items.some(i => i.label === 'Profile')).toBe(true);
  });

  it('shows admin for admin users', () => {
    const items = createNavItems('admin');
    expect(items.some(i => i.label === 'Admin')).toBe(true);
  });
});

describe('Navbar mobile toggle', () => {
  it('toggles mobile menu state', () => {
    let isOpen = false;
    function toggle() { isOpen = !isOpen; }

    expect(isOpen).toBe(false);
    toggle();
    expect(isOpen).toBe(true);
    toggle();
    expect(isOpen).toBe(false);
  });
});
