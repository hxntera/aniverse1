import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Mail, Lock, AlertCircle } from 'lucide-react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../../lib/supabase';
import { z } from 'zod';
import toast from 'react-hot-toast';

const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [view, setView] = useState<'sign_in' | 'sign_up' | 'forgotten_password'>('sign_in');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-md glass rounded-lg p-6"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">
            {view === 'sign_in' ? 'Welcome Back!' : 
             view === 'sign_up' ? 'Create Account' : 
             'Reset Password'}
          </h2>
          <p className="text-gray-400">
            {view === 'sign_in' ? 'Sign in to continue to Aniverse' :
             view === 'sign_up' ? 'Join the anime community today' :
             'Enter your email to reset your password'}
          </p>
        </div>

        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: 'hsl(var(--primary))',
                  brandAccent: 'hsl(var(--primary))',
                },
              },
            },
            className: {
              container: 'w-full',
              button: `w-full px-4 py-2 bg-primary hover:bg-primary/90 rounded-lg transition-colors text-white ${loading ? 'opacity-50 cursor-not-allowed' : ''}`,
              input: 'w-full px-3 py-2 bg-white/5 rounded-lg border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary',
              label: 'block text-sm font-medium mb-1',
              message: 'text-red-500 text-sm mt-1',
              loader: 'border-primary',
            },
          }}
          localization={{
            variables: {
              sign_in: {
                email_label: 'Email address',
                password_label: 'Password',
                button_label: 'Sign in',
                loading_button_label: 'Signing in...',
              },
              sign_up: {
                email_label: 'Email address',
                password_label: 'Password',
                button_label: 'Create account',
                loading_button_label: 'Creating account...',
              },
            },
          }}
          view={view}
          showLinks={true}
          redirectTo={window.location.origin}
          onlyThirdPartyProviders={false}
        />

        <div className="mt-6 text-center text-sm">
          {view === 'sign_in' ? (
            <>
              Don't have an account?{' '}
              <button
                onClick={() => setView('sign_up')}
                className="text-primary hover:underline"
              >
                Sign up
              </button>
            </>
          ) : view === 'sign_up' ? (
            <>
              Already have an account?{' '}
              <button
                onClick={() => setView('sign_in')}
                className="text-primary hover:underline"
              >
                Sign in
              </button>
            </>
          ) : (
            <button
              onClick={() => setView('sign_in')}
              className="text-primary hover:underline"
            >
              Back to sign in
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}