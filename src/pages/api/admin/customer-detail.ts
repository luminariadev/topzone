// src/pages/api/admin/customer-detail.ts
// Admin customer detail API - get full customer profile with orders, reviews, points
export const prerender = false;
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { verifyAdminAuth, createSuccessResponse, createErrorResponse } from '../../../lib/admin-auth';

export const GET: APIRoute = async ({ url, cookies }) => {
  const authResult = await verifyAdminAuth({ request: new Request('http://localhost'), cookies });
  if (!authResult.success) {
    return createErrorResponse(authResult.error || 'Unauthorized', authResult.status);
  }

  const email = url.searchParams.get('email');
  if (!email) return createErrorResponse('email parameter required', 400);

  if (!supabase) return createSuccessResponse({ customer: null });

  try {
    const { data: orders, error: ordersErr } = await supabase
      .from('orders').select('*, order_items(*)').eq('user_email', email).order('created_at', { ascending: false });
    if (ordersErr) throw new Error(ordersErr.message);

    const { data: reviews } = await supabase
      .from('reviews').select('*').eq('user_email', email).order('created_at', { ascending: false });

    const { data: pointsData } = await supabase
      .from('user_points').select('*').eq('user_email', email).single();

    const { data: vouchers } = await supabase
      .from('user_vouchers').select('*, vouchers(*)').eq('user_email', email).order('created_at', { ascending: false });

    const { data: referrals } = await supabase
      .from('referrals').select('*').eq('referrer_email', email).order('created_at', { ascending: false });

    const { data: addresses } = await supabase
      .from('shipping_addresses').select('*').eq('user_email', email).order('is_default', { ascending: false });

    const totalSpent = (orders || []).reduce((sum, o) => sum + (o.total || 0), 0);
    const totalOrders = (orders || []).length;
    const completedOrders = (orders || []).filter(o => o.status === 'completed').length;
    const pendingOrders = (orders || []).filter(o => o.status === 'pending').length;
    const avgOrderValue = totalOrders > 0 ? Math.round(totalSpent / totalOrders) : 0;

    let tier = 'bronze';
    if (pointsData) tier = pointsData.tier || 'bronze';
    else if (totalSpent >= 10000000) tier = 'platinum';
    else if (totalSpent >= 5000000) tier = 'gold';
    else if (totalSpent >= 1000000) tier = 'silver';

    return createSuccessResponse({
      customer: {
        email,
        totalOrders,
        totalSpent,
        completedOrders,
        pendingOrders,
        avgOrderValue,
        tier,
        points: pointsData?.total_points || 0,
        pointsEarned: pointsData?.total_earned || 0,
        pointsSpent: pointsData?.total_spent || 0,
        orders: (orders || []).slice(0, 20),
        reviews: (reviews || []).slice(0, 10),
        vouchers: (vouchers || []).slice(0, 20),
        referrals: (referrals || []).slice(0, 20),
        addresses: addresses || [],
      }
    });
  } catch (err) {
    console.error('[customer-detail] Error:', err);
    return createErrorResponse('Failed to fetch customer detail', 500);
  }
};