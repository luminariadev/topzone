// src/pages/api/admin/order-notifications.ts
// Admin order notifications API - get unread/recent order notifications
export const prerender = false;
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { verifyAdminAuth, createSuccessResponse, createErrorResponse, requireRole } from '../../../lib/admin-auth';

export const GET: APIRoute = async ({ url, cookies }) => {
  const authResult = await verifyAdminAuth({ request: new Request('http://localhost'), cookies });
  if (!authResult.success) return createErrorResponse(authResult.error || 'Unauthorized', authResult.status);
  if (!requireRole(authResult.admin, 'staff')) return createErrorResponse('Staff access required', 403);
  if (!supabase) return createSuccessResponse({ notifications: [], unread_count: 0 });

  try {
    const since = url.searchParams.get('since');
    let query = supabase.from('orders').select('id, user_email, customer_name, total, status, created_at').order('created_at', { ascending: false });
    if (since) query = query.gt('created_at', since);
    query = query.limit(50);

    const { data: orders, error } = await query;
    if (error) throw new Error(error.message);

    const notifications = (orders || []).map(o => ({
      id: o.id,
      type: 'order',
      title: 'Pesanan Baru',
      message: (o.customer_name || o.user_email || 'Guest') + ' membeli sebesar Rp ' + (o.total || 0).toLocaleString('id-ID'),
      status: o.status,
      created_at: o.created_at,
      read: false,
    }));

    return createSuccessResponse({
      notifications,
      unread_count: notifications.filter(n => n.status === 'pending').length,
    });
  } catch (err) {
    return createErrorResponse('Failed to fetch notifications', 500);
  }
};
