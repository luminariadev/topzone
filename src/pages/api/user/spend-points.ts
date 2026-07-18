// src/pages/api/user/spend-points.ts
// Points spending API endpoint for deducting points used in checkout

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  try {
    const { points, order_id } = await request.json();

    if (!points || points <= 0 || !order_id) {
      return new Response(JSON.stringify({ error: 'Invalid request: points and order_id required' }), {
        status: 400, headers: corsHeaders,
      });
    }

    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401, headers: corsHeaders });
    }

    const { supabase } = await import('../../../lib/supabase');
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase!.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Authentication failed' }), { status: 401, headers: corsHeaders });
    }

    const userId = user.id;

    // Check current balance
    const { data: pointsData } = await supabase!
      .from('user_points')
      .select('points_balance')
      .eq('user_id', userId)
      .single();

    if (!pointsData || pointsData.points_balance < points) {
      return new Response(JSON.stringify({ error: 'Insufficient points' }), { status: 400, headers: corsHeaders });
    }

    // Deduct points
    const { error: updateError } = await supabase!
      .from('user_points')
      .update({
        points_balance: pointsData.points_balance - points,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (updateError) throw updateError;

    // Log history
    await supabase!.from('points_history').insert({
      user_id: userId,
      points: -points,
      reason: 'spend',
      reference_type: 'order',
      reference_id: order_id,
      description: `Used ${points.toLocaleString('id-ID')} points in order #${order_id}`,
    });

    return new Response(JSON.stringify({
      success: true,
      message: `${points.toLocaleString('id-ID')} points deducted`,
      remaining: pointsData.points_balance - points,
    }), { status: 200, headers: corsHeaders });
  } catch (err) {
    console.error('[spend-points] Error:', err);
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};