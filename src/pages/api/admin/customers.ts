// src/pages/api/admin/customers.ts
// Admin customers list API with search, filtering, sorting, and aggregated stats
export const prerender = false;
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { verifyAdminAuth, createSuccessResponse, createErrorResponse, requireRole } from '../../../lib/admin-auth';

export const GET: APIRoute = async ({ url, cookies }) => {
  const authResult = await verifyAdminAuth({ request: new Request('http://localhost'), cookies });
  if (!authResult.success) return createErrorResponse(authResult.error || 'Unauthorized', authResult.status);
  if (!requireRole(authResult.admin, 'staff')) return createErrorResponse('Admin access required', 403);
  if (!supabase) return createSuccessResponse({ customers: [], total: 0 });

  const search = url.searchParams.get('search') || '';
  const sort = url.searchParams.get('sort') || 'total_spent';
  const order = url.searchParams.get('order') || 'desc';
  const tierFilter = url.searchParams.get('tier') || '';
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '100'), 500);
  const offset = parseInt(url.searchParams.get('offset') || '0');

  try {
    const { data: orders } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    const { data: userPoints } = await supabase.from('user_points').select('*');

    const pointsMap = new Map((userPoints || []).map(p => [p.user_email, p]));

    const customerMap = new Map();
    (orders || []).forEach(o => {
      const email = o.user_email || o.customer_email;
      if (!email) return;
      if (!customerMap.has(email)) {
        customerMap.set(email, { email, name: o.customer_name || '', total_orders: 0, total_spent: 0, last_order: o.created_at });
      }
      const c = customerMap.get(email);
      c.total_orders++;
      c.total_spent += (o.total || 0);
      if (o.created_at > (c.last_order || '')) c.last_order = o.created_at;
    });

    let customers = Array.from(customerMap.values()).map(c => {
      const p = pointsMap.get(c.email);
      const totalSpent = c.total_spent;
      let tierName = p?.tier || 'bronze';
      if (!p) {
        if (totalSpent >= 10000000) tierName = 'platinum';
        else if (totalSpent >= 5000000) tierName = 'gold';
        else if (totalSpent >= 1000000) tierName = 'silver';
      }
      return { ...c, avg_order: c.total_orders > 0 ? Math.round(totalSpent / c.total_orders) : 0, points: p?.total_points || 0, tier: tierName };
    });

    if (search) {
      const q = search.toLowerCase();
      customers = customers.filter(c => (c.email || '').toLowerCase().includes(q) || (c.name || '').toLowerCase().includes(q));
    }
    if (tierFilter) customers = customers.filter(c => c.tier === tierFilter);

    const sortDir = order === 'asc' ? 1 : -1;
    if (sort === 'name') customers.sort((a, b) => (a.name || '').localeCompare(b.name || '') * sortDir);
    else if (sort === 'total_orders') customers.sort((a, b) => (a.total_orders - b.total_orders) * sortDir);
    else if (sort === 'tier') customers.sort((a, b) => (a.tier || '').localeCompare(b.tier || '') * sortDir);
    else customers.sort((a, b) => (a.total_spent - b.total_spent) * sortDir);

    const total = customers.length;
    const paginated = customers.slice(offset, offset + limit);

    return createSuccessResponse({ customers: paginated, total });
  } catch (error) {
    console.error('Customers API error:', error);
    return createErrorResponse('Internal server error', 500);
  }
};