import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const GET: APIRoute = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  const { data: logs, error: dbErr } = await supabase.from('email_logs')
    .select('*').eq('to_email', user.email).order('sent_at', { ascending: false }).limit(20);
  if (dbErr) return new Response(JSON.stringify({ error: dbErr.message }), { status: 500 });
  return new Response(JSON.stringify({ total: logs?.length || 0, logs }), { status: 200 });
};
