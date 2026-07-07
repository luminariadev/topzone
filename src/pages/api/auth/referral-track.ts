// src/pages/api/auth/referral-track.ts
// Called when a new user registers via a referral link
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { code, referred_email } = body;

    if (!code || !referred_email) {
      return new Response(JSON.stringify({ error: 'Missing code or referred_email' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Look up the referral code
    const { data: refCode, error: codeError } = await supabase
      .from('referral_codes')
      .select('*')
      .eq('code', code)
      .single();

    if (codeError || !refCode) {
      return new Response(JSON.stringify({ error: 'Invalid referral code' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const referrerEmail = refCode.user_email;

    // Prevent self-referral
    if (referrerEmail === referred_email) {
      return new Response(JSON.stringify({ error: 'Cannot refer yourself' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check if already referred
    const { data: existingReferral } = await supabase
      .from('referrals')
      .select('id')
      .eq('referred_email', referred_email)
      .single();

    if (existingReferral) {
      return new Response(JSON.stringify({ message: 'Already referred' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Create referral record (pending until first purchase)
    const { error: insertError } = await supabase.from('referrals').insert({
      referrer_email: referrerEmail,
      referred_email: referred_email,
      status: 'pending',
      reward_points: 5000,
    });

    if (insertError) {
      console.error('Referral insert error:', insertError);
      return new Response(JSON.stringify({ error: insertError.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Increment referrer's total referrals count
    await supabase
      .from('referral_codes')
      .update({ total_referrals: (refCode.total_referrals || 0) + 1 })
      .eq('code', code);

    return new Response(JSON.stringify({ success: true }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Referral track error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};