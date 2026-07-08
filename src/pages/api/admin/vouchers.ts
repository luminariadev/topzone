// src/pages/api/admin/vouchers.ts
// Admin voucher management API
export const prerender = false;
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { verifyAdminAuth, createSuccessResponse, createErrorResponse, requireRole } from '../../../lib/admin-auth';

export const GET: APIRoute = async ({ cookies }) => {
  const authResult = await verifyAdminAuth({ request: new Request('http://localhost'), cookies });
  if (!authResult.success) return createErrorResponse(authResult.error || 'Unauthorized', authResult.status);

  if (!supabase) return createSuccessResponse({ vouchers: [] });
  const { data } = await supabase.from('vouchers').select('*').order('created_at', { ascending: false });
  return createSuccessResponse({ vouchers: data || [] });
};

export const POST: APIRoute = async ({ request, cookies }) => {
  const authResult = await verifyAdminAuth({ request: new Request('http://localhost'), cookies });
  if (!authResult.success) return createErrorResponse(authResult.error || 'Unauthorized', authResult.status);
  if (!requireRole(authResult.admin, 'admin')) return createErrorResponse('Admin access required', 403);

  const v = await request.json();
  if (!v.code || !v.discount) return createErrorResponse('code and discount required', 400);
  if (supabase) {
    const { data, error } = await supabase.from('vouchers').insert({
      code: v.code.toUpperCase(), discount: v.discount, discount_type: v.discount_type || 'percentage',
      min_purchase: v.min_purchase || 0, max_uses: v.max_uses || null, used_count: 0,
      expires_at: v.expires_at || null, is_active: v.is_active !== false,
      created_at: new Date().toISOString(),
    }).select().single();
    if (error) return createErrorResponse(error.message, 500);
    return createSuccessResponse({ voucher: data }, 201);
  }
  return createSuccessResponse({ voucher: v }, 201);
};

export const PUT: APIRoute = async ({ request, cookies }) => {
  const authResult = await verifyAdminAuth({ request: new Request('http://localhost'), cookies });
  if (!authResult.success) return createErrorResponse(authResult.error || 'Unauthorized', authResult.status);
  if (!requireRole(authResult.admin, 'admin')) return createErrorResponse('Admin access required', 403);

  const v = await request.json();
  if (!v.id) return createErrorResponse('id required', 400);
  if (supabase) {
    const update: Record<string, unknown> = {};
    if (v.code) update.code = v.code.toUpperCase();
    if (v.discount !== undefined) update.discount = v.discount;
    if (v.discount_type) update.discount_type = v.discount_type;
    if (v.min_purchase !== undefined) update.min_purchase = v.min_purchase;
    if (v.max_uses !== undefined) update.max_uses = v.max_uses;
    if (v.is_active !== undefined) update.is_active = v.is_active;
    if (v.expires_at !== undefined) update.expires_at = v.expires_at;
    const { error } = await supabase.from('vouchers').update(update).eq('id', v.id);
    if (error) return createErrorResponse(error.message, 500);
  }
  return createSuccessResponse({ success: true });
};

export const DELETE: APIRoute = async ({ url, cookies }) => {
  const authResult = await verifyAdminAuth({ request: new Request('http://localhost'), cookies });
  if (!authResult.success) return createErrorResponse(authResult.error || 'Unauthorized', authResult.status);
  if (!requireRole(authResult.admin, 'super_admin')) return createErrorResponse('Super Admin access required', 403);

  const id = url.searchParams.get('id');
  if (!id) return createErrorResponse('id required', 400);
  if (supabase) {
    const { error } = await supabase.from('vouchers').update({ is_active: false }).eq('id', id);
    if (error) return createErrorResponse(error.message, 500);
  }
  return createSuccessResponse({ success: true });
};
