// src/pages/api/user/spend-points.ts
// Deduct points when used at checkout
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const body = await request.json();
    const { points, order_id } = body;

    if (!points || !order_id) {
      return new Response(JSON.stringify({ error: 'Missing points or order_id' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const email = user.email;
    if (!email) {
      return new Response(JSON.stringify({ error: 'No email' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get current points
    const { data: userPoints, error: fetchError } = await supabase
      .from('user_points')
      .select('*')
      .eq('user_email', email)
      .single();

    if (fetchError || !userPoints) {
      return new Response(JSON.stringify({ error: 'No points record found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (userPoints.total_points < points) {
      return new Response(JSON.stringify({ error: 'Insufficient points' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Deduct points
    const { error: deductError } = await supabase
      .from('user_points')
      .update({ total_points: userPoints.total_points - points })
      .eq('id', userPoints.id);

    if (deductError) {
      return new Response(JSON.stringify({ error: deductError.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Log the transaction
    await supabase.from('points_history').insert({
      user_email: email,
      points: -points,
      type: 'spend',
      description: 'Poin digunakan di checkout',
      order_id: order_id,
    });

    return new Response(JSON.stringify({ success: true, remaining: userPoints.total_points - points }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Spend points API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};