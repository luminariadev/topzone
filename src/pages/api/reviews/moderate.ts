import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

/**
 * POST: Approve or reject a pending review
 * Body: { review_id, action: 'approve' | 'reject', reason?: string }
 * Requires admin session.
 */
export const POST: APIRoute = async ({ request }) => {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), {
        status: 401, headers: { 'Content-Type': 'application/json' },
      });
    }

    const { data: adminCheck } = await supabase
      .from('admins').select('email').eq('email', user.email).single();
    if (!adminCheck) {
      return new Response(JSON.stringify({ error: 'Admin access required' }), {
        status: 403, headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await request.json();
    const { review_id, action, reason } = body;

    if (!review_id || !action) {
      return new Response(JSON.stringify({ error: 'Missing review_id or action' }), {
        status: 400, headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!['approve', 'reject'].includes(action)) {
      return new Response(JSON.stringify({ error: 'action must be "approve" or "reject"' }), {
        status: 400, headers: { 'Content-Type': 'application/json' },
      });
    }

    const newStatus = action === 'approve' ? 'approved' : 'rejected';
    const updateData: Record<string, any> = {
      status: newStatus,
      reviewed_at: new Date().toISOString(),
      reviewer_email: user.email,
      updated_at: new Date().toISOString(),
    };
    if (action === 'reject' && reason) {
      updateData.rejection_reason = reason;
    }

    const { error } = await supabase
      .from('reviews')
      .update(updateData)
      .eq('id', review_id);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500, headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: `Review ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch {
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }
};

/**
 * GET: Fetch pending reviews (for moderation queue)
 * Query: ?status=pending&limit=20&offset=0
 */
export const GET: APIRoute = async ({ url }) => {
  const status = url.searchParams.get('status') || 'pending';
  const limit = parseInt(url.searchParams.get('limit') || '20');
  const offset = parseInt(url.searchParams.get('offset') || '0');

  const { data, count, error } = await supabase
    .from('reviews')
    .select('*', { count: 'exact' })
    .eq('status', status)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({
    reviews: data || [],
    total: count || 0,
    limit,
    offset,
  }), { status: 200, headers: { 'Content-Type': 'application/json' } });
};