// src/pages/api/user/vouchers.ts
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

    // Get user's vouchers (both assigned and claimed)
    const { data: userVouchers, error: vouchersError } = await supabase
      .from('user_vouchers')
      .select('*, vouchers(*)')
      .eq('user_email', email)
      .eq('is_used', false)
      .gte('expires_at', new Date().toISOString());

    if (vouchersError) {
      return new Response(JSON.stringify({ error: vouchersError.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Also get general available vouchers (for manual claiming)
    const { data: generalVouchers, error: generalError } = await supabase
      .from('vouchers')
      .select('*')
      .eq('is_active', true)
      .eq('target_type', 'general')
      .gte('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false });

    const allVouchers = [
      ...(userVouchers || []).map(uv => ({
        id: uv.vouchers.id,
        code: uv.vouchers.code,
        discount: uv.vouchers.discount,
        min_purchase: uv.vouchers.min_purchase,
        expires_at: uv.expires_at,
        is_assigned: true,
      })),
      ...(generalVouchers || []).map(v => ({
        id: v.id,
        code: v.code,
        discount: v.discount,
        min_purchase: v.min_purchase,
        expires_at: v.expires_at,
        is_assigned: false,
      })),
    ];

    return new Response(JSON.stringify({ vouchers: allVouchers }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Fetch vouchers API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
        headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  // Claim a voucher
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const body = await request.json();
    const { voucher_id } = body;

    if (!voucher_id) {
      return new Response(JSON.stringify({ error: 'Missing voucher_id' }), {
        status: 400,
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

    // Check if voucher exists and is active
    const { data: voucher, error: vError } = await supabase
      .from('vouchers')
      .select('*')
      .eq('id', voucher_id)
      .single();

    if (vError || !voucher) {
      return new Response(JSON.stringify({ error: 'Voucher not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check usage limit
    if (voucher.max_uses && voucher.used_count >= voucher.max_uses) {
      return new Response(JSON.stringify({ error: 'Voucher usage limit reached' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if already claimed
    const { data: existingClaim } = await supabase
      .from('user_vouchers')
      .select('id')
      .eq('user_email', email)
      .eq('voucher_id', voucher_id)
      .single();

    if (existingClaim) {
      return new Response(JSON.stringify({ error: 'Voucher already claimed' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Calculate expiration (default 7 days)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Claim the voucher
    const { error: claimError } = await supabase
      .from('user_vouchers')
      .insert({
        user_email: email,
        voucher_id: voucher_id,
        is_used: false,
        expires_at: expiresAt.toISOString(),
      });

    if (claimError) {
      return new Response(JSON.stringify({ error: claimError.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Increment usage count
    await supabase
      .from('vouchers')
      .update({ used_count: (voucher.used_count || 0) + 1 })
      .eq('id', voucher_id);

    return new Response(JSON.stringify({ success: true, code: voucher.code }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Claim voucher API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};