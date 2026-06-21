import React, { useEffect, useState } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../services/supabaseService';

interface RedirectHandlerProps {
  onSuccess: (sessionUser: any) => Promise<void>;
  onFinished: () => void;
}

const RedirectHandler: React.FC<RedirectHandlerProps> = ({ onSuccess, onFinished }) => {
  const [status, setStatus] = useState<'idle' | 'processing' | 'error'>(() => {
    if (typeof window !== 'undefined' && window.location.hash && window.location.hash.includes('access_token=')) {
      return 'processing';
    }
    return 'idle';
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const callbacksRef = React.useRef({ onSuccess, onFinished });
  useEffect(() => {
    callbacksRef.current = { onSuccess, onFinished };
  }, [onSuccess, onFinished]);

  useEffect(() => {
    let active = true;

    const processHashAndSignIn = async () => {
      const hash = window.location.hash;
      if (!hash || !hash.includes('access_token=')) {
        if (active) callbacksRef.current.onFinished();
        return;
      }

      if (active) setStatus('processing');
      try {
        // Parse Hash parameters
        const params = hash.substring(1).split('&').reduce((acc, item) => {
          const [key, value] = item.split('=');
          if (key && value) {
            try {
              acc[key] = decodeURIComponent(value);
            } catch (e) {
              acc[key] = value;
            }
          }
          return acc;
        }, {} as Record<string, string>);

        const accessToken = params['access_token'];
        const refreshToken = params['refresh_token'];

        if (!accessToken) {
          throw new Error('Access token not found in URL hash');
        }

        console.log('RedirectHandler: Manual Supabase setSession initiating...');
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || '',
        });

        if (error) {
          throw error;
        }

        if (!data || !data.user) {
          throw new Error('No user profile found in the authenticated session');
        }

        console.log('RedirectHandler: Authentication transfer complete!', data.user.email);
        
        // Clean URL before transitioning to dashboard
        try {
          window.history.replaceState(null, '', window.location.pathname);
        } catch (e) {
          console.warn('RedirectHandler: Failed to replace state:', e);
        }

        if (active) {
          await callbacksRef.current.onSuccess(data.user);
        }
      } catch (err: any) {
        console.error('RedirectHandler: Authentication callback failure:', err);
        if (active) {
          setErrorMsg(err.message || 'Verification failed');
          setStatus('error');
          setTimeout(() => {
            if (active) callbacksRef.current.onFinished();
          }, 3500);
        }
      }
    };

    processHashAndSignIn();

    return () => {
      active = false;
    };
  }, []); // decoupled from callback re-creations

  if (status === 'processing') {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center text-slate-200">
        <div className="p-8 max-w-sm rounded-2xl bg-slate-900 border border-slate-800 text-center shadow-2xl flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          <h2 className="text-xl font-semibold text-white">Finalizing Sign In</h2>
          <p className="text-slate-400 text-sm">
            Setting up your secure session and preparing your professional headshot dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center text-slate-200">
        <div className="p-8 max-w-sm rounded-2xl bg-slate-900 border border-red-900/45 text-center shadow-2xl flex flex-col items-center gap-4">
          <AlertCircle className="w-12 h-12 text-red-500" />
          <h2 className="text-xl font-semibold text-white">Authorization failed</h2>
          <p className="text-red-400 text-sm">
            {errorMsg}
          </p>
          <p className="text-slate-500 text-xs">
            Returning to the home page...
          </p>
        </div>
      </div>
    );
  }

  return null;
};

export default RedirectHandler;
