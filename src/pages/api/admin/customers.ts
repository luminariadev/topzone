// src/pages/api/admin/customers.ts
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const GET: APIRoute = async ({ request }) => {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    // Verify admin
    const { data: adminCheck } = await supabase.from('admins').select('email').eq('email', user.email).single();
    if (!adminCheck) {
      return new Response(JSON.stringify({ error: 'Admin access required' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
    }

    // Get all orders
    const { data: orders } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    const { data: userPoints } = await supabase.from('user_points').select('*');

    const pointsMap = new Map((userPoints || []).map(p => [p.user_email, p]));

    // Aggregate per customer
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

    return new Response(JSON.stringify({ customers }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Customers API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    });
  }
};