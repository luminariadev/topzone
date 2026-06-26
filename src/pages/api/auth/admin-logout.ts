// src/pages/api/auth/admin-logout.ts
// Admin logout - clear session cookies
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ cookies }) => {
  cookies.delete('sb-admin-token', { path: '/' });
  cookies.delete('sb-admin-refresh', { path: '/' });
  cookies.delete('sb-admin-role', { path: '/' });
  return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
};
