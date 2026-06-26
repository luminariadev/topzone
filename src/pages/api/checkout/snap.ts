// src/pages/api/checkout/snap.ts
// Create Midtrans Snap transaction
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { orderId, total, customer } = body;

    if (!orderId || !total || !customer) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

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
