// src/pages/api/auth/admin-login.ts
// Admin login via Supabase Auth with role check
import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!supabase) {
    return new Response(JSON.stringify({ error: 'Supabase not configured' }), { status: 503, headers: { 'Content-Type': 'application/json' } });
  }

  const { email, password } = await request.json();

  if (!email || !password) {
    return new Response(JSON.stringify({ error: 'Email and password required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError || !authData.user) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    // Check if user is in admin_users table
    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .select('id, email, full_name, role, is_active')
      .eq('email', email)
      .single();

    if (adminError || !adminData || !adminData.is_active) {
      await supabase.auth.signOut();
      return new Response(JSON.stringify({ error: 'Not authorized as admin' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
    }

    // Update last_login
    await supabase.from('admin_users').update({ last_login: new Date().toISOString() }).eq('id', adminData.id);

    // Set session cookies
    cookies.set('sb-admin-token', authData.session.access_token, { httpOnly: true, path: '/', maxAge: 60 * 30, sameSite: 'lax' });
    cookies.set('sb-admin-refresh', authData.session.refresh_token, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 7, sameSite: 'lax' });
    cookies.set('sb-admin-role', adminData.role, { httpOnly: true, path: '/', maxAge: 60 * 30, sameSite: 'lax' });

    return new Response(JSON.stringify({
      success: true,
      admin: { id: adminData.id, email: adminData.email, full_name: adminData.full_name, role: adminData.role }
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });

  } catch (err) {
    console.error('Admin login error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
