import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });
  }
  const formData = await request.formData();
  const file = formData.get('file') as File;
  if (!file) return new Response(JSON.stringify({ error: 'No file' }), { status: 400 });
  if (file.size > 2097152) return new Response(JSON.stringify({ error: 'Max 2MB' }), { status: 400 });
  if (!['image/jpeg','image/png','image/webp'].includes(file.type))
    return new Response(JSON.stringify({ error: 'JPEG/PNG/WebP only' }), { status: 400 });

  const ext = file.name.split('.').pop() || 'jpg';
  const filePath = `review-images/${user.email?.replace(/[^a-zA-Z0-9]/g,'_')}-${Date.now()}.${ext}`;
  const buf = new Uint8Array(await file.arrayBuffer());
  const { error: upErr } = await supabase.storage.from('product-images').upload(filePath, buf, { contentType: file.type });
  if (upErr) return new Response(JSON.stringify({ error: upErr.message }), { status: 500 });

  const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(filePath);
  return new Response(JSON.stringify({ url: publicUrl }), { status: 200 });
};
