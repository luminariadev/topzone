// src/pages/api/auth/referral-complete.ts
// Called when a referred user completes their first purchase
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { referred_email, order_id, order_total } = body;

    if (!referred_email || !order_id || typeof order_total === 'undefined') {
      return new Response(JSON.stringify({ error: 'Missing referred_email, order_id, or order_total' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Find the pending referral for this user
    const { data: referral, error: referralError } = await supabase
      .from('referrals')
      .select('*')
      .eq('referred_email', referred_email)
      .eq('status', 'pending')
      .single();

    if (referralError || !referral) {
      return new Response(JSON.stringify({ error: 'No pending referral found for this user' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Update referral status to completed and record completion details
    const { error: updateError } = await supabase
      .from('referrals')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        order_id: order_id,
      })
      .eq('id', referral.id);

    if (updateError) {
      console.error('Referral update error:', updateError);
      return new Response(JSON.stringify({ error: updateError.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Reward referrer with points (5000 points per referral)
    const rewardPoints = referral.reward_points;
    const referrerEmail = referral.referrer_email;

    // Get referrer's current points record
    const { data: userPoints, error: pointsError } = await supabase
      .from('user_points')
      .select('*')
      .eq('user_email', referrerEmail)
      .single();

    if (userPoints) {
      await supabase
        .from('user_points')
        .update({
          total_points: (userPoints.total_points || 0) + rewardPoints,
          lifetime_points: (userPoints.lifetime_points || 0) + rewardPoints,
        })
        .eq('id', userPoints.id);
    } else {
      // Create points record if it doesn't exist
      await supabase.from('user_points').insert({
        user_email: referrerEmail,
        total_points: rewardPoints,
        lifetime_points: rewardPoints,
      });
    }

    // Add to points history for referrer
    await supabase.from('points_history').insert({
      user_email: referrerEmail,
      points: rewardPoints,
      type: 'bonus',
      description: `Referral bonus from ${referred_email}`,
      order_id: order_id,
    });

    return new Response(JSON.stringify({ success: true, reward_granted: rewardPoints }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Referral complete API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
