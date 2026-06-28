// src/pages/api/admin/reports.ts
// Admin reports & analytics API
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const GET: APIRoute = async ({ url }) => {
  if (!supabase) return new Response(JSON.stringify({ stats: null }), { status: 200, headers: { 'Content-Type': 'application/json' } });

  const period = url.searchParams.get('period') || 'all'; // today, week, month, all

  let dateFilter = '';
  const now = new Date();
  if (period === 'today') {
    dateFilter = now.toISOString().slice(0, 10);
  } else if (period === 'week') {
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    dateFilter = weekAgo;
  } else if (period === 'month') {
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
    dateFilter = monthAgo;
  }

  try {
    // Total orders
    let orderQuery = supabase.from('orders').select('*', { count: 'exact', head: true });
    let revenueQuery = supabase.from('orders').select('total');
    let statusQuery = supabase.from('orders').select('status');

    if (dateFilter) {
      const op = period === 'today' ? 'gte' : 'gte';
      orderQuery = orderQuery[op]('created_at', dateFilter);
      revenueQuery = revenueQuery[op]('created_at', dateFilter);
      statusQuery = statusQuery[op]('created_at', dateFilter);
    }

    const { count: totalOrders } = await orderQuery;
    const { data: revenueData } = await revenueQuery;
    const { data: statusData } = await statusQuery;

    const totalRevenue = (revenueData || []).reduce((sum: number, o: { total?: number }) => sum + (o.total || 0), 0);
    const statusCounts = (statusData || []).reduce((acc: Record<string, number>, o: { status?: string }) => {
      acc[o.status || 'unknown'] = (acc[o.status || 'unknown'] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Get recent orders for chart data
    const recentQuery = supabase
      .from('orders')
      .select('created_at, total')
      .order('created_at', { ascending: true })
      .limit(30);

    if (dateFilter) recentQuery.gte('created_at', dateFilter);
    const { data: chartData } = await recentQuery;

    // Product counts
    const { count: totalGames } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('type', 'game').neq('is_deleted', true);
    const { count: totalGears } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('type', 'gear').neq('is_deleted', true);

    return new Response(JSON.stringify({
      stats: {
        totalOrders: totalOrders || 0,
        totalRevenue,
        totalGames: totalGames || 0,
        totalGears: totalGears || 0,
        statusCounts,
        chartData: chartData || [],
      }
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('Reports error:', err);
    return new Response(JSON.stringify({ error: 'Internal error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};

export const POST: APIRoute = async () => {
  // CSV export
  if (!supabase) return new Response(JSON.stringify({ error: 'Supabase not configured' }), { status: 503 });

  const { data: orders } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false });

  if (!orders || orders.length === 0) {
    return new Response(JSON.stringify({ error: 'No data' }), { status: 404 });
  }

  const csv = '﻿ID Order,Pelanggan,Email,Total Items,Total Harga,Status,Pembayaran,Tanggal\n' +
    orders.map((o: { id?: string; customer_name?: string; customer_email?: string; order_items?: unknown[]; total?: number; status?: string; payment_method?: string; created_at?: string }) =>
      `${o.id || ''},${(o.customer_name || '').replace(/,/g, ' ')},${o.customer_email || ''},${(o.order_items || []).length},${o.total || 0},${o.status || ''},${o.payment_method || ''},${o.created_at || ''}`
    ).join('\n');

  return new Response(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="topzone-report-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
};
