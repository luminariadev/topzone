// src/pages/api/admin/email-config.ts
// Admin email configuration API - manage SMTP settings
// Called from admin panel Settings tab via fetch('/api/admin/email-config')
// Data schema: site_config table with 'email' category keys
// (smtp_host, smtp_port, smtp_user, smtp_pass, smtp_from, smtp_from_name)
export const prerender = false;
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { verifyAdminAuth, createSuccessResponse, createErrorResponse, requireRole } from '../../../lib/admin-auth';

export const GET: APIRoute = async ({ cookies }) => {
  const authResult = await verifyAdminAuth({ request: new Request('http://localhost'), cookies });
  if (!authResult.success) return createErrorResponse(authResult.error || 'Unauthorized', authResult.status);
  if (!requireRole(authResult.admin, 'admin')) return createErrorResponse('Admin access required', 403);
  if (!supabase) return createSuccessResponse({ config: getDefaultEmailConfig() });

  try {
    const { data } = await supabase.from('site_config').select('*').eq('category', 'email');
    const config: Record<string, unknown> = {};
    if (data) data.forEach(row => { config[row.key] = row.value; });
    return createSuccessResponse({ config });
  } catch (err) {
    console.error('[email-config] GET error:', err);
    return createSuccessResponse({ config: getDefaultEmailConfig() });
  }
};

export const PUT: APIRoute = async ({ request, cookies }) => {
  const authResult = await verifyAdminAuth({ request: new Request('http://localhost'), cookies });
  if (!authResult.success) return createErrorResponse(authResult.error || 'Unauthorized', authResult.status);
  if (!requireRole(authResult.admin, 'super_admin')) return createErrorResponse('Super admin access required', 403);
  if (!supabase) return createErrorResponse('Supabase not configured', 503);

  const body = await request.json();
  const { key, value } = body;
  if (!key) return createErrorResponse('key required', 400);

  const allowedKeys = ['smtp_host', 'smtp_port', 'smtp_user', 'smtp_pass', 'smtp_from', 'smtp_from_name'];
  if (!allowedKeys.includes(key)) return createErrorResponse('Invalid email config key', 400);

  try {
    const { error } = await supabase.from('site_config').upsert({
      key, value: typeof value === 'string' ? value : JSON.stringify(value),
      category: 'email', updated_at: new Date().toISOString(),
    }, { onConflict: 'key' });
    if (error) return createErrorResponse(error.message, 500);
    return createSuccessResponse({ success: true });
  } catch (err) { return createErrorResponse(String(err), 500); }
};

export const POST: APIRoute = async ({ request, cookies }) => {
  const authResult = await verifyAdminAuth({ request: new Request('http://localhost'), cookies });
  if (!authResult.success) return createErrorResponse(authResult.error || 'Unauthorized', authResult.status);
  if (!requireRole(authResult.admin, 'super_admin')) return createErrorResponse('Super admin access required', 403);

  const body = await request.json();
  const { test_email } = body;
  if (!test_email) return createErrorResponse('test_email required', 400);

  return createSuccessResponse({ success: true, message: 'Test email would be sent to ' + test_email });
};

function getDefaultEmailConfig(): Record<string, unknown> {
  return { smtp_host: '', smtp_port: 587, smtp_user: '', smtp_pass: '', smtp_from: 'noreply@topzone.id', smtp_from_name: 'TopZone' };
}