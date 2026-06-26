// src/pages/api/checkout/stock.ts
// Server-side stock validation
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { items } = body;
    if (!items || !Array.isArray(items)) {
      return new Response(JSON.stringify({ error: 'Invalid items' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    // In production: query Supabase for real stock
    // For now, simulate stock validation
    const results = items.map((item: { id?: string; name?: string; qty?: number }) => ({
      id: item.id || 'unknown',
      name: item.name || 'unknown',
      requested: item.qty || 0,
      available: true,
      stock: 999,
    }));

    const allAvailable = results.every((r: { available: boolean }) => r.available);
    return new Response(JSON.stringify({ success: true, allAvailable, results }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('Stock validation error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
