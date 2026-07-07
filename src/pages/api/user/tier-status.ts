import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const GET: APIRoute = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

  const { data: pts } = await supabase.from('user_points').select('*').eq('user_email', user.email).single();
  const { data: orders } = await supabase.from('orders').select('total').eq('user_email', user.email);
  const totalSpent = (pts?.lifetime_points || 0) * 1000;
  const points = pts?.total_points || 0;
  const prevTier = pts?.tier || 'bronze';

  let tier = 'bronze'; let mult = 1;
  if (totalSpent >= 5000000) { tier = 'platinum'; mult = 3; }
  else if (totalSpent >= 2000000) { tier = 'gold'; mult = 2; }
  else if (totalSpent >= 500000) { tier = 'silver'; mult = 1.5; }

  const upgraded = tier !== prevTier && totalSpent >= (tier==='silver'?500000:tier==='gold'?2000000:5000000);
  if (upgraded) await supabase.from('user_points').update({ tier }).eq('user_email', user.email);

  return new Response(JSON.stringify({
    email: user.email, tier, points, totalSpent, multiplier: mult,
    justUpgraded: upgraded,
    benefits: ['1pt/Rp1000', ...(tier!=='bronze'?['1.5x poin']:[]), ...(tier==='gold'||tier==='platinum'?['Free ship','Early sale']:[]), ...(tier==='platinum'?['Dedicated support','Birthday gift']:[])]
  }), { status: 200 });
};

export const POST: APIRoute = async ({ request }) => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  const { promo_email_enabled } = await request.json();
  await supabase.from('user_data').upsert({ key: `prefs_${user.email}`, value: JSON.stringify({ promoEmail: !!promo_email_enabled }) }, { onConflict: 'key' });
  return new Response(JSON.stringify({ success: true }));
};