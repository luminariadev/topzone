// src/pages/api/checkout/validate-voucher.ts
// Server-side voucher validation endpoint with Supabase + fallback (Fase 3.4 item 3)
export const prerender = false;
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { z } from 'zod';

const voucherSchema = z.object({
  code: z.string().min(1).max(50),
  subtotal: z.number().min(0),
  userId: z.string().optional(),
});

const BUILTIN_VOUCHERS = {
  WELCOME10: { type: 'percentage', discount: 10, minPurchase: 50000, maxDiscount: 25000 },
  TOPZONE20: { type: 'percentage', discount: 20, minPurchase: 100000, maxDiscount: 50000 },
  HEMAT50K: { type: 'fixed', discount: 50000, minPurchase: 200000, maxDiscount: null },
};

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  const parsed = voucherSchema.safeParse(body);

  if (!parsed.success) {
    return new Response(JSON.stringify({ valid: false, error: 'Data tidak valid' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  const { code, subtotal } = parsed.data;
  const voucherCode = code.toUpperCase();

  // 1. Try Supabase database vouchers first
  if (supabase) {
    const { data: dbVoucher, error: dbError } = await supabase
      .from('vouchers')
      .select('*')
      .eq('code', voucherCode)
      .eq('is_active', true)
      .single();

    if (!dbError && dbVoucher) {
      if (dbVoucher.max_uses && dbVoucher.used_count >= dbVoucher.max_uses) {
        return new Response(JSON.stringify({ valid: false, error: 'Batas penggunaan voucher tercapai' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
      }
      if (dbVoucher.expires_at && new Date(dbVoucher.expires_at) < new Date()) {
        return new Response(JSON.stringify({ valid: false, error: 'Voucher sudah kedaluwarsa' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
      }
      if (subtotal < (dbVoucher.min_purchase || 0)) {
        return new Response(JSON.stringify({ valid: false, error: 'Min. belanja Rp ' + (dbVoucher.min_purchase || 0).toLocaleString('id-ID') }), { status: 400, headers: { 'Content-Type': 'application/json' } });
      }
      let discountAmount = 0;
      if (dbVoucher.type === 'percentage') {
        discountAmount = Math.round(subtotal * dbVoucher.discount / 100);
        if (dbVoucher.max_discount && discountAmount > dbVoucher.max_discount) discountAmount = dbVoucher.max_discount;
      } else {
        discountAmount = dbVoucher.discount;
      }
      return new Response(JSON.stringify({
        valid: true, code: voucherCode, type: dbVoucher.type,
        discountPercent: dbVoucher.type === 'percentage' ? dbVoucher.discount : null,
        discountAmount, finalTotal: subtotal - discountAmount,
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
  }

  // 2. Fallback to hardcoded vouchers
  const voucher = BUILTIN_VOUCHERS[voucherCode];
  if (!voucher) {
    return new Response(JSON.stringify({ valid: false, error: 'Voucher tidak ditemukan' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
  }
  if (subtotal < voucher.minPurchase) {
    return new Response(JSON.stringify({ valid: false, error: 'Min. belanja Rp ' + voucher.minPurchase.toLocaleString('id-ID') }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }
  let discount = 0;
  if (voucher.type === 'percentage') {
    discount = Math.round(subtotal * voucher.discount / 100);
    if (voucher.maxDiscount && discount > voucher.maxDiscount) discount = voucher.maxDiscount;
  } else {
    discount = voucher.discount;
  }
  return new Response(JSON.stringify({
    valid: true, code: voucherCode, type: voucher.type,
    discountPercent: voucher.type === 'percentage' ? voucher.discount : null,
    discountAmount: discount, finalTotal: subtotal - discount,
  }), { status: 200, headers: { 'Content-Type': 'application/json' } });
};
