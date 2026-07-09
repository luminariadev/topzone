// src/pages/api/admin/customer-export.ts
export const prerender = false;
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { verifyAdminAuth, createErrorResponse, requireRole } from '../../../lib/admin-auth';

export const GET: APIRoute = async ({ cookies }) => {
  const authResult = await verifyAdminAuth({ request: new Request('http://localhost'), cookies });
  if (!authResult.success) return createErrorResponse(authResult.error || 'Unauthorized', authResult.status);
  if (!requireRole(authResult.admin, 'admin')) return createErrorResponse('Admin access required', 403);
  if (!supabase) return createErrorResponse('Supabase not configured', 503);

  try {
    const { data: orders } = await supabase.from('orders').select('user_email, customer_name, total, status, created_at').order('created_at', { ascending: false });

    const customerMap = new Map();
    (orders || []).forEach(o => {
      const email = o.user_email || 'guest@' + (o.customer_name || '');
      if (!customerMap.has(email)) {
        customerMap.set(email, { email, name: o.customer_name || 'Guest', orders: [], total_spent: 0 });
      }
      const c = customerMap.get(email);
      c.orders.push(o);
      c.total_spent += (o.total || 0);
    });

    let csv = 'Email,Nama,Total Orders,Total Spent (Rp),Avg Order Value (Rp),Completed Orders,Pending Orders\n';
    customerMap.forEach(c => {
      const completed = c.orders.filter(o => o.status === 'completed').length;
      const pending = c.orders.filter(o => o.status === 'pending').length;
      csv += [c.email, '"' + (c.name || '').replace(/"/g, '""') + '"', c.orders.length, c.total_spent, c.orders.length > 0 ? Math.round(c.total_spent / c.orders.length) : 0, completed, pending].join(',') + '\n';
    });

    return new Response(csv, {
      status: 200,
      headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="topzone-customers-' + new Date().toISOString().slice(0, 10) + '.csv"' },
    });
  } catch (err) {
    return createErrorResponse('Failed to export customers', 500);
  }
};