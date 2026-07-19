// src/pages/api/user/referral-code.ts
// GET  — retrieve or create user's referral code + stats
// POST — regenerate referral code (optional)

import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY
);

function generateCode(length = 8) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'TZN-';
  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

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

  // Get existing referral code + stats
  const { data: referral, error: refErr } = await userClient
    .from('referrals')
    .select('referral_code, status, reward_points, reward_claimed, created_at')
    .eq('referrer_id', user.id)
    .single();

  if (refErr && refErr.code !== 'PGRST116') {
    return new Response(JSON.stringify({ error: 'Gagal mengambil data referral' }), { status: 500 });
  }

  let code = referral?.referral_code || null;
  let isNew = false;

  // Auto-generate if none exists
  if (!code) {
    code = generateCode();
    const { error: insertErr } = await userClient.from('referrals').insert({
      referrer_id: user.id,
      referral_code: code,
      status: 'pending',
      reward_points: 500,
    });
    if (insertErr) {
      return new Response(JSON.stringify({ error: 'Gagal membuat kode referral' }), { status: 500 });
    }
    isNew = true;
  }

  // Stats
  const { count: totalReferrals } = await userClient
    .from('referrals').select('id', { count: 'exact', head: true })
    .eq('referrer_id', user.id);

  const { count: completedReferrals } = await userClient
    .from('referrals').select('id', { count: 'exact', head: true })
    .eq('referrer_id', user.id).eq('status', 'completed');

  const { count: claimedRewards } = await userClient
    .from('referrals').select('id', { count: 'exact', head: true })
    .eq('referrer_id', user.id).eq('reward_claimed', true);

  const baseUrl = import.meta.env.PUBLIC_SITE_URL || 'https://topzone.id';
  const shareLink = `${baseUrl}/register?ref=${code}`;
  const whatsappMsg = encodeURIComponent(`Bergabung di TopZone pakai kode referral saya: ${code} — dapat bonus spesial! ${shareLink}`);

  return new Response(JSON.stringify({
    code,
    share_link: shareLink,
    whatsapp_link: `https://wa.me/?text=${whatsappMsg}`,
    stats: {
      total_referrals: totalReferrals || 0,
      completed_referrals: completedReferrals || 0,
      claimed_rewards: claimedRewards || 0,
      reward_per_referral: referral?.reward_points || 500,
    },
    is_new: isNew,
  }), { status: 200 });
};

export const POST: APIRoute = async ({ request }) => {
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

  const newCode = generateCode();
  const { error: updateErr } = await userClient
    .from('referrals')
    .update({ referral_code: newCode })
    .eq('referrer_id', user.id);

  if (updateErr) {
    return new Response(JSON.stringify({ error: 'Gagal regenerate kode' }), { status: 500 });
  }

  const baseUrl = import.meta.env.PUBLIC_SITE_URL || 'https://topzone.id';
  return new Response(JSON.stringify({
    code: newCode,
    share_link: `${baseUrl}/register?ref=${newCode}`,
  }), { status: 200 });
};