// src/pages/api/admin/audit-log-cleanup.ts
export const prerender = false;
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { verifyAdminAuth, createSuccessResponse, createErrorResponse, requireRole } from '../../../lib/admin-auth';

export const POST: APIRoute = async ({ request, cookies }) => {
  const authResult = await verifyAdminAuth({ request: new Request('http://localhost'), cookies });
  if (!authResult.success) return createErrorResponse(authResult.error || 'Unauthorized', authResult.status);
  if (!requireRole(authResult.admin, 'super_admin')) return createErrorResponse('Super admin access required', 403);
  if (!supabase) return createErrorResponse('Supabase not configured', 503);

  const body = await request.json();
  const days = parseInt(body.days) || 90;
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase.from('audit_log').delete().lt('created_at', cutoff).select('id');

  if (error) return createErrorResponse(error.message, 500);
  return createSuccessResponse({ deleted: data?.length || 0, older_than_days: days });
};