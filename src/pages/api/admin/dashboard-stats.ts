// src/pages/api/admin/dashboard-stats.ts
// Admin dashboard real-time stats API - comprehensive overview with charts
export const prerender = false;
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { verifyAdminAuth, createSuccessResponse, createErrorResponse } from '../../../lib/admin-auth';

export const GET: APIRoute = async ({ url, cookies }) => {
  const authResult = await verifyAdminAuth({ request: new Request('http://localhost'), cookies });
  if (!authResult.success) {
    return createErrorResponse(authResult.error || 'Unauthorized', authResult.status);
  }

  if (!supabase) return createSuccessResponse({ stats: null });

  const period = url.searchParams.get('period') || 'month';

  try {
    const now = new Date();
    let dateFrom: string | null = null;
    let prevDateFrom: string | null = null;

    if (period === 'today') {
      dateFrom = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      prevDateFrom = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).toISOString();
    } else if (period === 'week') {
      dateFrom = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      prevDateFrom = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString();
    } else if (period === 'month') {
      dateFrom = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      prevDateFrom = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
    } else if (period === 'quarter') {
      dateFrom = new Date(now.getFullYear(), now.getMonth() - 2, 1).toISOString();
      prevDateFrom = new Date(now.getFullYear(), now.getMonth() - 5, 1).toISOString();
    } else if (period === 'year') {
      dateFrom = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()).toISOString();
      prevDateFrom = new Date(now.getFullYear() - 2, now.getMonth(), now.getDate()).toISOString();
    }

    const baseQuery = supabase.from('orders').select('id, total, status, user_email, customer_name, created_at, updated_at');

    // Current period orders
    let curQ = baseQuery;
    if (dateFrom) curQ = curQ.gte('created_at', dateFrom);
    const { data: currentOrders, error: ordersErr } = await curQ;
    if (ordersErr) throw new Error(ordersErr.message);

    // Previous period orders (for trends)
    let prevQ = supabase.from('orders').select('id, total, status, created_at');
    if (prevDateFrom) prevQ = prevQ.gte('created_at', prevDateFrom);
    if (dateFrom) prevQ = prevQ.lt('created_at', dateFrom);
    const { data: prevOrders } = await prevQ;

    const totalOrders = (currentOrders || []).length;
    const totalRevenue = (currentOrders || []).reduce((sum, o) => sum + (o.total || 0), 0);
    const pendingOrders = (currentOrders || []).filter(o => o.status === 'pending').length;
    const completedOrders = (currentOrders || []).filter(o => o.status === 'completed').length;
    const processingOrders = (currentOrders || []).filter(o => o.status === 'processing').length;
    const cancelledOrders = (currentOrders || []).filter(o => o.status === 'cancelled').length;

    const prevTotalOrders = (prevOrders || []).length;
    const prevTotalRevenue = (prevOrders || []).reduce((sum, o) => sum + (o.total || 0), 0);

    const ordersTrend = prevTotalOrders > 0
      ? Math.round(((totalOrders - prevTotalOrders) / prevTotalOrders) * 100)
      : totalOrders > 0 ? 100 : 0;
    const revenueTrend = prevTotalRevenue > 0
      ? Math.round(((totalRevenue - prevTotalRevenue) / prevTotalRevenue) * 100)
      : totalRevenue > 0 ? 100 : 0;

    const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
    const uniqueEmails = new Set((currentOrders || []).map(o => o.user_email || o.customer_name));
    const totalCustomers = uniqueEmails.size;

    const { count: totalGames } = await supabase
      .from('products').select('*', { count: 'exact', head: true })
      .eq('type', 'game').neq('is_deleted', true);
    const { count: totalGears } = await supabase
      .from('products').select('*', { count: 'exact', head: true })
      .eq('type', 'gear').neq('is_deleted', true);

    // Daily revenue chart data (last 30 days)
    const dailyChart: Array<{ date: string; revenue: number; orders: number }> = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayStr = d.toISOString().slice(0, 10);
      const dayOrders = (currentOrders || []).filter(o => o.created_at && o.created_at.slice(0, 10) === dayStr);
      dailyChart.push({
        date: dayStr,
        revenue: dayOrders.reduce((s, o) => s + (o.total || 0), 0),
        orders: dayOrders.length,
      });
    }

    // Low stock alert count
    let lowStockCount = 0;
    const { data: products } = await supabase.from('products')
      .select('id').eq('status', 'published').neq('is_deleted', true).limit(50);
    if (products) {
      for (const prod of products.slice(0, 30)) {
        const { data: pkgs } = await supabase.from('product_packages')
          .select('stock').eq('product_id', prod.id);
        if (pkgs) lowStockCount += pkgs.filter(p => (p.stock || 0) > 0 && (p.stock || 0) < 5).length;
      }
    }

    // Recent orders (last 5)
    const recentOrders = (currentOrders || [])
      .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
      .slice(0, 5)
      .map(o => ({
        id: o.id,
        customer: o.customer_name || o.user_email || 'Guest',
        total: o.total,
        status: o.status,
        created_at: o.created_at,
      }));

    // Voucher usage this period
    const { count: voucherUsageCount } = await supabase
      .from('user_vouchers')
      .select('*', { count: 'exact', head: true })
      .gte('used_at', dateFrom || '');

    return createSuccessResponse({
      stats: {
        totalOrders,
        totalRevenue,
        pendingOrders,
        completedOrders,
        processingOrders,
        cancelledOrders,
        avgOrderValue,
        totalCustomers,
        totalGames: totalGames || 0,
        totalGears: totalGears || 0,
        ordersTrend,
        revenueTrend,
        lowStockCount,
        voucherUsageCount: voucherUsageCount || 0,
        recentOrders,
        dailyChart,
      },
      period,
    });
  } catch (err) {
    console.error('[dashboard-stats] Error:', err);
    return createErrorResponse('Failed to fetch dashboard stats', 500);
  }
};
