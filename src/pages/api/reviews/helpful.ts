// src/pages/api/reviews/helpful.ts
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401, headers: { 'Content-Type': 'application/json' } });

  const body = await request.json();
  const { review_id, vote_type } = body;

  await supabase.from('review_helpful_votes').upsert({ review_id, user_email: user.email, vote_type });

  const { data: votes } = await supabase.from('review_helpful_votes').select('*').eq('review_id', review_id);
  const helpful = votes?.filter(v => v.vote_type === 'up').length || 0;
  await supabase.from('reviews').update({ helpful_votes: helpful }).eq('id', review_id);

  return new Response(JSON.stringify({ helpful }), { status: 200, headers: { 'Content-Type': 'application/json' } });
};