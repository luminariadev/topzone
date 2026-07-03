// src/types/index.ts
// Centralized TypeScript type definitions for TopZone

/**
 * User authentication types
 */
export interface AppUser {
  email: string;
  full_name?: string;
  isLoggedIn: boolean;
}

/**
 * Game and Game Package types
 */
export interface GamePackage {
  id: string;
  label: string;
  price: number;
  /** Available stock (null = unlimited) */
  stock?: number | null;
}

export type GameCategory = 'mobile' | 'pc' | 'console';

export type ProductStatus = 'draft' | 'published' | 'archived';

export interface Game {
  slug: string;
  name: string;
  img: string;
  color: string;
  badge: string;
  category: GameCategory;
  currency: string;
  description: string;
  packages: GamePackage[];
  /** SEO meta title (falls back to name if omitted) */
  metaTitle?: string;
  /** SEO meta description (falls back to description if omitted) */
  metaDescription?: string;
  /** Display/priority order (lower = first) */
  priority?: number;
  /** Content status */
  status?: ProductStatus;
}

/**
 * Gear types
 */
export interface GearSpec {
  label: string;
  value: string;
}

export type GearCategory = 'keyboard' | 'mouse' | 'headset' | 'monitor' | 'chair' | 'controller' | 'webcam' | 'microphone' | 'mousepad' | 'speaker' | 'streaming';

export interface Gear {
  slug: string;
  name: string;
  img: string;
  price: number;
  tag: string;
  category: GearCategory;
  description: string;
  specs: GearSpec[];
  /** SEO meta title (falls back to name if omitted) */
  metaTitle?: string;
  /** SEO meta description (falls back to description if omitted) */
  metaDescription?: string;
  /** Display/priority order (lower = first) */
  priority?: number;
  /** Content status */
  status?: ProductStatus;
  /** Brand for filtering */
  brand?: string;
}

/**
 * Cart types
 */
export interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  img: string;
  type: 'game' | 'gear';
}

/**
 * Order types
 */
export interface OrderItem {
  id?: string;
  product_id?: string;
  product_name: string;
  product_price: number;
  quantity: number;
  type: 'game' | 'gear';
}

export interface Order {
  id: string;
  name: string;
  email: string;
  phone: string;
  payment: 'bank' | 'ewallet' | 'gopay';
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt?: string;
}

/**
 * Review types
 */
export interface Review {
  id: string;
  productSlug: string;
  rating: number; // 1-5
  comment: string;
  userName: string;
  userEmail: string;
  createdAt: string;
}

/**
 * Voucher types
 */
export interface Voucher {
  code: string;
  discount: number; // percentage (e.g., 10 for 10%)
  used: boolean;
  createdAt: string;
}

/**
 * Admin session types
 */
export interface AdminSession {
  token: string;
  expiresAt: number; // timestamp
  failedAttempts: number;
  lockedUntil?: number;
}

/**
 * Admin product types (stored in localStorage)
 */
export interface AdminGame {
  id?: string;
  slug: string;
  name: string;
  img: string;
  color: string;
  badge: string;
  category: GameCategory;
  currency: string;
  description: string;
  packages: GamePackage[];
  metaTitle?: string;
  metaDescription?: string;
  priority?: number;
  status?: ProductStatus;
}

export interface AdminGear {
  id?: string;
  slug: string;
  name: string;
  img: string;
  price: number;
  tag: string;
  category: GearCategory;
  description: string;
  specs: GearSpec[];
  metaTitle?: string;
  metaDescription?: string;
  priority?: number;
  status?: ProductStatus;
  brand?: string;
}

/**
 * Product union type for filtering/searching
 */
export type Product = Game | Gear;

/**
 * Filter options for products
 */
export interface ProductFilters {
  category?: string;
  searchQuery?: string;
  sortBy?: 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'newest';
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: 'draft' | 'published' | 'archived';
}

/**
 * Toast notification types
 */
export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastOptions {
  message: string;
  type: ToastType;
  duration?: number; // milliseconds
}

/**
 * Breadcrumb item type
 */
export interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrent?: boolean;
}

// ─── Utility types ────────────────────────────────────────────────

/** Make specific properties of T required (opposite of Partial) */
export type RequiredProps<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/** Make specific properties of T optional */
export type OptionalProps<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/** At least one of the keys K must be present */
export type AtLeastOne<T, K extends keyof T = keyof T> = Partial<T> & { [P in K]-?: T[P] };

/** Pick properties that match a value type */
export type PickByType<T, V> = { [K in keyof T as T[K] extends V ? K : never]: T[K] };

/** Non-empty array */
export type NonEmptyArray<T> = [T, ...T[]];

/** Strict literal union for payment methods */
export type PaymentMethod = 'bank' | 'ewallet' | 'gopay';

/** Order status with strict transitions */
export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

/** Sort options available for product listings */
export type SortOption = 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'newest';

/** Typed asynchronous operation state (discriminated union) */
export type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };