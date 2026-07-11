// src/pages/api/admin/export-report.ts
// Admin report export endpoint - JSON report for dashboard stats
export const prerender = false;
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { verifyAdminAuth, createErrorResponse, createSuccessResponse } from '../../../lib/admin-auth';

export const GET: APIRoute = async ({ url, cookies }) => {
  const authResult = await verifyAdminAuth({ request: new Request('http://localhost'), cookies });
  if (!authResult.success || !authResult.admin) return createErrorResponse(authResult.error || 'Unauthorized', authResult.status);
  if (!supabase) return createErrorResponse('Supabase not configured', 503);

  const period = url.searchParams.get('period') || 'month';
  const format = url.searchParams.get('format') || 'json';

  try {
    const now = new Date();
    let dateFrom: string;
    switch (period) {
      case 'today': dateFrom = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString(); break;
      case 'week': dateFrom = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(); break;
      case 'month': dateFrom = new Date(now.getFullYear(), now.getMonth(), 1).toISOString(); break;
      case 'quarter': dateFrom = new Date(now.getFullYear(), now.getMonth() - 2, 1).toISOString(); break;
      case 'year': dateFrom = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()).toISOString(); break;
      default: dateFrom = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    }

    // Fetch orders
    const { data: orders } = await supabase
      .from('orders')
      .select('*')
      .gte('created_at', dateFrom)
      .order('created_at', { ascending: true });

    // Get products count
    const { data: games } = await supabase.from('products').select('id').eq('type', 'game').neq('is_deleted', true);
    const { data: gears } = await supabase.from('products').select('id').eq('type', 'gear').neq('is_deleted', true);

    const safeOrders = orders || [];
    const totalRevenue = safeOrders.reduce((s, o) => s + (o.total || 0), 0);
    const dailyData = new Map<string, { revenue: number; orders: number }>();
    safeOrders.forEach(o => {
      const day = (o.created_at || '').slice(0, 10);
      if (!day) return;
      const cur = dailyData.get(day) || { revenue: 0, orders: 0 };
      cur.revenue += o.total || 0;
      cur.orders += 1;
      dailyData.set(day, cur);
    });

    const dailyChart = Array.from(dailyData.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, d]) => ({ date, revenue: d.revenue, orders: d.orders }));

    const report = {
      generated_at: new Date().toISOString(),
      period,
      summary: {
        total_orders: safeOrders.length,
        total_revenue: totalRevenue,
        avg_order_value: safeOrders.length > 0 ? Math.round(totalRevenue / safeOrders.length) : 0,
        total_games: games?.length || 0,
        total_gears: gears?.length || 0,
        pending_orders: safeOrders.filter(o => o.status === 'pending').length,
        completed_orders: safeOrders.filter(o => o.status === 'completed').length,
        cancelled_orders: safeOrders.filter(o => o.status === 'cancelled').length,
      },
      daily_chart: dailyChart,
      recent_orders: safeOrders.slice(-20).reverse().map(o => ({
        id: o.id, customer: o.customer_name || o.user_email, total: o.total,
        status: o.status, created_at: o.created_at,
      })),
    };

    if (format === 'csv') {
      const csv = [
        'Date,Orders,Revenue',
        ...dailyChart.map(d => `${d.date},${d.orders},${d.revenue}`),
        '',
        `Total Orders,${report.summary.total_orders}`,
        `Total Revenue,,${report.summary.total_revenue}`,
        `Avg Order Value,,${report.summary.avg_order_value}`,
      ].join('\n');
      return new Response(csv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="topzone-report-${period}-${now.toISOString().slice(0, 10)}.csv"`,
        },
      });
    }

    return createSuccessResponse({ report });
  } catch (err) {
    console.error('[export-report] Error:', err);
    return createErrorResponse('Failed to generate report', 500);
  }
};