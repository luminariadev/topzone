// src/lib/api-cache.ts
// Lightweight API response caching with TTL support
// Uses in-memory Map with configurable TTL per endpoint
// Thread-safe by design — no mutable shared state between requests

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // TTL in milliseconds
}

interface CacheConfig {
  defaultTTL: number; // Default TTL in milliseconds (5 minutes)
  maxEntries: number; // Max entries before eviction
  debug: boolean;
}

type CacheKey = string;

const DEFAULT_CONFIG: CacheConfig = {
  defaultTTL: 5 * 60 * 1000, // 5 minutes
  maxEntries: 100,
  debug: false,
};

class ApiCache {
  private cache: Map<CacheKey, CacheEntry<unknown>>;
  private config: CacheConfig;
  private hits = 0;
  private misses = 0;

  constructor(config: Partial<CacheConfig> = {}) {
    this.cache = new Map();
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Get a value from cache. Returns null if not found or expired.
   * @param key - Cache key
   * @returns Cached value or null
   */
  get<T>(key: CacheKey): T | null {
    const entry = this.cache.get(key);
    if (!entry) {
      this.misses++;
      return null;
    }

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      // Expired — clean up
      this.cache.delete(key);
      this.misses++;
      if (this.config.debug) {
        console.log(`[Cache] MISS (expired): ${key}`);
      }
      return null;
    }

    this.hits++;
    if (this.config.debug) {
      console.log(`[Cache] HIT: ${key} (age: ${((now - entry.timestamp) / 1000).toFixed(1)}s)`);
    }
    return entry.data as T;
  }

  /**
   * Set a value in cache with optional custom TTL.
   * Automatically evicts oldest entry if at capacity.
   * @param key - Cache key
   * @param data - Data to cache
   * @param ttl - Custom TTL in milliseconds (uses default if omitted)
   */
  set<T>(key: CacheKey, data: T, ttl?: number): void {
    // Evict oldest entry if at capacity
    if (this.cache.size >= this.config.maxEntries) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
        if (this.config.debug) {
          console.log(`[Cache] EVICT: ${oldestKey} (cache full)`);
        }
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl ?? this.config.defaultTTL,
    });
  }

  /**
   * Check if a key exists in cache and is not expired.
   * @param key - Cache key to check
   */
  has(key: CacheKey): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }
    return true;
  }

  /**
   * Delete a key from cache.
   * @param key - Cache key to remove
   */
  delete(key: CacheKey): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear entire cache.
   */
  clear(): void {
    this.cache.clear();
    if (this.config.debug) {
      console.log('[Cache] CLEAR: All entries evicted');
    }
  }

  /**
   * Invalidate all cache entries matching a pattern.
   * @param pattern - RegExp to match against cache keys
   * @returns Number of invalidated entries
   */
  invalidatePattern(pattern: RegExp): number {
    let count = 0;
    for (const key of this.cache.keys()) {
      if (pattern.test(key)) {
        this.cache.delete(key);
        count++;
      }
    }
    if (this.config.debug && count > 0) {
      console.log(`[Cache] INVALIDATE: ${count} entries matching ${pattern}`);
    }
    return count;
  }

  /**
   * Get cache statistics.
   */
  stats(): { size: number; hits: number; misses: number; hitRate: string; maxEntries: number } {
    const total = this.hits + this.misses;
    return {
      size: this.cache.size,
      hits: this.hits,
      misses: this.misses,
      hitRate: total > 0 ? `${((this.hits / total) * 100).toFixed(1)}%` : '0%',
      maxEntries: this.config.maxEntries,
    };
  }

  /**
   * Convenience: fetch with cache. If cached, return cached data.
   * If not, call fetcher, cache the result, and return it.
   * @param key - Cache key
   * @param fetcher - Async function to produce data on cache miss
   * @param ttl - Optional custom TTL
   */
  async fetch<T>(key: CacheKey, fetcher: () => Promise<T>, ttl?: number): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const data = await fetcher();
    this.set(key, data, ttl);
    return data;
  }

  /**
   * Get all current cache keys (for debugging / admin panels).
   */
  keys(): string[] {
    return Array.from(this.cache.keys());
  }
}

// Singleton instance for server-side caching
export const apiCache = new ApiCache({
  defaultTTL: 5 * 60 * 1000,
  maxEntries: 200,
});

// Invalidate caches when data changes
export function invalidateProductCache(slug?: string): void {
  if (slug) {
    apiCache.invalidatePattern(new RegExp(`products:${slug}`));
    apiCache.invalidatePattern(new RegExp(`reviews:${slug}`));
  } else {
    apiCache.invalidatePattern(/products:/);
    apiCache.invalidatePattern(/reviews:/);
  }
}

export default ApiCache;