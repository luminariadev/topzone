// src/pages/api/admin/review-moderate.ts
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  const { data: adminCheck } = await supabase.from('admins').select('email').eq('email', user.email).single();
  if (!adminCheck) return new Response(JSON.stringify({ error: 'Admin access required' }), { status: 403, headers: { 'Content-Type': 'application/json' } });

  try {
    const body = await request.json();
    const { review_id, action, admin_reply } = body;
    if (!review_id || !action) {
      return new Response(JSON.stringify({ error: 'Missing required fields: review_id, action' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    const status = action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'pending';

    const update: Record<string, any> = { status, updated_at: new Date().toISOString() };
    if (admin_reply) { update.admin_reply = admin_reply; update.admin_replied_at = new Date().toISOString(); }

    const { error } = await supabase.from('reviews').update(update).eq('id', review_id);
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};