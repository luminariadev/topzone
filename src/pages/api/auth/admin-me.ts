// src/pages/api/auth/admin-me.ts
// Get current admin session
import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';

export const GET: APIRoute = async ({ cookies }) => {
  if (!supabase) {
    return new Response(JSON.stringify({ admin: null, error: 'Supabase not configured' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  const token = cookies.get('sb-admin-token')?.value;
  const role = cookies.get('sb-admin-role')?.value;

  if (!token) {
    return new Response(JSON.stringify({ admin: null }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return new Response(JSON.stringify({ admin: null }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    const { data: adminData } = await supabase
      .from('admin_users')
      .select('id, email, full_name, role, is_active')
      .eq('email', user.email)
      .single();

    if (!adminData || !adminData.is_active) {
      return new Response(JSON.stringify({ admin: null }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ admin: { id: adminData.id, email: adminData.email, full_name: adminData.full_name, role: adminData.role } }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch {
    return new Response(JSON.stringify({ admin: null }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }
};
