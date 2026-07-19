import { describe, it, expect } from 'vitest';
import { calculateShipping, getAllShippingCosts, COURIERS, formatAddress } from '../utils/shipping';

describe('calculateShipping', () => {
  it('returns null for unknown courier', () => {
    expect(calculateShipping('unknown', 1000, 0)).toBeNull();
  });

  it('calculates JNE regular cost for 1kg', () => {
    const result = calculateShipping('jne', 1000, 0);
    expect(result).not.toBeNull();
    expect(result!.courier).toBe('jne');
    expect(result!.cost).toBe(12000);
  });

  it('multiplies for heavier weight', () => {
    const result = calculateShipping('jnt', 2500, 0);
    expect(result).not.toBeNull();
    expect(result!.cost).toBe(30000); // 10000 * ceil(2500/1000) = 10000 * 3
  });

  it('returns free shipping above threshold', () => {
    const result = calculateShipping('jne', 1000, 250000);
    expect(result).not.toBeNull();
    expect(result!.cost).toBe(0);
    expect(result!.note).toContain('Gratis');
  });

  it('enforces minimum 1kg weight', () => {
    const result = calculateShipping('jne', 500, 0);
    expect(result!.cost).toBe(12000); // min 1000g
  });
});

describe('getAllShippingCosts', () => {
  it('returns all couriers sorted by cost', () => {
    const costs = getAllShippingCosts(1000, 0);
    expect(costs).toHaveLength(COURIERS.length);
    for (let i = 1; i < costs.length; i++) {
      expect(costs[i].cost).toBeGreaterThanOrEqual(costs[i - 1].cost);
    }
  });
});

describe('formatAddress', () => {
  it('formats address with all fields', () => {
    const result = formatAddress({
      name: 'John Doe',
      phone: '08123456789',
      street: 'Jl. Merdeka No. 1',
      city: 'Jakarta',
      province: 'DKI Jakarta',
      postalCode: '12345',
      label: 'Rumah',
    });
    expect(result).toContain('📍 Rumah');
    expect(result).toContain('John Doe');
    expect(result).toContain('Jl. Merdeka');
    expect(result).toContain('Jakarta, DKI Jakarta 12345');
    expect(result).toContain('Telp: 08123456789');
  });
});
