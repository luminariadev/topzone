// src/pages/api/checkout/status.ts
// Payment status polling endpoint
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ url }) => {
  const orderId = url.searchParams.get('orderId');
  if (!orderId) {
    return new Response(JSON.stringify({ error: 'orderId required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  // In production: query Midtrans or database for order status
  // For now return mock status for testing
  return new Response(JSON.stringify({ orderId, status: 'pending', paymentUrl: '' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
};
