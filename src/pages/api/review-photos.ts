// src/pages/api/review-photos.ts
// Photo review upload support — stores review photos in Supabase Storage

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  try {
    const formData = await request.formData();
    const file = formData.get('photo') as File | null;
    const reviewId = formData.get('reviewId') as string | null;
    const userId = formData.get('userId') as string | null;

    if (!file) {
      return new Response(JSON.stringify({ error: 'No photo file provided' }), {
        status: 400, headers: corsHeaders,
      });
    }

    if (!userId) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: 401, headers: corsHeaders,
      });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return new Response(JSON.stringify({ error: 'Invalid file type. Use JPEG, PNG, WebP, or GIF.' }), {
        status: 400, headers: corsHeaders,
      });
    }

    // Validate file size (max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return new Response(JSON.stringify({ error: 'File too large. Max size is 5MB.' }), {
        status: 400, headers: corsHeaders,
      });
    }

    const { supabase } = await import('../../lib/supabase');

    // Generate unique file path: reviews/{userId}/{reviewId}/{timestamp}-{filename}
    const fileExt = file.name.split('.').pop() || 'jpg';
    const timestamp = Date.now();
    const safeName = `photo-${timestamp}.${fileExt}`;
    const filePath = reviewId
      ? `reviews/${userId}/${reviewId}/${safeName}`
      : `reviews/${userId}/pending/${safeName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const { data: uploadData, error: uploadError } = await supabase!
      .storage.from('review-photos')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('[review-photos] Upload error:', uploadError);
      return new Response(JSON.stringify({ error: 'Failed to upload photo' }), {
        status: 500, headers: corsHeaders,
      });
    }

    // Get public URL
    const { data: urlData } = supabase!
      .storage.from('review-photos')
      .getPublicUrl(filePath);

    const photoUrl = urlData.publicUrl;

    // If reviewId provided, link photo to review in photos table
    if (reviewId) {
      const { error: dbError } = await supabase!
        .from('review_photos')
        .insert({
          review_id: reviewId,
          photo_url: photoUrl,
          storage_path: filePath,
          file_name: file.name,
          file_size: file.size,
          mime_type: file.type,
          uploaded_by: userId,
        });

      if (dbError) {
        console.error('[review-photos] DB insert error:', dbError);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      url: photoUrl,
      path: filePath,
      fileName: file.name,
      size: file.size,
    }), {
      status: 200, headers: corsHeaders,
    });
  } catch (err) {
    console.error('[review-photos] Error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500, headers: corsHeaders,
    });
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  try {
    const body = await request.json();
    const { photoUrl, reviewId, userId } = body;

    if (!photoUrl || !userId) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400, headers: corsHeaders,
      });
    }

    const { supabase } = await import('../../lib/supabase');

    // Extract storage path from URL
    const urlParts = photoUrl.split('/review-photos/');
    const storagePath = urlParts[1] || '';

    if (!storagePath) {
      return new Response(JSON.stringify({ error: 'Invalid photo URL' }), {
        status: 400, headers: corsHeaders,
      });
    }

    // Delete from storage
    const { error: deleteError } = await supabase!
      .storage.from('review-photos')
      .remove([storagePath]);

    if (deleteError) {
      console.error('[review-photos] Delete error:', deleteError);
    }

    // Remove from database if reviewId provided
    if (reviewId) {
      await supabase!
        .from('review_photos')
        .delete()
        .eq('review_id', reviewId)
        .eq('storage_path', storagePath);
    }

    return new Response(JSON.stringify({ success: true, message: 'Photo deleted' }), {
      status: 200, headers: corsHeaders,
    });
  } catch (err) {
    console.error('[review-photos] Error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500, headers: corsHeaders,
    });
  }
};

export const OPTIONS: APIRoute = () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};