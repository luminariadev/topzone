// src/lib/idempotency.ts
// Idempotency middleware for API routes — prevents duplicate webhook/order processing

import type { SupabaseClient } from '@supabase/supabase-js';

export interface IdempotencyRecord {
  key: string;
  response: Record<string, unknown>;
  status: number;
  created_at: string;
  expires_at: string;
}

const DEFAULT_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Generate an idempotency key from request data
 */
export function generateIdempotencyKey(
  prefix: string,
  ...parts: (string | number)[]
): string {
  return `${prefix}_${parts.join('_')}`;
}

/**
 * Check if a request with this idempotency key has already been processed
 */
export async function hasBeenProcessed(
  supabase: SupabaseClient,
  key: string
): Promise<IdempotencyRecord | null> {
  try {
    const { data, error } = await supabase!
      .from('idempotency_keys')
      .select('*')
      .eq('key', key)
      .gte('expires_at', new Date().toISOString())
      .single();

    if (error || !data) return null;
    return data as unknown as IdempotencyRecord;
  } catch {
    return null;
  }
}

/**
 * Mark a request as processed with an idempotency key
 */
export async function markProcessed(
  supabase: SupabaseClient,
  key: string,
  response: Record<string, unknown>,
  status: number = 200,
  ttlMs: number = DEFAULT_TTL_MS
): Promise<boolean> {
  try {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + ttlMs);

    const { error } = await supabase!.from('idempotency_keys').upsert({
      key,
      response,
      status,
      created_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
    }, { onConflict: 'key' });

    return !error;
  } catch {
    return false;
  }
}

/**
 * Cleanup expired idempotency keys (call from cron job)
 */
export async function cleanupExpiredKeys(
  supabase: SupabaseClient
): Promise<number> {
  try {
    const { data, error } = await supabase!
      .from('idempotency_keys')
      .delete()
      .lt('expires_at', new Date().toISOString())
      .select('count');

    if (error) return 0;
    return (data as unknown as { count: number }[])?.reduce((sum, r) => sum + r.count, 0) || 0;
  } catch {
    return 0;
  }
}

/**
 * Wrap an API handler with idempotency check
 */
export function withIdempotency<T>(
  handler: () => Promise<{ data: T; status: number }>,
  supabase: SupabaseClient,
  key: string,
  ttlMs?: number
): Promise<{ data: T | Record<string, unknown>; status: number }> {
  return hasBeenProcessed(supabase, key).then(async (existing) => {
    if (existing) {
      return {
        data: existing.response as T,
        status: existing.status,
      };
    }

    const result = await handler();
    await markProcessed(supabase, key, result.data as Record<string, unknown>, result.status, ttlMs);
    return result;
  });
}