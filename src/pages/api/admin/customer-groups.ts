// src/pages/api/admin/customer-groups.ts
// Admin customer group/segment management API
export const prerender = false;
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { verifyAdminAuth, createSuccessResponse, createErrorResponse, requireRole } from '../../../lib/admin-auth';

// Predefined customer segments based on behavior
export const GET: APIRoute = async ({ cookies }) => {
  const authResult = await verifyAdminAuth({ request: new Request('http://localhost'), cookies });
  if (!authResult.success) return createErrorResponse(authResult.error || 'Unauthorized', authResult.status);
  if (!requireRole(authResult.admin, 'admin')) return createErrorResponse('Admin access required', 403);

  if (!supabase) return createSuccessResponse({ groups: [] });

  try {
    const { data: orders } = await supabase.from('orders').select('user_email, total, status, created_at');
    const emailMap = new Map();
    (orders || []).forEach(o => {
      const email = o.user_email || '';
      if (!emailMap.has(email)) emailMap.set(email, { email, orders: [], total_spent: 0 });
      const c = emailMap.get(email);
      c.orders.push(o);
      c.total_spent += o.total || 0;
    });

    const groups = [
      { id: 'new_customers', label: 'New Customers', description: '0-1 orders', color: '#39FF14', count: 0 },
      { id: 'returning_customers', label: 'Returning Customers', description: '2-5 orders', color: '#FFE600', count: 0 },
      { id: 'vip_customers', label: 'VIP Customers', description: '6+ orders', color: '#FF007F', count: 0 },
      { id: 'high_spenders', label: 'High Spenders', description: 'Total spent > Rp 1,000,000', color: '#9B59B6', count: 0 },
      { id: 'inactive', label: 'Inactive', description: 'No orders in 30+ days', color: '#95A5A6', count: 0 },
      { id: 'at_risk', label: 'At Risk', description: 'Last order 15-30 days ago', color: '#E74C3C', count: 0 },
    ];

    emailMap.forEach(c => {
      const count = c.orders.length;
      if (count <= 1) groups[0].count++;
      else if (count <= 5) groups[1].count++;
      else groups[2].count++;
      if (c.total_spent >= 1000000) groups[3].count++;

      const lastOrder = c.orders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
      const daysSinceLastOrder = lastOrder ? Math.floor((Date.now() - new Date(lastOrder.created_at).getTime()) / 86400000) : 999;
      if (daysSinceLastOrder > 30) groups[4].count++;
      else if (daysSinceLastOrder > 15) groups[5].count++;
    });

    return createSuccessResponse({ groups, total_customers: emailMap.size });
  } catch (err) {
    return createErrorResponse('Failed to compute customer groups', 500);
  }
};
