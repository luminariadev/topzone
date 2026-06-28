// src/pages/api/auth/refresh.ts
// JWT token refresh endpoint
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const POST: APIRoute = async ({ cookies }) => {
  if (!supabase) {
    return new Response(JSON.stringify({ error: 'Supabase not configured' }), { status: 503, headers: { 'Content-Type': 'application/json' } });
  }

  const refreshToken = cookies.get('sb-refresh-token')?.value;
  if (!refreshToken) {
    return new Response(JSON.stringify({ error: 'No refresh token' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken });
    if (error || !data.session) {
      return new Response(JSON.stringify({ error: 'Failed to refresh session' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    // Set new tokens in cookies
    cookies.set('sb-auth-token', data.session.access_token, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 7, sameSite: 'lax' });
    cookies.set('sb-refresh-token', data.session.refresh_token, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 30, sameSite: 'lax' });

    return new Response(JSON.stringify({ success: true, user: data.session.user }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Token refresh failed' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
