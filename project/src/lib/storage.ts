import { supabase } from './supabase';

export async function uploadImage(
  file: File,
  bucket: 'avatars' | 'banners',
  userId: string
): Promise<{ url: string | null; error: Error | null }> {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size must be less than 5MB');
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;

    // Upload file to Supabase Storage
    const { data, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      throw uploadError;
    }

    // Get public URL
    const { data: { publicUrl }, error: urlError } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    if (urlError) {
      throw urlError;
    }

    return { url: publicUrl, error: null };
  } catch (error) {
    return { 
      url: null, 
      error: error instanceof Error ? error : new Error('Failed to upload image') 
    };
  }
}