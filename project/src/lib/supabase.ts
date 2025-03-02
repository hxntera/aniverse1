import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';
import toast from 'react-hot-toast';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set correctly.');
}

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storage: window.localStorage,
      storageKey: 'supabase.auth.token',
      flowType: 'pkce',
    },
    global: {
      headers: {
        'x-application-name': 'aniverse',
      },
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);

// Add error handling for network issues
window.addEventListener('online', () => {
  toast.success('Connection restored');
});

window.addEventListener('offline', () => {
  toast.error('Connection lost');
});