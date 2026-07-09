// src/pages/api/admin/scheduled-report.ts
// Admin scheduled report API - configure daily email reports
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
      .select('*').eq('category', 'reports');
    const config: Record<string, unknown> = {};
    if (data) data.forEach(row => { config[row.key] = row.value; });
    return createSuccessResponse({ config });
  } catch (err) {
    return createErrorResponse('Failed to fetch report config', 500);
  }
};

export const PUT: APIRoute = async ({ request, cookies }) => {
  const authResult = await verifyAdminAuth({ request: new Request('http://localhost'), cookies });
  if (!authResult.success) return createErrorResponse(authResult.error || 'Unauthorized', authResult.status);
  if (!requireRole(authResult.admin, 'super_admin')) return createErrorResponse('Super admin access required', 403);

  const body = await request.json();
  const { enabled, email, time, include_sections } = body;

  const configData: Record<string, string> = {};
  if (enabled !== undefined) configData['report_enabled'] = String(enabled);
  if (email) configData['report_email'] = email;
  if (time) configData['report_time'] = time;
  if (include_sections) configData['report_sections'] = JSON.stringify(include_sections);

  try {
    for (const [key, value] of Object.entries(configData)) {
      await supabase.from('site_config').upsert({
        key, value, category: 'reports', updated_at: new Date().toISOString(),
      }, { onConflict: 'key' });
    }
    return createSuccessResponse({ success: true });
  } catch (err) {
    return createErrorResponse(String(err), 500);
  }
};

export const POST: APIRoute = async ({ request, cookies }) => {
  const authResult = await verifyAdminAuth({ request: new Request('http://localhost'), cookies });
  if (!authResult.success) return createErrorResponse(authResult.error || 'Unauthorized', authResult.status);
  if (!requireRole(authResult.admin, 'super_admin')) return createErrorResponse('Super admin access required', 403);

  if (!supabase) return createErrorResponse('Supabase not configured', 503);

  // Generate report now
  const { data: orders } = await supabase.from('orders').select('id, total, status, created_at');
  const { data: products } = await supabase.from('products').select('id, name').eq('status', 'published');
  const { data: vouchers } = await supabase.from('vouchers').select('id, code, used_count');

  const today = new Date().toISOString().slice(0, 10);
  const todayOrders = (orders || []).filter(o => o.created_at && o.created_at.slice(0, 10) === today);
  const todayRevenue = todayOrders.reduce((s, o) => s + (o.total || 0), 0);

  return createSuccessResponse({
    report: {
      date: today,
      total_orders: todayOrders.length,
      total_revenue: todayRevenue,
      active_products: (products || []).length,
      total_vouchers: (vouchers || []).length,
      orders_by_status: {
        pending: todayOrders.filter(o => o.status === 'pending').length,
        completed: todayOrders.filter(o => o.status === 'completed').length,
        cancelled: todayOrders.filter(o => o.status === 'cancelled').length,
      },
    },
    message: 'Report generated. Email delivery pending SMTP configuration.',
  });
};
