// src/pages/api/user/points.ts
// User points API — returns points balance, tier info, history, and birthday bonus eligibility

import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  try {
    // Check auth
    const { supabase } = await import('../../../lib/supabase');

    // Get user from auth header or cookie
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({
        points_balance: 0,
        lifetime_points: 0,
        tier_level: 'bronze',
        tier_discount: 0,
        next_tier: 'silver',
        points_needed: 5000,
        next_tier_min: 5000,
        history: [],
        birthday_bonus: null,
      }), { status: 200, headers: corsHeaders });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase!.auth.getUser(token);

    if (authError || !user) {
      // Return defaults for unauthenticated
      return new Response(JSON.stringify({
        error: 'Not authenticated',
        points_balance: 0,
        lifetime_points: 0,
        tier_level: 'bronze',
      }), { status: 401, headers: corsHeaders });
    }

    const userId = user.id;

    // Get or create user points record
    const { data: points } = await supabase!
      .from('user_points')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!points) {
      return new Response(JSON.stringify({
        points_balance: 0,
        lifetime_points: 0,
        tier_level: 'bronze',
        tier_discount: 0,
        next_tier: 'silver',
        points_needed: 5000,
        next_tier_min: 5000,
        history: [],
        birthday_bonus: null,
      }), { status: 200, headers: corsHeaders });
    }

    // Get tier discount
    const { data: tierData } = await supabase!
      .from('loyalty_tiers')
      .select('discount_percent, min_lifetime_points')
      .eq('name', points.tier_level)
      .single();

    // Calculate next tier
    const tiers = ['bronze', 'silver', 'gold', 'platinum'];
    const currentIdx = tiers.indexOf(points.tier_level);
    let nextTier = null;
    let pointsNeeded = 0;
    let nextTierMin = 0;

    if (currentIdx < tiers.length - 1) {
      nextTier = tiers[currentIdx + 1];
      const { data: nextData } = await supabase!
        .from('loyalty_tiers')
        .select('min_lifetime_points')
        .eq('name', nextTier)
        .single();
      if (nextData) {
        nextTierMin = nextData.min_lifetime_points;
        pointsNeeded = Math.max(0, nextData.min_lifetime_points - points.lifetime_points);
      }
    }

    // Get points history
    const { data: history } = await supabase!
      .from('points_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);

    // Check birthday bonus eligibility
    const today = new Date();
    const year = today.getFullYear();
    const { data: birthdayRecord } = await supabase!
      .from('birthday_bonus')
      .select('*')
      .eq('user_id', userId)
      .eq('bonus_year', year)
      .single();

    let birthdayBonus = null;
    if (!birthdayRecord && user.user_metadata?.birth_date) {
      const bday = new Date(user.user_metadata.birth_date);
      const todayMD = today.getMonth() * 100 + today.getDate();
      const bdayMD = bday.getMonth() * 100 + bday.getDate();
      const isBirthday = Math.abs(todayMD - bdayMD) <= 3 || Math.abs(todayMD - bdayMD) >= 360;

      if (isBirthday) {
        const multipliers: Record<string, number> = { bronze: 1, silver: 2, gold: 3, platinum: 5 };
        const multiplier = multipliers[points.tier_level] || 1;
        const bonusBase = 100;
        const bonusPoints = bonusBase * multiplier;

        birthdayBonus = {
          eligible: true,
          amount: bonusPoints,
          multiplier,
          tier: points.tier_level,
          message: `🎂 Happy Birthday! Kamu mendapat ${bonusPoints} bonus points (${multiplier}x multiplier)`,
        };
      }
    }

    return new Response(JSON.stringify({
      points_balance: points.points_balance,
      lifetime_points: points.lifetime_points,
      tier_level: points.tier_level,
      tier_discount: tierData?.discount_percent || 0,
      next_tier: nextTier,
      points_needed: pointsNeeded,
      next_tier_min: nextTierMin,
      history: history || [],
      birthday_bonus: birthdayBonus,
    }), { status: 200, headers: corsHeaders });
  } catch (err) {
    console.error('[points] API error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500, headers: corsHeaders,
    });
  }
};

export const OPTIONS: APIRoute = () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};