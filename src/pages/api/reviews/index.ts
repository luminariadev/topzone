// src/pages/api/reviews/index.ts
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const GET: APIRoute = async ({ url }) => {
  const slug = url.searchParams.get('slug');
  const type = url.searchParams.get('type') || 'game';
  const sort = url.searchParams.get('sort') || 'newest';

  let query = supabase.from('reviews').select('*').eq('status', 'approved');
  if (slug) query = query.eq('product_slug', slug);
  if (type) query = query.eq('product_type', type);
  if (sort === 'highest') query = query.order('rating', { ascending: false });
  else if (sort === 'lowest') query = query.order('rating', { ascending: true });
  else query = query.order('created_at', { ascending: false });

  const { data, error } = await query;
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
  return new Response(JSON.stringify({ reviews: data || [] }), { status: 200, headers: { 'Content-Type': 'application/json' } });
};

export const POST: APIRoute = async ({ request }) => {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }
  try {
    const body = await request.json();
    const { product_slug, product_type, rating, title, content, photo_urls } = body;
    if (!product_slug || !rating || !content) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    const { data: review, error } = await supabase.from('reviews').insert({
      product_slug,
      product_type: product_type || 'game',
      user_email: user.email,
      user_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonymous',
      rating,
      title: title || '',
      content,
      photo_urls: photo_urls || [],
      status: 'pending',
    }).select().single();
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
    return new Response(JSON.stringify({ review }), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
