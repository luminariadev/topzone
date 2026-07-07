// src/pages/api/auth/referral-code.ts
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const GET: APIRoute = async ({ request }) => {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const email = user.email;
    if (!email) {
      return new Response(JSON.stringify({ error: 'No email found' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if user already has a referral code
    const { data: existingCode, error: codeError } = await supabase
      .from('referral_codes')
      .select('*')
      .eq('user_email', email)
      .single();

    if (codeError && codeError.code !== 'PGRST116') {
      return new Response(JSON.stringify({ error: codeError.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (existingCode) {
      // Return existing code with stats
      const { data: referrals } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_email', email);

      const completedReferrals = referrals?.filter(r => r.status === 'completed') || [];
      const totalReward = completedReferrals.reduce((sum, r) => sum + (r.reward_points || 0), 0);

      return new Response(JSON.stringify({
        code: existingCode.code,
        total_referrals: referrals?.length || 0,
        completed_referrals: completedReferrals.length,
        total_reward: totalReward,
        referral_link: `${new URL(request.url).origin}/register?ref=${existingCode.code}`,
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Generate new unique referral code
    const generateCode = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let code = 'TZ';
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return code;
    };

    let newCode = generateCode();
    let attempts = 0;

    while (attempts < 10) {
      const { data: existing, error } = await supabase
        .from('referral_codes')
        .select('code')
        .eq('code', newCode)
        .single();

      if (error && error.code === 'PGRST116') break;
      if (existing) {
        newCode = generateCode();
        attempts++;
      } else {
        break;
      }
    }

    // Create referral code
    const { data: createdCode, error: createError } = await supabase
      .from('referral_codes')
      .insert({
        user_email: email,
        code: newCode,
        total_referrals: 0,
        total_reward: 0,
      })
      .select()
      .single();

    if (createError) {
      return new Response(JSON.stringify({ error: createError.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const referralLink = `${new URL(request.url).origin}/register?ref=${newCode}`;

    return new Response(JSON.stringify({
      code: createdCode.code,
      total_referrals: 0,
      completed_referrals: 0,
      total_reward: 0,
      referral_link: referralLink,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Referral code API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  // Regenerate referral code
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const email = user.email;
    if (!email) {
      return new Response(JSON.stringify({ error: 'No email found' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Delete old code
    await supabase.from('referral_codes').delete().eq('user_email', email);

    // Generate new code
    const generateCode = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let code = 'TZ';
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return code;
    };

    let newCode = generateCode();
    let attempts = 0;
    while (attempts < 10) {
      const { data: existing } = await supabase
        .from('referral_codes')
        .select('code')
        .eq('code', newCode)
        .single();

      if (!existing) break;
      newCode = generateCode();
      attempts++;
    }

    const { data: createdCode, error: createError } = await supabase
      .from('referral_codes')
      .insert({
        user_email: email,
        code: newCode,
        total_referrals: 0,
        total_reward: 0,
      })
      .select()
      .single();

    if (createError) {
      return new Response(JSON.stringify({ error: createError.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const referralLink = `${new URL(request.url).origin}/register?ref=${newCode}`;

    return new Response(JSON.stringify({
      code: createdCode.code,
      total_referrals: 0,
      completed_referrals: 0,
      total_reward: 0,
      referral_link: referralLink,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Referral regenerate error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};