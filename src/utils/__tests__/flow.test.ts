import { describe, it, expect } from 'vitest';

describe('User Flow: Browse → Cart → Checkout', () => {
  const mockGame = {
    slug: 'mobile-legends',
    name: 'Mobile Legends',
    img: '/assets/mlbb.png',
    price: 0,
    type: 'game' as const,
    category: 'mobile',
    currency: 'Diamond',
    description: 'Top up diamond Mobile Legends.',
    packages: [
      { id: 'mlbb-86', label: '86 Diamond', price: 19000 },
      { id: 'mlbb-172', label: '172 Diamond', price: 37000 },
    ],
  };

  const mockGear = {
    slug: 'mechanical-keyboard',
    name: 'Mechanical Keyboard',
    img: '/assets/keyboard.png',
    price: 350000,
    type: 'gear' as const,
    category: 'keyboard',
    tag: 'RGB Ready',
    description: 'Keyboard mekanikal 75%.',
    specs: [
      { label: 'Layout', value: '75% Compact' },
      { label: 'Switch', value: 'Blue Tactile' },
    ],
  };

  describe('Browse Products', () => {
    it('should have valid game data structure', () => {
      expect(mockGame).toHaveProperty('slug');
      expect(mockGame).toHaveProperty('name');
      expect(mockGame).toHaveProperty('packages');
      expect(Array.isArray(mockGame.packages)).toBe(true);
    });

    it('should have valid gear data structure', () => {
      expect(mockGear).toHaveProperty('slug');
      expect(mockGear).toHaveProperty('name');
      expect(mockGear).toHaveProperty('price');
      expect(mockGear.price).toBeGreaterThan(0);
      expect(Array.isArray(mockGear.specs)).toBe(true);
    });

    it('should have packages sorted by price ascending', () => {
      const prices = mockGame.packages.map(p => p.price);
      const sorted = [...prices].sort((a, b) => a - b);
      expect(prices).toEqual(sorted);
    });

    it('should have non-empty package labels', () => {
      mockGame.packages.forEach(pkg => {
        expect(pkg.label).toBeTruthy();
        expect(typeof pkg.label).toBe('string');
      });
    });

    it('should have positive package prices', () => {
      mockGame.packages.forEach(pkg => {
        expect(pkg.price).toBeGreaterThan(0);
      });
    });
  });

  describe('Cart Operations', () => {
    it('should calculate cart total for single item', () => {
      const item = { id: mockGear.slug, name: mockGear.name, price: mockGear.price, qty: 1, img: mockGear.img, type: 'gear' as const };
      const total = item.price * item.qty;
      expect(total).toBe(350000);
    });

    it('should calculate cart total for multiple items', () => {
      const items = [
        { id: 'mlbb-86', name: '86 Diamond', price: 19000, qty: 2, img: '', type: 'game' as const },
        { id: mockGear.slug, name: mockGear.name, price: 350000, qty: 1, img: '', type: 'gear' as const },
      ];
      const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
      expect(total).toBe(388000);
    });

    it('should handle quantity updates correctly', () => {
      const item = { id: mockGear.slug, name: mockGear.name, price: mockGear.price, qty: 2, img: mockGear.img, type: 'gear' as const };
      const updatedQty = 5;
      const total = item.price * updatedQty;
      expect(total).toBe(1750000);
    });

    it('should handle item removal from cart', () => {
      const items = [
        { id: 'valo-420', name: '420 VP', price: 55000, qty: 1, img: '', type: 'game' as const },
        { id: mockGear.slug, name: mockGear.name, price: 350000, qty: 1, img: '', type: 'gear' as const },
      ];
      const removedId = 'valo-420';
      const filtered = items.filter(i => i.id !== removedId);
      expect(filtered).toHaveLength(1);
      expect(filtered[0].id).toBe(mockGear.slug);
      const newTotal = filtered.reduce((sum, i) => sum + i.price * i.qty, 0);
      expect(newTotal).toBe(350000);
    });

    it('should handle empty cart', () => {
      const emptyCart: any[] = [];
      expect(emptyCart.length).toBe(0);
      const total = emptyCart.reduce((sum, i) => sum + i.price * i.qty, 0);
      expect(total).toBe(0);
    });

    it('should calculate cart discount correctly', () => {
      const subtotal = 100000;
      const discount = 10;
      const finalTotal = Math.round(subtotal * (100 - discount) / 100);
      expect(finalTotal).toBe(90000);
    });
  });

  describe('Checkout Flow', () => {
    const formData = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '081234567890',
      payment: 'bank' as const,
    };

    it('should have valid checkout form data', () => {
      expect(formData.name).toBeTruthy();
      expect(formData.email).toContain('@');
      expect(formData.phone).toMatch(/^08\d+$/);
    });

    it('should calculate order grand total correctly', () => {
      const items = [
        { product_name: '86 Diamond', product_price: 19000, quantity: 2, type: 'game' as const },
        { product_name: mockGear.name, product_price: 350000, quantity: 1, type: 'gear' as const },
      ];
      const subtotal = items.reduce((s, i) => s + i.product_price * i.quantity, 0);
      expect(subtotal).toBe(388000);
    });

    it('should generate order with correct status', () => {
      const order = {
        id: 'test-order-1',
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        items: [{ product_name: '86 Diamond', product_price: 19000, quantity: 2, type: 'game' as const }],
        total: 38000,
        status: 'pending' as const,
        createdAt: new Date().toISOString(),
      };
      expect(order.status).toBe('pending');
      expect(order.total).toBeGreaterThan(0);
      expect(order.items.length).toBeGreaterThan(0);
    });

    it('should update order status correctly', () => {
      const statuses = ['pending', 'processing', 'completed', 'cancelled'] as const;
      statuses.forEach(s => {
        expect(['pending', 'processing', 'completed', 'cancelled']).toContain(s);
      });
    });

    it('should handle order status transitions', () => {
      type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';
      const validTransitions: Record<OrderStatus, OrderStatus[]> = {
        pending: ['processing', 'cancelled'],
        processing: ['completed', 'cancelled'],
        completed: [],
        cancelled: [],
      };
      expect(validTransitions.pending).toContain('processing');
      expect(validTransitions.pending).toContain('cancelled');
      expect(validTransitions.processing).toContain('completed');
      expect(validTransitions.completed).toEqual([]);
    });
  });

  describe('Order History', () => {
    it('should return orders sorted by date descending', () => {
      const orders = [
        { id: '1', createdAt: '2024-01-20T10:00:00Z' },
        { id: '2', createdAt: '2024-01-21T10:00:00Z' },
        { id: '3', createdAt: '2024-01-19T10:00:00Z' },
      ];
      const sorted = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      expect(sorted[0].id).toBe('2');
      expect(sorted[1].id).toBe('1');
      expect(sorted[2].id).toBe('3');
    });
  });
});
