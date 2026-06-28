// src/pages/api/admin/orders.ts
// Admin orders management API
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { verifyAdminAuth, createSuccessResponse, createErrorResponse } from '../../../lib/admin-auth';

export const GET: APIRoute = async ({ url, cookies }) => {
  const authResult = await verifyAdminAuth({ request: new Request('http://localhost'), cookies });
  if (!authResult.success) {
    return createErrorResponse('Not authenticated', authResult.status || 401);
  }

  const status = url.searchParams.get('status');
  const limit = parseInt(url.searchParams.get('limit') || '50');
  const offset = parseInt(url.searchParams.get('offset') || '0');

  if (!supabase) return createSuccessResponse({ orders: [] });

  let query = supabase
    .from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (status) query = query.eq('status', status);
  const { data, error } = await query;
  if (error) return createErrorResponse(error.message, 500);
  const { count } = await supabase.from('orders').select('*', { count: 'exact', head: true });
  return createSuccessResponse({ orders: data || [], total: count || 0 });
};

export const PUT: APIRoute = async ({ request, cookies }) => {
  const authResult = await verifyAdminAuth({ request: new Request('http://localhost'), cookies });
  if (!authResult.success) {
    return createErrorResponse('Not authenticated', authResult.status || 401);
  }

  const { order_id, status } = await request.json();
  if (!order_id || !status) return createErrorResponse('order_id and status required', 400);

  const valid = ['pending', 'processing', 'completed', 'cancelled'];
  if (!valid.includes(status)) return createErrorResponse('Invalid status', 400);

  if (supabase) {
    const { error } = await supabase.from('orders').update({ status, updated_at: new Date().toISOString() }).eq('id', order_id);
    if (error) return createErrorResponse(error.message, 500);
  }
  return createSuccessResponse({ success: true });
};

export const DELETE: APIRoute = async ({ url, cookies }) => {
  const authResult = await verifyAdminAuth({ request: new Request('http://localhost'), cookies });
  if (!authResult.success) {
    return createErrorResponse('Not authenticated', authResult.status || 401);
  }

  const orderId = url.searchParams.get('id');
  if (!orderId) return createErrorResponse('id required', 400);
  if (supabase) {
    const { error } = await supabase.from('orders').update({ status: 'cancelled', updated_at: new Date().toISOString() }).eq('id', orderId);
    if (error) return createErrorResponse(error.message, 500);
  }
  return createSuccessResponse({ success: true });
};
