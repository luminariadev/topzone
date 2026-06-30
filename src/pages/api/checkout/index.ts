// src/pages/api/checkout/index.ts
// Server-side checkout endpoint with Zod-validated input
export const prerender = false;
import type { APIRoute } from 'astro';
import { z } from 'zod';
import { supabase } from '../../../lib/supabase';

// --- Zod schemas for input validation ---
const CheckoutItemSchema = z.object({
  id: z.string().min(1, 'Item id required'),
  name: z.string().min(1, 'Item name required').optional(),
  price: z.number().positive('Price must be positive'),
  qty: z.number().int().positive('Quantity must be positive'),
  img: z.string().optional(),
  type: z.enum(['game', 'gear']).optional(),
});

const CheckoutSchema = z.object({
  items: z.array(CheckoutItemSchema).min(1, 'Cart cannot be empty').max(100, 'Too many items'),
  name: z.string().min(2, 'Name is required').max(100),
  phone: z.string().min(8, 'Valid phone required').max(20).regex(/^[0-9+\-\s()]+$/, 'Invalid phone format'),
  payment: z.enum(['bank', 'ewallet', 'gopay']).default('bank'),
  voucherCode: z.string().max(50).optional(),
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const parsed = CheckoutSchema.safeParse(body);

    if (!parsed.success) {
      const message = parsed.error.issues.map(i => i.message).join('; ');
      return new Response(JSON.stringify({ error: message }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const { items, name, phone, payment, voucherCode } = parsed.data;

    let validatedTotal = 0;
    for (const item of items) {
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
