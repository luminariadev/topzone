// src/pages/api/cron/check-birthdays.ts
// Called daily by cron job to auto-check and award birthday bonuses
// Users with unclaimed birthday bonus in current month get awarded

import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.SUPABASE_URL || import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.SUPABASE_SERVICE_ROLE_KEY || import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
);

export const GET: APIRoute = async () => {
  // Secret key check (simple cron auth)
  const cronKey = import.meta.env.CRON_SECRET || 'topzone-daily-cron';
  if (cronKey !== import.meta.env.CRON_SECRET && !import.meta.env.DEV) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // JS months are 0-indexed

  // Find users whose birthday is this month and haven't claimed this year
  const { data: users, error: findErr } = await supabase
    .from('profiles')
    .select('id, email, birth_date')
    .not('birth_date', 'is', null);

  if (findErr) {
    return new Response(JSON.stringify({ error: 'Gagal cek birthday' }), { status: 500 });
  }

  let awarded = 0;
  let errors = 0;

  for (const user of users) {
    const birthMonth = new Date(user.birth_date).getMonth() + 1;
    if (birthMonth !== currentMonth) continue;

    // Check if already claimed this year
    const { data: existing } = await supabase
      .from('birthday_bonus')
      .select('id')
      .eq('user_id', user.id)
      .eq('bonus_year', currentYear)
      .single();

    if (existing) continue;

    // Calculate bonus (higher for higher tiers)
    const { data: points } = await supabase
      .from('user_points')
      .select('tier_level')
      .eq('user_id', user.id)
      .single();

    const tierMultiplier: Record<string, number> = {
      bronze: 1, silver: 2, gold: 3, platinum: 5,
    };
    const basePoints = 100;
    const multiplier = tierMultiplier[points?.tier_level || 'bronze'] || 1;
    const bonusPoints = basePoints * multiplier;

    // Award bonus
    const { error: insertErr } = await supabase
      .from('birthday_bonus')
      .insert({
        user_id: user.id,
        birth_date: user.birth_date,
        bonus_year: currentYear,
        points_awarded: bonusPoints,
        claimed: true,
        claimed_at: now.toISOString(),
      });

    if (insertErr) { errors++; continue; }

    // Add points
    await supabase.rpc('upsert_user_points', {
      p_user_id: user.id,
      p_delta: bonusPoints,
    }).catch(() => {
      supabase.from('user_points').upsert({
        user_id: user.id,
        points_balance: bonusPoints,
        lifetime_points: bonusPoints,
      }, { onConflict: 'user_id' });
    });

    // Log history
    await supabase.from('points_history').insert({
      user_id: user.id,
      points: bonusPoints,
      reason: 'bonus',
      reference_type: 'birthday',
      description: `Birthday bonus ${currentYear} — ${multiplier}x multiplier (tier: ${points?.tier_level || 'bronze'})`,
    });

    awarded++;
  }

  return new Response(JSON.stringify({
    success: true,
    checked: users.length,
    awarded,
    errors,
    message: `Awarded ${awarded} birthday bonuses this cycle`,
  }), { status: 200 });
};