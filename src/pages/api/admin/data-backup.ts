// src/pages/api/admin/data-backup.ts
export const prerender = false;
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { verifyAdminAuth, createErrorResponse, requireRole } from '../../../lib/admin-auth';

export const GET: APIRoute = async ({ url, cookies }) => {
  const authResult = await verifyAdminAuth({ request: new Request('http://localhost'), cookies });
  if (!authResult.success) return createErrorResponse(authResult.error || 'Unauthorized', authResult.status);
  if (!requireRole(authResult.admin, 'super_admin')) return createErrorResponse('Super admin access required', 403);
  if (!supabase) return createErrorResponse('Supabase not configured', 503);

  const table = url.searchParams.get('table') || 'all';
  const tables = ['products', 'orders', 'vouchers', 'reviews', 'admin_users', 'site_config', 'user_vouchers', 'user_points', 'shipping_addresses', 'referrals', 'audit_log'];
  const targetTables = table === 'all' ? tables : tables.includes(table) ? [table] : [];

  if (targetTables.length === 0) return createErrorResponse('Invalid table', 400);

  try {
    const backup: Record<string, unknown> = { generated_at: new Date().toISOString(), tables: {} };
    for (const t of targetTables) {
      const { data } = await supabase.from(t).select('*');
      backup.tables[t] = data || [];
    }

    return new Response(JSON.stringify(backup, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': 'attachment; filename="topzone-backup-' + new Date().toISOString().slice(0, 10) + '.json"',
      },
    });
  } catch (err) {
    return createErrorResponse('Backup failed: ' + String(err), 500);
  }
};