// src/pages/api/admin/site-config.ts
// Admin site configuration API - manage site settings, payment gateway, SMTP
export const prerender = false;
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { verifyAdminAuth, createSuccessResponse, createErrorResponse } from '../../../lib/admin-auth';

export const GET: APIRoute = async ({ cookies }) => {
  const authResult = await verifyAdminAuth({ request: new Request('http://localhost'), cookies });
  if (!authResult.success) return createErrorResponse(authResult.error || 'Unauthorized', authResult.status);
  if (!supabase) return createSuccessResponse({ config: getDefaultConfig() });

  try {
    const { data } = await supabase.from('site_config').select('*');
    const config: Record<string, unknown> = {};
    if (data) data.forEach(row => { config[row.key] = row.value; });
    return createSuccessResponse({ config });
  } catch (err) {
    console.error('[site-config] GET error:', err);
    return createSuccessResponse({ config: getDefaultConfig() });
  }
};

export const PUT: APIRoute = async ({ request, cookies }) => {
  const authResult = await verifyAdminAuth({ request: new Request('http://localhost'), cookies });
  if (!authResult.success) return createErrorResponse(authResult.error || 'Unauthorized', authResult.status);
  if (authResult.admin?.role !== 'super_admin') return createErrorResponse('Only super_admin can modify config', 403);
  if (!supabase) return createErrorResponse('Supabase not configured', 503);

  const body = await request.json();
  const { key, value, category } = body;
  if (!key) return createErrorResponse('key required', 400);

  try {
    const { error } = await supabase.from('site_config').upsert({
      key, value: typeof value === 'string' ? value : JSON.stringify(value),
      category: category || 'general', updated_at: new Date().toISOString(),
    }, { onConflict: 'key' });
    if (error) return createErrorResponse(error.message, 500);
    return createSuccessResponse({ success: true });
  } catch (err) { return createErrorResponse(String(err), 500); }
};

export const DELETE: APIRoute = async ({ url, cookies }) => {
  const authResult = await verifyAdminAuth({ request: new Request('http://localhost'), cookies });
  if (!authResult.success) return createErrorResponse(authResult.error || 'Unauthorized', authResult.status);
  if (authResult.admin?.role !== 'super_admin') return createErrorResponse('Only super_admin can modify config', 403);
  if (!supabase) return createErrorResponse('Supabase not configured', 503);

  const key = url.searchParams.get('key');
  if (!key) return createErrorResponse('key required', 400);

  const { error } = await supabase.from('site_config').delete().eq('key', key);
  if (error) return createErrorResponse(error.message, 500);
  return createSuccessResponse({ success: true });
};

function getDefaultConfig(): Record<string, unknown> {
  return {
    site_name: 'TopZone', site_description: 'Platform Top-Up & Gaming Gear Terbaik',
    maintenance_mode: false, currency: 'IDR', currency_symbol: 'Rp', min_order: 10000,
    payment_midtrans_client_key: '', payment_midtrans_server_key: '', payment_midtrans_mode: 'sandbox',
    smtp_host: '', smtp_port: 587, smtp_user: '', smtp_pass: '', smtp_from: 'noreply@topzone.id',
    whatsapp_support: '', instagram_url: '', twitter_url: '',
  };
}