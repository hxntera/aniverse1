import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { uploadImage } from '../lib/storage';
import type { Database } from '../lib/database.types';
import toast from 'react-hot-toast';

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

const RETRY_DELAY = 3000; // 3 seconds
const MAX_RETRIES = 3;

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  async function fetchProfile(retry = false) {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        if (authError.message.includes('token') || authError.message.includes('JWT')) {
          // Handle token-related errors silently if not retrying
          if (!retry && retryCount < MAX_RETRIES) {
            setRetryCount(prev => prev + 1);
            setTimeout(() => fetchProfile(true), RETRY_DELAY);
            return;
          }
        }
        throw authError;
      }
      
      if (!user) {
        setProfile(null);
        setError(null);
        setLoading(false);
        return;
      }

      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        // If it's a network error and we haven't exceeded max retries
        if (profileError.message.includes('fetch') && retryCount < MAX_RETRIES) {
          setRetryCount(prev => prev + 1);
          setTimeout(() => fetchProfile(true), RETRY_DELAY);
          return;
        }
        throw profileError;
      }

      setProfile(data);
      setError(null);
      setRetryCount(0);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch profile';
      console.error('Profile fetch error:', err);
      
      if (!retry) {
        // Only show toast for non-retry attempts and non-auth errors
        if (!(err as any).__isAuthError) {
          toast.error(errorMessage);
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let mounted = true;
    let channel: ReturnType<typeof supabase.channel> | null = null;

    // Initial fetch
    if (mounted) {
      fetchProfile();
    }

    // Set up realtime subscription
    try {
      channel = supabase
        .channel('profile_changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'profiles'
        }, (payload) => {
          if (payload.new && mounted) {
            setProfile(payload.new as Profile);
          }
        })
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log('Subscribed to profile changes');
          }
        });
    } catch (err) {
      console.error('Failed to set up realtime subscription:', err);
    }

    // Cleanup
    return () => {
      mounted = false;
      if (channel) {
        channel.unsubscribe();
      }
    };
  }, []);

  async function updateProfile(updates: ProfileUpdate) {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) throw authError;
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      return { success: true, message: 'Profile updated successfully' };
    } catch (err) {
      console.error('Profile update error:', err);
      const message = err instanceof Error ? err.message : 'Failed to update profile';
      toast.error(message);
      return { success: false, message };
    }
  }

  async function uploadProfileImage(file: File, type: 'avatar' | 'banner') {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) throw authError;
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const bucket = type === 'avatar' ? 'avatars' : 'banners';
      const { url, error: uploadError } = await uploadImage(file, bucket, user.id);

      if (uploadError) throw uploadError;

      if (!url) {
        throw new Error('Failed to get image URL');
      }

      const updates = type === 'avatar' 
        ? { avatar_url: url }
        : { banner_url: url };

      const result = await updateProfile(updates);
      
      if (!result.success) {
        throw new Error(result.message);
      }

      return { success: true, message: `${type} updated successfully` };
    } catch (err) {
      console.error('Image upload error:', err);
      const message = err instanceof Error ? err.message : `Failed to update ${type}`;
      toast.error(message);
      return { success: false, message };
    }
  }

  return {
    profile,
    loading,
    error,
    updateProfile,
    uploadProfileImage,
    refreshProfile: () => fetchProfile(),
  };
}