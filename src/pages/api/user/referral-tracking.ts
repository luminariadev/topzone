// src/pages/api/user/referral-tracking.ts
// GET  — referral history (referred users, reward status)
// POST — process referral when referred user completes first order

import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY
);

export const GET: APIRoute = async ({ request }) => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const userClient = createClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
    { global: { headers: { Authorization: authHeader } } }
  );

  const { data: { user }, error: authErr } = await userClient.auth.getUser();
  if (authErr || !user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const { data: referrals, error: refErr } = await userClient
    .from('referrals')
    .select('id, referral_code, referred_email, status, reward_points, reward_claimed, created_at, completed_at')
    .eq('referrer_id', user.id)
    .order('created_at', { ascending: false });

  if (refErr) {
    return new Response(JSON.stringify({ error: 'Gagal mengambil history referral' }), { status: 500 });
  }

  const { count: total } = await userClient
    .from('referrals').select('id', { count: 'exact', head: true })
    .eq('referrer_id', user.id);

  const { count: completed } = await userClient
    .from('referrals').select('id', { count: 'exact', head: true })
    .eq('referrer_id', user.id).eq('status', 'completed');

  const { data: pointsRow } = await userClient
    .from('user_points')
    .select('points_balance')
    .eq('user_id', user.id)
    .single();

  return new Response(JSON.stringify({
    referrals: referrals || [],
    summary: {
      total_referrals: total || 0,
      completed_referrals: completed || 0,
      pending_referrals: (total || 0) - (completed || 0),
      total_points_earned: referrals?.reduce((s, r) => s + (r.status === 'completed' ? r.reward_points : 0), 0) || 0,
      available_points: pointsRow?.points_balance || 0,
    },
  }), { status: 200 });
};

// Called internally when a referral registers
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { referred_user_id, referred_email, referral_code } = body;

    if (!referral_code || !referred_user_id) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    // Find the referrer
    const { data: referral, error: findErr } = await supabase
      .from('referrals')
      .select('id, referrer_id, status')
      .eq('referral_code', referral_code)
      .single();

    if (findErr || !referral) {
      return new Response(JSON.stringify({ error: 'Kode referral tidak valid' }), { status: 404 });
    }

    if (referral.status !== 'pending') {
      return new Response(JSON.stringify({ error: 'Referral sudah diproses' }), { status: 400 });
    }

    // Update referral with referred user info
    const { error: updateErr } = await supabase
      .from('referrals')
      .update({
        referred_id: referred_user_id,
        referred_email,
        status: 'registered',
      })
      .eq('id', referral.id);

    if (updateErr) {
      return new Response(JSON.stringify({ error: 'Gagal update referral' }), { status: 500 });
    }

    // Award bonus points to referrer (500 pts for signup)
    await supabase.from('points_history').insert({
      user_id: referral.referrer_id,
      points: 500,
      reason: 'bonus',
      reference_type: 'referral',
      reference_id: referral.id,
      description: 'Bonus pendaftaran referral',
    });

    await supabase.rpc('upsert_user_points', {
      p_user_id: referral.referrer_id,
      p_delta: 500,
    }).catch(() => {
      // Fallback: direct insert
      supabase.from('user_points').upsert({
        user_id: referral.referrer_id,
        points_balance: 500,
        lifetime_points: 500,
      }, { onConflict: 'user_id' }).then(r => {
        if (!r.error) {
          supabase.from('points_history').insert({
            user_id: referral.referrer_id,
            points: 500,
            reason: 'bonus',
            reference_type: 'referral',
            reference_id: referral.id,
            description: 'Bonus pendaftaran referral',
          });
        }
      });
    });

    return new Response(JSON.stringify({ success: true, message: 'Referral registered!' }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Invalid request' }), { status: 400 });
  }
};