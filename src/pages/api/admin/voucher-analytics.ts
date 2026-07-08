// src/pages/api/admin/voucher-analytics.ts
export const prerender = false;
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { verifyAdminAuth, createSuccessResponse, createErrorResponse, requireRole } from '../../../lib/admin-auth';

export const GET: APIRoute = async ({ cookies }) => {
  const authResult = await verifyAdminAuth({ request: new Request('http://localhost'), cookies });
  if (!authResult.success) return createErrorResponse(authResult.error || 'Unauthorized', authResult.status);
  if (!requireRole(authResult.admin, 'admin')) return createErrorResponse('Admin access required', 403);
  if (!supabase) return createSuccessResponse({ vouchers: [], summary: {} });

  try {
    const { data: vouchers, error: vError } = await supabase.from('vouchers').select('*').order('created_at', { ascending: false });
    if (vError) return createErrorResponse(vError.message, 500);

    const { data: usageStats } = await supabase.from('user_vouchers').select('voucher_id, is_used, created_at, used_at');
    const { data: ordersWithVouchers } = await supabase.from('orders').select('id, total, created_at, voucher_code, voucher_discount').not('voucher_code', 'is', null);

    const analytics = (vouchers || []).map(voucher => {
      const claims = (usageStats || []).filter(uv => uv.voucher_id === voucher.id);
      const completedClaims = claims.filter(c => c.is_used);
      const usedOrders = (ordersWithVouchers || []).filter(o => o.voucher_code === voucher.code);
      const totalDiscount = usedOrders.reduce((sum, o) => sum + (o.voucher_discount || 0), 0);
      const totalRevenue = usedOrders.reduce((sum, o) => sum + (o.total || 0), 0);

      return {
        id: voucher.id, code: voucher.code, discount: voucher.discount,
        min_purchase: voucher.min_purchase || 0, max_uses: voucher.max_uses,
        used_count: voucher.used_count || 0, is_active: voucher.is_active,
        expires_at: voucher.expires_at, created_at: voucher.created_at,
        claims: claims.length, completed_claims: completedClaims.length,
        usage_rate: claims.length > 0 ? (completedClaims.length / claims.length * 100).toFixed(1) : 0,
        orders_using: usedOrders.length, total_discount_given: totalDiscount,
        total_revenue_from: totalRevenue,
        avg_order_value: usedOrders.length > 0 ? Math.round(totalRevenue / usedOrders.length) : 0,
      };
    });

    const totalVouchers = vouchers?.length || 0;
    const activeVouchers = vouchers?.filter(v => v.is_active).length || 0;
    const totalClaims = usageStats?.length || 0;
    const totalCompleted = usageStats?.filter(u => u.is_used).length || 0;
    const totalDiscount = ordersWithVouchers?.reduce((sum, o) => sum + (o.voucher_discount || 0), 0) || 0;
    const totalRevenue = ordersWithVouchers?.reduce((sum, o) => sum + (o.total || 0), 0) || 0;

    return createSuccessResponse({
      vouchers: analytics,
      summary: {
        total_vouchers: totalVouchers, active_vouchers: activeVouchers,
        total_claims: totalClaims, total_completed: totalCompleted,
        overall_usage_rate: totalClaims > 0 ? (totalCompleted / totalClaims * 100).toFixed(1) : 0,
        total_discount_given: totalDiscount, total_revenue_with_vouchers: totalRevenue,
      }
    });
  } catch (error) {
    console.error('Voucher analytics API error:', error);
    return createErrorResponse('Internal server error', 500);
  }
};