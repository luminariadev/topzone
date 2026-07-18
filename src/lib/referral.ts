// src/lib/referral.ts
// Referral tracking utilities and Supabase operations

import type { SupabaseClient } from '@supabase/supabase-js';

const REFERRAL_REWARD_POINTS = 500;

/**
 * Generate a unique 8-character referral code for a user
 */
export function generateReferralCode(userId: string, email: string): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let hash = 0;
  for (let i = 0; i < (userId + email).length; i++) {
    hash = ((hash << 5) - hash) + (userId + email).charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }
  const seed = Math.abs(hash);
  let code = 'TZ-';
  for (let i = 0; i < 6; i++) {
    code += chars[(seed * (i + 1) * 31) % chars.length];
  }
  return code;
}

/**
 * Create a referral record when a new user signs up using a referral code
 */
export async function trackReferral(
  supabase: SupabaseClient,
  referralCode: string,
  newUserId: string,
  newUserEmail: string
): Promise<{ success: boolean; message: string }> {
  if (!referralCode || referralCode === 'TZ-') {
    return { success: false, message: 'Invalid referral code' };
  }

  try {
    // Find the referrer by referral code
    const { data: existingReferral, error: findError } = await supabase
      .from('referrals')
      .select('id, referrer_id')
      .eq('referral_code', referralCode)
      .eq('status', 'pending')
      .single();

    if (findError || !existingReferral) {
      return { success: false, message: 'Referral code not found or already used' };
    }

    // Don't allow self-referral
    if (existingReferral.referrer_id === newUserId) {
      return { success: false, message: 'Cannot refer yourself' };
    }

    // Update the referral record
    const { error: updateError } = await supabase
      .from('referrals')
      .update({
        referred_id: newUserId,
        referred_email: newUserEmail,
        status: 'completed',
        reward_points: REFERRAL_REWARD_POINTS,
        completed_at: new Date().toISOString(),
      })
      .eq('id', existingReferral.id);

    if (updateError) {
      console.error('[referral] Update error:', updateError);
      return { success: false, message: 'Failed to update referral' };
    }

    // Award points to referrer
    const { data: referrerPoints } = await supabase
      .from('user_points')
      .select('points_balance, lifetime_points')
      .eq('user_id', existingReferral.referrer_id)
      .single();

    if (referrerPoints) {
      await supabase
        .from('user_points')
        .update({
          points_balance: referrerPoints.points_balance + REFERRAL_REWARD_POINTS,
          lifetime_points: referrerPoints.lifetime_points + REFERRAL_REWARD_POINTS,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', existingReferral.referrer_id);

      await supabase.from('points_history').insert({
        user_id: existingReferral.referrer_id,
        points: REFERRAL_REWARD_POINTS,
        reason: 'earn',
        reference_type: 'referral',
        reference_id: existingReferral.id,
        description: `Referral reward — ${newUserEmail} registered using your code`,
      });
    }

    // Mark reward as claimed
    await supabase
      .from('referrals')
      .update({ reward_claimed: true })
      .eq('id', existingReferral.id);

    return { success: true, message: `Referral tracked! You earned ${REFERRAL_REWARD_POINTS} points.` };
  } catch (err) {
    console.error('[referral] Error:', err);
    return { success: false, message: 'Internal error processing referral' };
  }
}

/**
 * Create a new referral link for a user
 */
export async function createReferralLink(
  supabase: SupabaseClient,
  userId: string,
  email: string
): Promise<string | null> {
  const code = generateReferralCode(userId, email);

  const { error } = await supabase.from('referrals').insert({
    referrer_id: userId,
    referral_code: code,
    referred_email: null,
    status: 'pending',
  });

  if (error) {
    console.error('[referral] Create error:', error);
    return null;
  }

  return code;
}

/**
 * Get referral statistics for a user
 */
export async function getReferralStats(
  supabase: SupabaseClient,
  userId: string
): Promise<{
  totalReferrals: number;
  completedReferrals: number;
  pendingReferrals: number;
  totalRewards: number;
  referralCode: string | null;
}> {
  const { data: referrals, error } = await supabase
    .from('referrals')
    .select('status, reward_points, reward_claimed')
    .eq('referrer_id', userId);

  if (error) {
    console.error('[referral] Stats error:', error);
    return { totalReferrals: 0, completedReferrals: 0, pendingReferrals: 0, totalRewards: 0, referralCode: null };
  }

  const code = referrals?.[0]?.referral_code || null;

  return {
    totalReferrals: referrals?.length || 0,
    completedReferrals: referrals?.filter(r => r.status === 'completed').length || 0,
    pendingReferrals: referrals?.filter(r => r.status === 'pending').length || 0,
    totalRewards: referrals?.reduce((sum, r) => sum + (r.reward_claimed ? r.reward_points : 0), 0) || 0,
    referralCode: code,
  };
}

/**
 * Get the referral code for a user (creates one if doesn't exist)
 */
export async function getOrCreateReferralCode(
  supabase: SupabaseClient,
  userId: string,
  email: string
): Promise<string | null> {
  const { data: existing } = await supabase
    .from('referrals')
    .select('referral_code')
    .eq('referrer_id', userId)
    .limit(1);

  if (existing && existing.length > 0) {
    return existing[0].referral_code;
  }

  return createReferralLink(supabase, userId, email);
}