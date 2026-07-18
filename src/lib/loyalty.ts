// src/lib/loyalty.ts
// Points, loyalty tier, and referral system utilities

import type { SupabaseClient } from '@supabase/supabase-js';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LoyaltyTier {
  name: 'bronze' | 'silver' | 'gold' | 'platinum';
  min_lifetime_points: number;
  discount_percent: number;
  priority_access: boolean;
  free_shipping: boolean;
  birthday_bonus_multiplier: number;
  badge_icon: string;
}

export interface UserPoints {
  id: string;
  user_id: string;
  points_balance: number;
  lifetime_points: number;
  tier_level: LoyaltyTier['name'];
  created_at: string;
  updated_at: string;
}

export interface PointsHistory {
  id: string;
  user_id: string;
  points: number;
  reason: 'earn' | 'spend' | 'expire' | 'bonus' | 'adjust';
  reference_type?: string;
  reference_id?: string;
  description?: string;
  created_at: string;
}

export interface Referral {
  id: string;
  referrer_id: string;
  referred_email?: string;
  referred_id?: string;
  referral_code: string;
  status: 'pending' | 'registered' | 'completed' | 'expired';
  reward_points: number;
  reward_claimed: boolean;
  created_at: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const TIER_ORDER: LoyaltyTier['name'][] = ['bronze', 'silver', 'gold', 'platinum'];
const REFERRAL_REWARD_POINTS = 500; // Points given to referrer when referral completes

/**
 * Determine which tier level a user should be on based on lifetime points
 */
export function calculateTier(lifetimePoints: number): LoyaltyTier['name'] {
  if (lifetimePoints >= 50000) return 'platinum';
  if (lifetimePoints >= 20000) return 'gold';
  if (lifetimePoints >= 5000) return 'silver';
  return 'bronze';
}

/**
 * Get tier badge emoji
 */
export function getTierBadge(tier: LoyaltyTier['name']): string {
  const badges: Record<LoyaltyTier['name'], string> = {
    bronze: '🥉',
    silver: '🥈',
    gold: '🥇',
    platinum: '💎',
  };
  return badges[tier];
}

/**
 * Get discount percentage for a tier
 */
export function getTierDiscount(tier: LoyaltyTier['name']): number {
  const discounts: Record<LoyaltyTier['name'], number> = {
    bronze: 0,
    silver: 3,
    gold: 5,
    platinum: 10,
  };
  return discounts[tier];
}

/**
 * Points earning rate: 1 point per Rp 1,000 spent
 */
export function calculateEarnedPoints(orderTotal: number): number {
  return Math.floor(orderTotal / 1000);
}

/**
 * Apply points as discount at checkout (1 point = Rp 1)
 */
export function calculatePointsDiscount(pointsToUse: number): number {
  return pointsToUse; // 1 point = Rp 1 discount
}

/**
 * Generate a unique referral code (8-char alphanumeric, uppercase)
 */
export function generateReferralCode(userId: string, userEmail: string): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const seed = (userId + userEmail).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars[(seed * (i + 1) * 31) % chars.length];
  }
  return 'TZ-' + code;
}

// ─── Supabase Operations ───────────────────────────────────────────────────────

export async function getOrCreateUserPoints(
  supabase: SupabaseClient,
  userId: string
): Promise<UserPoints | null> {
  // Try to get existing
  const { data: existing } = await supabase
    .from('user_points')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (existing) return existing;

  // Create new record
  const { data: created, error } = await supabase
    .from('user_points')
    .insert({ user_id: userId, points_balance: 0, lifetime_points: 0, tier_level: 'bronze' })
    .select()
    .single();

  if (error) {
    console.error('[loyalty] getOrCreateUserPoints error:', error);
    return null;
  }
  return created;
}

export async function earnPoints(
  supabase: SupabaseClient,
  userId: string,
  orderId: string,
  orderTotal: number
): Promise<boolean> {
  const earned = calculateEarnedPoints(orderTotal);
  if (earned <= 0) return false;

  const { data: existing } = await supabase
    .from('user_points')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (!existing) return false;

  const newBalance = existing.points_balance + earned;
  const newLifetime = existing.lifetime_points + earned;
  const newTier = calculateTier(newLifetime);

  const { error } = await supabase
    .from('user_points')
    .update({
      points_balance: newBalance,
      lifetime_points: newLifetime,
      tier_level: newTier,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId);

  if (error) {
    console.error('[loyalty] earnPoints update error:', error);
    return false;
  }

  // Log history
  await supabase.from('points_history').insert({
    user_id: userId,
    points: earned,
    reason: 'earn',
    reference_type: 'order',
    reference_id: orderId,
    description: `Earned from order #${orderId} (Rp ${orderTotal.toLocaleString('id-ID')})`,
  });

  return true;
}

export async function spendPoints(
  supabase: SupabaseClient,
  userId: string,
  points: number,
  description: string
): Promise<boolean> {
  const { data: existing } = await supabase
    .from('user_points')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (!existing || existing.points_balance < points) return false;

  const { error } = await supabase
    .from('user_points')
    .update({
      points_balance: existing.points_balance - points,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId);

  if (error) {
    console.error('[loyalty] spendPoints error:', error);
    return false;
  }

  await supabase.from('points_history').insert({
    user_id: userId,
    points: -points,
    reason: 'spend',
    description,
  });

  return true;
}

export async function awardBirthdayBonus(
  supabase: SupabaseClient,
  userId: string,
  birthDate: string
): Promise<boolean> {
  const year = new Date().getFullYear();
  const userBirthDate = new Date(birthDate);
  const today = new Date();

  // Check if birthday is today (±3 days for flexibility)
  const birthMonth = userBirthDate.getMonth();
  const birthDay = userBirthDate.getDate();
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();

  const isBirthday =
    birthMonth === currentMonth &&
    Math.abs(birthDay - currentDay) <= 3;

  if (!isBirthday) return false;

  // Check if already claimed this year
  const { data: existing } = await supabase
    .from('birthday_bonus')
    .select('*')
    .eq('user_id', userId)
    .eq('bonus_year', year)
    .single();

  if (existing?.claimed) return false;

  // Get user tier for multiplier
  const { data: userPoints } = await supabase
    .from('user_points')
    .select('tier_level, points_balance')
    .eq('user_id', userId)
    .single();

  const multiplier = getTierMultiplier(userPoints?.tier_level as LoyaltyTier['name'] || 'bronze');
  const bonusPoints = 100 * multiplier; // Base 100 points × multiplier

  // Award bonus
  if (userPoints) {
    await supabase
      .from('user_points')
      .update({
        points_balance: userPoints.points_balance + bonusPoints,
        lifetime_points: userPoints.points_balance + bonusPoints,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);
  }

  // Log
  await supabase.from('birthday_bonus').upsert({
    user_id: userId,
    birth_date: birthDate,
    bonus_year: year,
    points_awarded: bonusPoints,
    claimed: true,
    claimed_at: new Date().toISOString(),
  }, { onConflict: 'user_id,bonus_year' });

  await supabase.from('points_history').insert({
    user_id: userId,
    points: bonusPoints,
    reason: 'bonus',
    reference_type: 'birthday',
    description: `Birthday bonus (${multiplier}x multiplier for ${userPoints?.tier_level || 'bronze'} tier)`,
  });

  return true;
}

function getTierMultiplier(tier: LoyaltyTier['name']): number {
  const m: Record<LoyaltyTier['name'], number> = {
    bronze: 1, silver: 2, gold: 3, platinum: 5,
  };
  return m[tier];
}

/**
 * Get next tier info with points needed
 */
export async function getNextTierInfo(
  supabase: SupabaseClient,
  userId: string
): Promise<{ nextTier: LoyaltyTier['name'] | null; pointsNeeded: number } | null> {
  const { data } = await supabase
    .from('user_points')
    .select('lifetime_points, tier_level')
    .eq('user_id', userId)
    .single();

  if (!data) return null;

  const currentIndex = TIER_ORDER.indexOf(data.tier_level as LoyaltyTier['name']);
  if (currentIndex >= TIER_ORDER.length - 1) return { nextTier: null, pointsNeeded: 0 };

  const nextTier = TIER_ORDER[currentIndex + 1];
  const { data: tierData } = await supabase
    .from('loyalty_tiers')
    .select('min_lifetime_points')
    .eq('name', nextTier)
    .single();

  const pointsNeeded = tierData ? tierData.min_lifetime_points - data.lifetime_points : 0;
  return { nextTier, pointsNeeded: Math.max(0, pointsNeeded) };
}

/**
 * Check if user qualifies for tier upgrade notification
 */
export async function checkTierUpgrade(
  supabase: SupabaseClient,
  userId: string
): Promise<{ upgraded: boolean; newTier: LoyaltyTier['name'] } | null> {
  const { data: before } = await supabase
    .from('user_points')
    .select('tier_level, lifetime_points')
    .eq('user_id', userId)
    .single();

  if (!before) return null;

  const newTier = calculateTier(before.lifetime_points);
  if (newTier === before.tier_level) return null;

  return { upgraded: true, newTier };
}