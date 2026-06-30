// src/pages/api/webhook/midtrans.ts
// Midtrans payment webhook handler
export const prerender = false;
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

/**
 * Verify Midtrans HMAC SHA-512 signature.
 * Returns true when the expected signature matches the header.
 */
function verifySignature(request: Request, payload: any): boolean {
  // In development we skip verification for easier testing.
  if (!import.meta.env.PROD) return true;

  const signatureHeader = request.headers.get('x-midtrans-signature');
  if (!signatureHeader) return false;

  const secret = import.meta.env.MIDTRANS_SERVER_KEY ?? '';
  if (!secret) return false;

  const expected = crypto.createHmac('sha512', secret)
    .update(JSON.stringify(payload))
    .digest('hex');

  return signatureHeader === expected;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const notification = await request.json();
    const { order_id, transaction_status, fraud_status, payment_type, gross_amount } = notification;

    // Verify signature - reject if invalid.
    if (!verifySignature(request, notification)) {
      return new Response(JSON.stringify({ error: 'Invalid signature' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let newStatus = 'pending';
    switch (transaction_status) {
      case 'capture':
      case 'settlement':
        newStatus = fraud_status === 'challenge' ? 'pending' : 'completed';
        break;
      case 'pending':
        newStatus = 'pending';
        break;
      case 'deny':
      case 'cancel':
      case 'expire':
        newStatus = 'cancelled';
        break;
      default:
        newStatus = 'pending';
    }

    if (supabase) {
      await supabase.from('orders').update({ status: newStatus, updated_at: new Date().toISOString() }).eq('id', order_id);
      await supabase.from('transactions').insert({
        order_id,
        midtrans_transaction_id: notification.transaction_id,
        payment_type,
        gross_amount,
        status: transaction_status,
        fraud_status,
        raw_response: JSON.stringify(notification),
        created_at: new Date().toISOString(),
      });
    }

    return new Response(JSON.stringify({ success: true, status: newStatus }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Webhook error:', err);
    return new Response(JSON.stringify({ error: 'Webhook processing failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({ message: 'Midtrans webhook endpoint ready' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
