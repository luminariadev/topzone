// src/pages/api/admin/payment-config.ts
export const prerender = false;
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { verifyAdminAuth, createSuccessResponse, createErrorResponse, requireRole } from '../../../lib/admin-auth';

export const GET: APIRoute = async ({ cookies }) => {
  const authResult = await verifyAdminAuth({ request: new Request('http://localhost'), cookies });
  if (!authResult.success) return createErrorResponse(authResult.error || 'Unauthorized', authResult.status);
  if (!supabase) return createSuccessResponse({ config: getDefaultConfig() });

  const { data } = await supabase.from('site_config').select('*').eq('category', 'payment');
  const config: Record<string, unknown> = {};
  if (data) data.forEach(row => { config[row.key] = row.value; });
  return createSuccessResponse({ config });
};

export const PUT: APIRoute = async ({ request, cookies }) => {
  const authResult = await verifyAdminAuth({ request: new Request('http://localhost'), cookies });
  if (!authResult.success) return createErrorResponse(authResult.error || 'Unauthorized', authResult.status);
  if (!requireRole(authResult.admin, 'super_admin')) return createErrorResponse('Super admin access required', 403);
  if (!supabase) return createErrorResponse('Supabase not configured', 503);

  const body = await request.json();
  const { key, value } = body;
  if (!key) return createErrorResponse('key required', 400);

  const allowedKeys = ['midtrans_merchant_id', 'midtrans_client_key', 'midtrans_server_key', 'midtrans_is_production', 'payment_methods'];
  if (!allowedKeys.includes(key)) return createErrorResponse('Invalid payment config key', 400);

  const { error } = await supabase.from('site_config').upsert({
    key, value: typeof value === 'string' ? value : JSON.stringify(value),
    category: 'payment', updated_at: new Date().toISOString(),
  }, { onConflict: 'key' });

  if (error) return createErrorResponse(error.message, 500);
  return createSuccessResponse({ success: true });
};

function getDefaultConfig() {
  return { midtrans_merchant_id: '', midtrans_client_key: '', midtrans_server_key: '', midtrans_is_production: 'false', payment_methods: '["credit_card","gopay","shopeepay","bank_transfer"]' };
}