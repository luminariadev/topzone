// src/utils/shipping.ts
// Ongkos kirim calculator untuk kurir Indonesia (JNE, J&T, SiCepat, Gosend)

export interface Courier {
  code: string;
  name: string;
  icon: string;
  etd: string; // estimasi
}

export const COURIERS: Courier[] = [
  { code: 'jne', name: 'JNE',   icon: '📦', etd: '2–3 hari' },
  { code: 'jnt', name: 'J&T',   icon: '📦', etd: '2–3 hari' },
  { code: 'sicepat', name: 'SiCepat', icon: '⚡', etd: '1–2 hari' },
  { code: 'gosend',  name: 'GoSend',  icon: '🛵', etd: 'Same day' },
];

export interface ShippingCost {
  courier: string;
  cost: number;
  etd: string;
  note?: string;
}

// Weight in grams
const RATES: Record<string, { reg: number; next?: number }> = {
  jne:     { reg: 12000,  next: 25000 },
  jnt:     { reg: 10000,  next: 22000 },
  sicepat: { reg: 14000,  next: 30000 },
  gosend:  { reg: 18000 },
};

// Gratis ongkir threshold
const FREE_SHIPPING_THRESHOLD = 200_000; // Rp200k

/**
 * Hitung ongkos kirim berdasarkan kurir, berat, dan total belanja.
 * Berat in gram, minimal 1000g.
 */
export function calculateShipping(
  courierCode: string,
  weightGrams: number,
  totalBelanja: number
): ShippingCost | null {
  const rate = RATES[courierCode];
  if (!rate) return null;

  const w = Math.max(weightGrams, 1000);
  const multiplier = Math.ceil(w / 1000);
  const baseCost = rate.reg * multiplier;

  // Gratis ongkir jika belanja di atas threshold
  if (totalBelanja >= FREE_SHIPPING_THRESHOLD) {
    return {
      courier: courierCode,
      cost: 0,
      etd: COURIERS.find(c => c.code === courierCode)?.etd || '',
      note: 'Gratis ongkir 🎉',
    };
  }

  return {
    courier: courierCode,
    cost: baseCost,
    etd: COURIERS.find(c => c.code === courierCode)?.etd || '',
  };
}

/**
 * Dapatkan semua biaya pengiriman untuk semua kurir.
 */
export function getAllShippingCosts(
  weightGrams: number,
  totalBelanja: number
): ShippingCost[] {
  return COURIERS
    .map(c => calculateShipping(c.code, weightGrams, totalBelanja))
    .filter((s): s is ShippingCost => s !== null)
    .sort((a, b) => a.cost - b.cost);
}

/**
 * Format alamat untuk tampilan.
 */
export function formatAddress(addr: {
  label?: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  province?: string;
  postalCode?: string;
  isDefault?: boolean;
}): string {
  const parts = [
    addr.label ? `📍 ${addr.label}` : '',
    addr.name,
    addr.street,
    `${addr.city}${addr.province ? ', ' + addr.province : ''}${addr.postalCode ? ' ' + addr.postalCode : ''}`,
    `Telp: ${addr.phone}`,
  ].filter(Boolean);
  return parts.join('\n');
}
