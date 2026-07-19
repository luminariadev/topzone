// src/lib/shipping-rates.ts
// Shipping cost estimation — supports multiple couriers and zones in Indonesia

export interface ShippingZone {
  id: string;
  name: string;
  type: 'same_day' | 'next_day' | 'regular' | 'cargo';
}

export interface ShippingRate {
  courier: string;
  service: string;
  description: string;
  price: number;
  estimatedDays: string;
  estimatedWeight: string;
}

export interface AddressZone {
  province: string;
  city: string;
  zone: ShippingZone['type'];
}

// Supported couriers with their service tiers
export const COURIERS = [
  {
    id: 'jne',
    name: 'JNE',
    services: [
      { id: 'jne-reg', name: 'Reg', description: 'Regular (3-5 hari)', days: '3-5 hari' },
      { id: 'jne-oke', name: 'OKE', description: 'Economy (5-7 hari)', days: '5-7 hari' },
      { id: 'jne-yes', name: 'YES', description: 'Yakin Esok Sampai (1 hari)', days: '1 hari' },
    ],
  },
  {
    id: 'jnt',
    name: 'J&T Express',
    services: [
      { id: 'jnt-economy', name: 'Economy', description: 'Economy (4-6 hari)', days: '4-6 hari' },
      { id: 'jnt-standard', name: 'Standard', description: 'Standard (2-3 hari)', days: '2-3 hari' },
    ],
  },
  {
    id: 'sicepat',
    name: 'SiCepat',
    services: [
      { id: 'sicepat-regular', name: 'Regular', description: 'Regular (2-3 hari)', days: '2-3 hari' },
      { id: 'sicepat-halu', name: 'Halu', description: 'Same Day (1 hari)', days: '1 hari' },
      { id: 'sicepat-bias', name: 'BESOK', description: 'Next Day (1-2 hari)', days: '1-2 hari' },
    ],
  },
  {
    id: 'gosend',
    name: 'GoSend',
    services: [
      { id: 'gosend-instant', name: 'Instant', description: 'Instant delivery (< 2 jam)', days: '< 2 jam' },
      { id: 'gosend-sameday', name: 'Same Day', description: 'Same Day (4-6 jam)', days: '4-6 jam' },
    ],
  },
] as const;

// Base shipping cost estimates (Jakarta-based, tiered by city type)
const BASE_COSTS: Record<string, number> = {
  same_day: 25000,
  next_day: 35000,
  regular: 15000,
  cargo: 12000,
};

// Zone multipliers for different regions
const ZONE_MULTIPLIERS: Record<string, number> = {
  jakarta: 1.0,
  bekasi: 1.1,
  tangerang: 1.1,
  bogor: 1.2,
  karawang: 1.3,
  jabodetabek: 1.2,
  jawa_barat: 1.3,
  jawa_tengah: 1.5,
  jawa_timur: 1.5,
  bali: 1.6,
  yogyakarta: 1.2,
  sumatera: 1.8,
  kalimantan: 2.0,
  sulawesi: 2.5,
  ntt: 2.8,
  papua: 3.5,
  default: 2.0,
};

/**
 * Estimate shipping cost based on courier, destination city/zone, and package dimensions
 */
export function estimateShippingCost(
  courierId: string,
  destinationProvince: string,
  serviceId: string,
  packageWeight: number = 1, // kg
  packageValue: number = 0
): ShippingRate | null {
  const courier = COURIERS.find(c => c.id === courierId);
  if (!courier) return null;

  const service = courier.services.find((s: { id: string }) => s.id === serviceId);
  if (!service) return null;

  // Determine zone from province
  const zoneKey = getZoneKey(destinationProvince);
  const multiplier = ZONE_MULTIPLIERS[zoneKey] || ZONE_MULTIPLIERS.default;

  // Determine base cost from service type
  const zoneType = getZoneTypeFromService(serviceId);
  const baseCost = BASE_COSTS[zoneType] || BASE_COSTS.regular;

  // Calculate final cost with weight and zone
  let cost = baseCost * multiplier * packageWeight;

  // Add insurance fee for high-value items
  if (packageValue > 500000) {
    cost += packageValue * 0.001; // 0.1% insurance
  }

  // Round to nearest 1000
  cost = Math.ceil(cost / 1000) * 1000;

  return {
    courier: courierId,
    service: serviceId,
    description: service.description,
    price: cost,
    estimatedDays: service.days,
    estimatedWeight: `${packageWeight}kg`,
  };
}

/**
 * Get all available shipping options for a destination
 */
export function getShippingOptions(
  destinationProvince: string,
  packageWeight: number = 1,
  packageValue: number = 0
): ShippingRate[] {
  const rates: ShippingRate[] = [];

  for (const courier of COURIERS) {
    for (const service of courier.services) {
      const rate = estimateShippingCost(
        courier.id,
        destinationProvince,
        service.id,
        packageWeight,
        packageValue
      );
      if (rate) rates.push(rate);
    }
  }

  // Sort by price ascending
  return rates.sort((a, b) => a.price - b.price);
}

/**
 * Format shipping cost as Indonesian Rupiah string
 */
export function formatShippingCost(cost: number): string {
  if (cost === 0) return 'GRATIS';
  return 'Rp ' + cost.toLocaleString('id-ID');
}

// Helpers
function getZoneKey(province: string): string {
  const p = province.toLowerCase().trim();
  if (p.includes('jakarta') || p.includes('dki')) return 'jakarta';
  if (p.includes('bekasi')) return 'bekasi';
  if (p.includes('tangerang')) return 'tangerang';
  if (p.includes('bogor')) return 'bogor';
  if (p.includes('karawang')) return 'karawang';
  if (p.includes('jabodetabek')) return 'jabodetabek';
  if (p.includes('jawa barat')) return 'jawa_barat';
  if (p.includes('jawa tengah')) return 'jawa_tengah';
  if (p.includes('jawa timur')) return 'jawa_timur';
  if (p.includes('bali')) return 'bali';
  if (p.includes('yogyakarta') || p.includes('jogja') || p.includes('diy')) return 'yogyakarta';
  if (p.includes('sumatera') || p.includes('sumatra')) return 'sumatera';
  if (p.includes('kalimantan')) return 'kalimantan';
  if (p.includes('sulawesi')) return 'sulawesi';
  if (p.includes('ntt') || p.includes('nusa tenggara')) return 'ntt';
  if (p.includes('papua')) return 'papua';
  return 'default';
}

function getZoneTypeFromService(serviceId: string): string {
  if (serviceId.includes('instant') || serviceId.includes('sameday')) return 'same_day';
  if (serviceId.includes('yes') || serviceId.includes('halal') || serviceId.includes('bias') || serviceId.includes('besok')) return 'next_day';
  return 'regular';
}