// src/pages/api/admin/customers.ts
// Admin customers list API with aggregated stats
export const prerender = false;
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { verifyAdminAuth, createSuccessResponse, createErrorResponse, requireRole } from '../../../lib/admin-auth';

export const GET: APIRoute = async ({ cookies }) => {
  const authResult = await verifyAdminAuth({ request: new Request('http://localhost'), cookies });
  if (!authResult.success) return createErrorResponse(authResult.error || 'Unauthorized', authResult.status);
  if (!requireRole(authResult.admin, 'staff')) return createErrorResponse('Admin access required', 403);
  if (!supabase) return createSuccessResponse({ customers: [] });

  try {
    const { data: orders } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    const { data: userPoints } = await supabase.from('user_points').select('*');

    const pointsMap = new Map((userPoints || []).map(p => [p.user_email, p]));

    const customerMap = new Map();
    (orders || []).forEach(o => {
      const email = o.user_email || o.customer_email;
      if (!email) return;
      if (!customerMap.has(email)) {
        customerMap.set(email, { email, name: o.customer_name || '', total_orders: 0, total_spent: 0 });
      }
      const c = customerMap.get(email);
      c.total_orders++;
      c.total_spent += (o.total || 0);
    });

    const customers = Array.from(customerMap.values()).map(c => {
      const p = pointsMap.get(c.email);
      return { ...c, points: p?.total_points || 0, tier: p?.tier || 'bronze' };
    }).sort((a, b) => b.total_spent - a.total_spent);

    return createSuccessResponse({ customers });
  } catch (error) {
    console.error('Customers API error:', error);
    return createErrorResponse('Internal server error', 500);
  }
};