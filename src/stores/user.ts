// src/stores/user.ts
import { supabase } from '../lib/supabase';
import { user, setLocalUser } from './auth';

interface AvatarUploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

interface UpdateProfileData {
  full_name?: string;
  phone?: string;
  date_of_birth?: string;
  avatar_url?: string;
}

/**
 * Upload avatar image to Supabase Storage
 * @param file - Image file to upload
 * @param userId - User ID for folder organization
 * @returns Promise<AvatarUploadResult>
 */
export async function uploadAvatar(file: File, userId: string): Promise<AvatarUploadResult> {
  if (!supabase) {
    return { success: false, error: 'Supabase not configured' };
  }

  try {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return { success: false, error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP allowed.' };
    }

    // Validate file size (2MB limit)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      return { success: false, error: 'File size too large. Maximum 2MB allowed.' };
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase
      .storage
      .from('avatars')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type
      });

    if (error) {
      return { success: false, error: `Upload failed: ${error.message}` };
    }

    // Get public URL
    const { data: publicUrlData } = supabase
      .storage
      .from('avatars')
      .getPublicUrl(filePath);

    // Update user profile in database
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .update({
        avatar_url: publicUrlData.publicUrl,
        updated_at: new Date().toISOString()
      })
      .eq('auth_id', userId)
      .select()
      .single();

    if (profileError) {
      // If profile update fails, try to delete the uploaded file
      await supabase.storage.from('avatars').remove([filePath]);
      return { success: false, error: `Profile update failed: ${profileError.message}` };
    }

    // Update local user store
    const currentUser = user.get();
    if (currentUser) {
      updateLocalUser({ avatar_url: publicUrlData.publicUrl });
    }

    return { success: true, url: publicUrlData.publicUrl };

  } catch (error) {
    return { success: false, error: `Unexpected error: ${(error as Error).message}` };
  }
}

/**
 * Initialize user profile after signup
 * @param userId - Auth user ID
 * @param email - User email
 * @param fullName - User's full name
 * @returns Promise<{success: boolean, error?: string}>
 */
export async function initializeUserProfile(
  userId: string,
  email: string,
  fullName?: string
): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    return { success: false, error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert([
        {
          auth_id: userId,
          email: email,
          full_name: fullName || email.split('@')[0],
          phone: '',
          avatar_url: '',
          date_of_birth: null,
          is_active: true,
          is_verified: false
        }
      ])
      .select()
      .single();

    if (error) {
      return { success: false, error: `Failed to create profile: ${error.message}` };
    }

    return { success: true };

  } catch (error) {
    return { success: false, error: `Unexpected error: ${(error as Error).message}` };
  }
}

/**
 * Update user profile information
 * @param userId - Auth user ID
 * @param profileData - Profile data to update
 * @returns Promise<{success: boolean, error?: string}>
 */
export async function updateUserProfile(
  userId: string,
  profileData: UpdateProfileData
): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    return { success: false, error: 'Supabase not configured' };
  }

  try {
    // Prepare update payload
    const updatePayload: any = {
      updated_at: new Date().toISOString()
    };

    if (profileData.full_name !== undefined) updatePayload.full_name = profileData.full_name;
    if (profileData.phone !== undefined) updatePayload.phone = profileData.phone;
    if (profileData.date_of_birth !== undefined) updatePayload.date_of_birth = profileData.date_of_birth;
    if (profileData.avatar_url !== undefined) updatePayload.avatar_url = profileData.avatar_url;

    const { data, error } = await supabase
      .from('user_profiles')
      .update(updatePayload)
      .eq('auth_id', userId)
      .select()
      .single();

    if (error) {
      return { success: false, error: `Profile update failed: ${error.message}` };
    }

    // Update local user store if avatar was updated
    const currentUser = user.get();
    if (currentUser && profileData.avatar_url !== undefined) {
      const updatedUser = {
        ...currentUser,
        avatar_url: profileData.avatar_url
      };
      setLocalUser(updatedUser.email, updatedUser.full_name, profileData.avatar_url);
    }

    return { success: true };

  } catch (error) {
    return { success: false, error: `Unexpected error: ${(error as Error).message}` };
  }
}

/**
 * Delete user avatar
 * @param userId - Auth user ID
 * @param avatarUrl - Current avatar URL
 * @returns Promise<{success: boolean, error?: string}>
 */
export async function deleteAvatar(
  userId: string,
  avatarUrl?: string
): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    return { success: false, error: 'Supabase not configured' };
  }

  try {
    // Extract file path from URL if provided
    let filePath = null;
    if (avatarUrl) {
      const urlParts = avatarUrl.split('/avatars/');
      if (urlParts.length > 1) {
        filePath = urlParts[1];
      }
    }

    // If no file path from URL, we cannot delete
    if (!filePath) {
      return { success: true }; // Consider success as nothing to delete
    }

    // Delete from storage
    const { error } = await supabase
      .storage
      .from('avatars')
      .remove([filePath]);

    if (error) {
      return { success: false, error: `Storage deletion failed: ${error.message}` };
    }

    // Update profile to remove avatar URL
    const { data, error: profileError } = await supabase
      .from('user_profiles')
      .update({
        avatar_url: '',
        updated_at: new Date().toISOString()
      })
      .eq('auth_id', userId)
      .select()
      .single();

    if (profileError) {
      return { success: false, error: `Profile update failed: ${profileError.message}` };
    }

    // Update local user store
    const currentUser = user.get();
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        avatar_url: ''
      };
      setLocalUser(updatedUser.email, updatedUser.full_name, '');
    }

    return { success: true };

  } catch (error) {
    return { success: false, error: `Unexpected error: ${(error as Error).message}` };
  }
}

/**
 * Get user profile
 * @param userId - Auth user ID
 * @returns Promise<{data: any, error?: string}>
 */
export async function getUserProfile(userId: string) {
  if (!supabase) {
    return { data: null, error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('auth_id', userId)
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data };

  } catch (error) {
    return { data: null, error: (error as Error).message };
  }
}