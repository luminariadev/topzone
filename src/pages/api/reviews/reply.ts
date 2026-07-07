import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }
    const { data: adminCheck } = await supabase.from('admins').select('email').eq('email', user.email).single();
    if (!adminCheck) {
      return new Response(JSON.stringify({ error: 'Admin access required' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
    }

    const body = await request.json();
    const { review_id, admin_reply } = body;

    if (!review_id || !admin_reply) {
      return new Response(JSON.stringify({ error: 'Missing required fields: review_id, admin_reply' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    if (admin_reply.length > 1000) {
      return new Response(JSON.stringify({ error: 'Reply must be under 1000 characters' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const { error } = await supabase.from('reviews').update({
      admin_reply: admin_reply,
      admin_replied_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }).eq('id', review_id);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ success: true, message: 'Reply posted successfully' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }
    const { data: adminCheck } = await supabase.from('admins').select('email').eq('email', user.email).single();
    if (!adminCheck) {
      return new Response(JSON.stringify({ error: 'Admin access required' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
    }

    const body = await request.json();
    const { review_id } = body;

    if (!review_id) {
      return new Response(JSON.stringify({ error: 'Missing review_id' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const { error } = await supabase.from('reviews').update({
      admin_reply: null,
      admin_replied_at: null,
      updated_at: new Date().toISOString(),
    }).eq('id', review_id);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ success: true, message: 'Reply removed' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
