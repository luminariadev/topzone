// src/pages/api/voucher-analytics.ts
// Voucher usage analytics API endpoint for admin reports

import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request, url }) => {
  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  try {
    const { verifyAdminSession } = await import('../../middleware/auth');
    const adminAuth = await verifyAdminSession(request);
    if (!adminAuth) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
    }

    const { supabase } = await import('../../lib/supabase');
    const range = url.searchParams.get('range') || '7d';
    const voucherId = url.searchParams.get('voucherId');

    // Calculate date range
    const now = new Date();
    let startDate: Date;
    switch (range) {
      case '30d': startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); break;
      case '90d': startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000); break;
      case 'all': startDate = new Date('2020-01-01'); break;
      default: startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); break;
    }

    // Base query for voucher usage from orders
    let query = supabase!
      .from('orders')
      .select('id, voucher_code, discount_amount, created_at, total_amount, user_id');

    if (voucherId) {
      query = query.eq('voucher_code', voucherId);
    } else {
      query = query.not('voucher_code', 'is', null);
    }

    const { data: orders, error } = await query
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Analyze voucher usage
    const voucherStatsMap = new Map<string, {
      code: string;
      usageCount: number;
      totalDiscount: number;
      totalRevenue: number;
      uniqueUsers: Set<string>;
      firstUsed: string;
      lastUsed: string;
    }>();

    for (const order of orders || []) {
      if (!order.voucher_code) continue;
      const code = order.voucher_code;
      if (!voucherStatsMap.has(code)) {
        voucherStatsMap.set(code, {
          code,
          usageCount: 0,
          totalDiscount: 0,
          totalRevenue: 0,
          uniqueUsers: new Set(),
          firstUsed: order.created_at,
          lastUsed: order.created_at,
        });
      }
      const stat = voucherStatsMap.get(code)!;
      stat.usageCount++;
      stat.totalDiscount += order.discount_amount || 0;
      stat.totalRevenue += order.total_amount || 0;
      if (order.user_id) stat.uniqueUsers.add(order.user_id);
      if (new Date(order.created_at) < new Date(stat.firstUsed)) stat.firstUsed = order.created_at;
      if (new Date(order.created_at) > new Date(stat.lastUsed)) stat.lastUsed = order.created_at;
    }

    // Convert to array for JSON response
    const voucherAnalytics = Array.from(voucherStatsMap.values()).map(stat => ({
      code: stat.code,
      usageCount: stat.usageCount,
      totalDiscount: stat.totalDiscount,
      totalRevenue: stat.totalRevenue,
      avgDiscountPerUse: stat.usageCount > 0 ? Math.round(stat.totalDiscount / stat.usageCount) : 0,
      uniqueUsers: stat.uniqueUsers.size,
      firstUsed: stat.firstUsed,
      lastUsed: stat.lastUsed,
    }));

    // Overall summary
    const summary = {
      totalVouchersUsed: orders?.length || 0,
      totalDiscountAmount: voucherAnalytics.reduce((s, v) => s + v.totalDiscount, 0),
      totalVoucherRevenue: voucherAnalytics.reduce((s, v) => s + v.totalRevenue, 0),
      uniqueVoucherCodes: voucherAnalytics.length,
      period: range,
      generatedAt: now.toISOString(),
    };

    return new Response(JSON.stringify({ summary, vouchers: voucherAnalytics }), {
      status: 200, headers: corsHeaders,
    });
  } catch (err) {
    console.error('[voucher-analytics] Error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500, headers: corsHeaders,
    });
  }
};

export const OPTIONS: APIRoute = () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};