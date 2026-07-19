// src/pages/api/admin/voucher-assign.ts
// POST — assign voucher to specific user(s)
// DELETE — revoke voucher from user
import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const POST: APIRoute = async ({ request }) => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const adminClient = createClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
    { global: { headers: { Authorization: authHeader } } }
  );

  // Verify admin
  const { data: { user }, error: authErr } = await adminClient.auth.getUser();
  if (authErr || !user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const { data: profile } = await adminClient
    .from('admin_profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role === 'kasir') {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  }

  try {
    const body = await request.json();
    const { voucher_id, user_ids, email } = body;

    if (!voucher_id || (!user_ids && !email)) {
      return new Response(JSON.stringify({ error: 'voucher_id + user_ids or email required' }), { status: 400 });
    }

    const client = createClient(
      import.meta.env.PUBLIC_SUPABASE_URL,
      import.meta.env.PUBLIC_SUPABASE_ANON_KEY
    );

    let targetUserIds = user_ids || [];

    // Resolve email to user_id
    if (email) {
      const { data: userData } = await client
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();
      if (userData) targetUserIds.push(userData.id);
    }

    if (targetUserIds.length === 0) {
      return new Response(JSON.stringify({ error: 'No valid user found' }), { status: 404 });
    }

    // Check voucher exists
    const { data: voucher } = await client
      .from('vouchers')
      .select('id, code, discount, type, min_purchase, max_uses, used_count, expires_at')
      .eq('id', voucher_id)
      .single();

    if (!voucher) {
      return new Response(JSON.stringify({ error: 'Voucher tidak ditemukan' }), { status: 404 });
    }

    // Check usage limit
    if (voucher.max_uses > 0 && voucher.used_count >= voucher.max_uses) {
      return new Response(JSON.stringify({ error: 'Voucher sudah habis terpakai' }), { status: 400 });
    }

    // Insert user-voucher assignments
    const assignments = targetUserIds.map((uid: string) => ({
      voucher_id,
      user_id: uid,
      assigned_by: user.id,
      status: 'active',
    }));

    const { data, error: insertErr } = await client
      .from('user_vouchers')
      .insert(assignments)
      .select('id, voucher_id, user_id');

    if (insertErr) {
      return new Response(JSON.stringify({ error: 'Gagal assign voucher: ' + insertErr.message }), { status: 500 });
    }

    // Increment used_count
    await client
      .from('vouchers')
      .update({ used_count: voucher.used_count + targetUserIds.length })
      .eq('id', voucher_id);

    return new Response(JSON.stringify({
      success: true,
      assigned: data?.length || targetUserIds.length,
      voucher_code: voucher.code,
    }), { status: 200 });

  } catch (e) {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), { status: 400 });
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const adminClient = createClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
    { global: { headers: { Authorization: authHeader } } }
  );

  const { data: { user }, error: authErr } = await adminClient.auth.getUser();
  if (authErr || !user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const assignmentId = searchParams.get('id');
    const voucherId = searchParams.get('voucher_id');
    const userId = searchParams.get('user_id');

    const client = createClient(
      import.meta.env.PUBLIC_SUPABASE_URL,
      import.meta.env.PUBLIC_SUPABASE_ANON_KEY
    );

    let query = client.from('user_vouchers').delete();
    if (assignmentId) query = query.eq('id', assignmentId);
    else if (voucherId && userId) query = query.eq('voucher_id', voucherId).eq('user_id', userId);
    else return new Response(JSON.stringify({ error: 'id or voucher_id+user_id required' }), { status: 400 });

    const { error: delErr } = await query;
    if (delErr) {
      return new Response(JSON.stringify({ error: 'Gagal revoke voucher' }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Invalid request' }), { status: 400 });
  }
};