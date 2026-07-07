// src/pages/api/user/claim-birthday.ts
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401, headers: { 'Content-Type': 'application/json' } });

    const email = user.email;
    if (!email) return new Response(JSON.stringify({ error: 'No email' }), { status: 400, headers: { 'Content-Type': 'application/json' } });

    // Prevent claiming more than once per year
    const yearStart = new Date(new Date().getFullYear(), 0, 1).toISOString();
    const { data: existing } = await supabase.from('points_history').select('created_at').eq('user_email', email).eq('type', 'bonus').eq('description', 'Birthday bonus').gte('created_at', yearStart).single();
    if (existing) return new Response(JSON.stringify({ error: 'Sudah klaim bonus ulang tahun tahun ini!' }), { status: 400, headers: { 'Content-Type': 'application/json' } });

    const bonusPoints = 10000;
    const { data: userPoints } = await supabase.from('user_points').select('*').eq('user_email', email).single();
    if (userPoints) {
      await supabase.from('user_points').update({ total_points: (userPoints.total_points || 0) + bonusPoints, lifetime_points: (userPoints.lifetime_points || 0) + bonusPoints }).eq('id', userPoints.id);
    } else {
      await supabase.from('user_points').insert({ user_email: email, total_points: bonusPoints, lifetime_points: bonusPoints });
    }
    await supabase.from('points_history').insert({ user_email: email, points: bonusPoints, type: 'bonus', description: 'Birthday bonus' });
    return new Response(JSON.stringify({ success: true, bonus: bonusPoints }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Birthday bonus error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
