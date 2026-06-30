// src/pages/api/checkout/snap.ts
// Create Midtrans Snap transaction — Zod-validated
export const prerender = false;
import type { APIRoute } from 'astro';
import { z } from 'zod';

const CustomerSchema = z.object({
  name: z.string().min(1, 'Customer name required'),
  email: z.string().email('Invalid email').optional(),
  phone: z.string().min(8, 'Valid phone required'),
});

const SnapSchema = z.object({
  orderId: z.string().min(1, 'Order ID required'),
  total: z.number().positive('Total must be positive'),
  customer: CustomerSchema,
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const parsed = SnapSchema.safeParse(body);

    if (!parsed.success) {
      const message = parsed.error.issues.map(i => i.message).join('; ');
      return new Response(JSON.stringify({ error: message }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const { orderId, total, customer } = parsed.data;

    const serverKey = import.meta.env.MIDTRANS_SERVER_KEY;
    const isProduction = import.meta.env.MIDTRANS_PRODUCTION === 'true';

    if (!serverKey) {
      return new Response(JSON.stringify({ error: 'Midtrans not configured' }), { status: 503, headers: { 'Content-Type': 'application/json' } });
    }

    const baseUrl = isProduction ? 'https://api.midtrans.com' : 'https://api.sandbox.midtrans.com';

    const response = await fetch(`${baseUrl}/v1/payment-links`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(serverKey + ':'),
      },
      body: JSON.stringify({
        transaction_details: {
          order_id: orderId,
          gross_amount: total,
        },
        customer: {
          first_name: customer.name,
          phone: customer.phone,
          email: customer.email,
        },
        payment_link: {
          custom_expiry: {
            duration: 1,
            unit: 'hours',
          },
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Midtrans API error:', data);
      return new Response(JSON.stringify({ error: data.message || 'Payment link creation failed' }), { status: response.status, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ success: true, token: data.token, redirect_url: data.payment_url }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('Snap creation error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
