// src/pages/api/user/points.ts
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

    const { data: userPoints, error: pointsError } = await supabase
      .from('user_points')
      .select('total_points, tier, lifetime_points')
      .eq('user_email', email)
      .single();

    if (pointsError && pointsError.code !== 'PGRST116') { // PGRST116 = no rows found
      return new Response(JSON.stringify({ error: pointsError.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // If no points record, return default
    if (!userPoints) {
      return new Response(JSON.stringify({
        total_points: 0,
        lifetime_points: 0,
        tier: 'bronze',
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      total_points: userPoints.total_points,
      lifetime_points: userPoints.lifetime_points,
      tier: userPoints.tier,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Fetch user points API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
