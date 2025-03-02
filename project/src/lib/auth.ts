import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabase';
import type { User } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function useAuthProvider() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let retryTimeout: NodeJS.Timeout;
    const maxRetries = 3;
    let retryCount = 0;

    async function initializeAuth() {
      try {
        const { data: { session }, error: authError } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (authError) {
          if (retryCount < maxRetries) {
            retryCount++;
            retryTimeout = setTimeout(initializeAuth, 2000 * retryCount);
            return;
          }
          console.error('Auth initialization error:', authError);
          toast.error('Failed to initialize authentication');
          setLoading(false);
          return;
        }

        setUser(session?.user ?? null);
        setLoading(false);
        retryCount = 0;
      } catch (err) {
        console.error('Unexpected auth error:', err);
        if (mounted && retryCount < maxRetries) {
          retryCount++;
          retryTimeout = setTimeout(initializeAuth, 2000 * retryCount);
        } else {
          setLoading(false);
        }
      }
    }

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      setUser(session?.user ?? null);
      setLoading(false);

      if (event === 'SIGNED_IN') {
        toast.success('Successfully signed in!');
      } else if (event === 'SIGNED_OUT') {
        toast.success('Successfully signed out!');
      } else if (event === 'USER_UPDATED') {
        toast.success('Profile updated successfully!');
      }
    });

    return () => {
      mounted = false;
      clearTimeout(retryTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  return {
    user,
    loading,
    signOut,
  };
}