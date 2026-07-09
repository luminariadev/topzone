// src/pages/api/admin/reviews.ts
// Admin reviews API - list reviews with moderation status
export const prerender = false;
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { verifyAdminAuth, createSuccessResponse, createErrorResponse, requireRole } from '../../../lib/admin-auth';

export const GET: APIRoute = async ({ url, cookies }) => {
  const authResult = await verifyAdminAuth({ request: new Request('http://localhost'), cookies });
  if (!authResult.success) return createErrorResponse(authResult.error || 'Unauthorized', authResult.status);
  if (!requireRole(authResult.admin, 'admin')) return createErrorResponse('Admin access required', 403);

  const status = url.searchParams.get('status') || 'pending';
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 100);
  const offset = parseInt(url.searchParams.get('offset') || '0');

  if (!supabase) return createSuccessResponse({ reviews: [], total: 0 });

  try {
    let query = supabase.from('reviews').select('*', { count: 'exact' });

    if (status !== 'all') {
      query = query.eq('status', status);
    }

    query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

    const { data, count, error } = await query;
    if (error) throw new Error(error.message);

    return createSuccessResponse({
      reviews: data || [],
      total: count || 0,
    });
  } catch (err) {
    console.error('[admin reviews] Error:', err);
    return createErrorResponse('Failed to fetch reviews', 500);
  }
};
