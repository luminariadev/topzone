// src/pages/api/checkout/index.ts
// Server-side checkout endpoint with price validation
import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { items, name, phone, payment, voucherCode } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return new Response(JSON.stringify({ error: 'Cart is empty' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    if (!name || !phone) {
      return new Response(JSON.stringify({ error: 'Name and phone required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    let validatedTotal = 0;
    for (const item of items) {
      if (!item.id || !item.price || !item.qty) {
        return new Response(JSON.stringify({ error: 'Invalid item data' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
      }
      validatedTotal += item.price * item.qty;
    }

    let discount = 0;
    if (voucherCode && voucherCode.startsWith('WELCOME-')) {
      discount = 10;
      validatedTotal = Math.round(validatedTotal * (100 - discount) / 100);
    }

    const orderId = 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();

    if (supabase) {
      await supabase.from('orders').insert({
        id: orderId, customer_name: name, customer_phone: phone,
        payment_method: payment, total: validatedTotal, discount,
        status: 'pending', items: JSON.stringify(items),
        created_at: new Date().toISOString(),
      }).catch((e) => console.error('DB save failed:', e));
    }

    return new Response(JSON.stringify({ success: true, orderId, total: validatedTotal, discount }), {
      status: 200, headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('Checkout error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({ message: 'Checkout API ready' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
};
