// src/pages/api/admin/login-history.ts
// Admin login history API - track admin login/logout events
export const prerender = false;
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { verifyAdminAuth, createSuccessResponse, createErrorResponse, requireRole } from '../../../lib/admin-auth';

export const GET: APIRoute = async ({ url, cookies }) => {
  const authResult = await verifyAdminAuth({ request: new Request('http://localhost'), cookies });
  if (!authResult.success) return createErrorResponse(authResult.error || 'Unauthorized', authResult.status);
  if (!requireRole(authResult.admin, 'admin')) return createErrorResponse('Admin access required', 403);

  const limit = Math.min(parseInt(url.searchParams.get('limit') || '100'), 500);

  if (!supabase) return createSuccessResponse({ logs: [] });

  try {
    const { data, error } = await supabase
      .from('audit_log')
      .select('admin_email, action, entity_type, created_at, ip_address, details')
      .in('action', ['login', 'logout'])
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw new Error(error.message);
    return createSuccessResponse({ logs: data || [] });
  } catch (err) {
    return createErrorResponse('Failed to fetch login history', 500);
  }
};
