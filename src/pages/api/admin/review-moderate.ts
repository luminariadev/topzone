// src/pages/api/admin/review-moderate.ts
// Admin review moderation API - approve/reject reviews with admin reply
// Called from admin panel via fetch('/api/admin/review-moderate')
// Data schema: reviews table with id, status, admin_reply, admin_replied_at, updated_at
export const prerender = false;
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { verifyAdminAuth, createSuccessResponse, createErrorResponse, requireRole } from '../../../lib/admin-auth';

export const POST: APIRoute = async ({ request, cookies }) => {
  const authResult = await verifyAdminAuth({ request: new Request('http://localhost'), cookies });
  if (!authResult.success) return createErrorResponse(authResult.error || 'Unauthorized', authResult.status);
  if (!requireRole(authResult.admin, 'admin')) return createErrorResponse('Admin access required', 403);
  if (!supabase) return createErrorResponse('Supabase not configured', 503);

  try {
    const body = await request.json();
    const { review_id, action, admin_reply } = body;
    if (!review_id || !action) {
      return createErrorResponse('Missing required fields: review_id, action', 400);
    }
    const status = action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'pending';

    const update: Record<string, unknown> = { status, updated_at: new Date().toISOString() };
    if (admin_reply) { update.admin_reply = admin_reply; update.admin_replied_at = new Date().toISOString(); }

    const { error } = await supabase.from('reviews').update(update).eq('id', review_id);
    if (error) return createErrorResponse(error.message, 500);
    return createSuccessResponse({ success: true });
  } catch (error) {
    return createErrorResponse('Internal server error', 500);
  }
};