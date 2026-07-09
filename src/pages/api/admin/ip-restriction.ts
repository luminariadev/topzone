// src/pages/api/admin/ip-restriction.ts
// Admin IP restriction API - manage allowed IPs for admin access
export const prerender = false;
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { verifyAdminAuth, createSuccessResponse, createErrorResponse, requireRole } from '../../../lib/admin-auth';

export const GET: APIRoute = async ({ cookies }) => {
  const authResult = await verifyAdminAuth({ request: new Request('http://localhost'), cookies });
  if (!authResult.success) return createErrorResponse(authResult.error || 'Unauthorized', authResult.status);
  if (!requireRole(authResult.admin, 'super_admin')) return createErrorResponse('Super admin access required', 403);

  try {
    const { data } = await supabase.from('site_config')
      .select('*').eq('category', 'security');
    const config: Record<string, unknown> = {};
    if (data) data.forEach(row => { config[row.key] = row.value; });
    return createSuccessResponse({ restrictions: config });
  } catch (err) {
    return createErrorResponse('Failed to fetch restrictions', 500);
  }
};

export const PUT: APIRoute = async ({ request, cookies }) => {
  const authResult = await verifyAdminAuth({ request: new Request('http://localhost'), cookies });
  if (!authResult.success) return createErrorResponse(authResult.error || 'Unauthorized', authResult.status);
  if (!requireRole(authResult.admin, 'super_admin')) return createErrorResponse('Super admin access required', 403);

  const body = await request.json();
  const { allowed_ips, enabled } = body;

  try {
    if (allowed_ips !== undefined) {
      await supabase.from('site_config').upsert({
        key: 'admin_allowed_ips', value: JSON.stringify(allowed_ips),
        category: 'security', updated_at: new Date().toISOString(),
      }, { onConflict: 'key' });
    }
    if (enabled !== undefined) {
      await supabase.from('site_config').upsert({
        key: 'admin_ip_restriction_enabled', value: String(enabled),
        category: 'security', updated_at: new Date().toISOString(),
      }, { onConflict: 'key' });
    }
    return createSuccessResponse({ success: true });
  } catch (err) {
    return createErrorResponse(String(err), 500);
  }
};
