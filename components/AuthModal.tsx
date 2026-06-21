
import React, { useState, useEffect } from 'react';
import { X, Mail, ArrowLeft, CheckCircle2, Loader2, ExternalLink } from 'lucide-react';
import { User } from '../types';
import { supabase } from '../services/supabaseService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

type AuthView = 'options' | 'email-input' | 'otp-input';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [view, setView] = useState<AuthView>('options');
  
  // Form states
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setView('options');
      setEmail('');
      setError(null);
      setSuccessMsg(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // --- Auth Handlers ---
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      let isIframe = false;
      try {
        isIframe = typeof window !== 'undefined' && window.self !== window.top;
      } catch (iframeErr) {
        isIframe = true; // Security exception means it is definitively nested in a cross-origin iframe
      }
      
      if (isIframe) {
        // Under iframe (e.g., AI Studio preview), use reliable popup login with manual token interception
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin,
            skipBrowserRedirect: true,
          },
        });

        if (error) {
          throw error;
        }

        if (!data || !data.url) {
          throw new Error('Did not receive authorize URL from Supabase');
        }

        // Calculate center coordinates
        const width = 600;
        const height = 700;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;

        const popup = window.open(
          data.url,
          'supabase_oauth_popup',
          `width=${width},height=${height},top=${top},left=${left},status=no,resizable=yes,scrollbars=yes`
        );

        if (!popup) {
          throw new Error('Popup blocked! Please allow popups for this site or open the app in a new tab to sign in with Google.');
        }
      } else {
        // Standalone browser window - use direct native browser redirect for 100% reliability
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin,
          },
        });

        if (error) {
          throw error;
        }
      }
    } catch (err: any) {
      console.error('Google login starting failure:', err);
      setIsLoading(false);
      setError(err.message || 'Failed to start Google login');
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);
    
    // Send Magic Link (OTP type magiclink is default for signInWithOtp unless configured otherwise)
    const { error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: window.location.origin,
      }
    });

    setIsLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setSuccessMsg("Magic Link sent! Check your email.");
      setView('otp-input');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="absolute top-4 right-4">
            <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
            >
            <X className="w-5 h-5" />
            </button>
        </div>

        <div className="p-8">
          
          {/* --- VIEW: LOGIN OPTIONS --- */}
          {view === 'options' && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="mx-auto w-12 h-12 bg-blue-900/30 rounded-xl flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-6 h-6 text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
                <p className="text-slate-400">Sign in to access your dashboard.</p>
              </div>

              <div className="space-y-3">
                {/* Google Auth Button */}
                <button
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white text-slate-900 border border-slate-200 rounded-xl font-medium hover:bg-slate-50 transition-colors"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-slate-600" />
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                        />
                        <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                        />
                        <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                        />
                        <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                        />
                    </svg>
                  )}
                  Continue with Google
                </button>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-800"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-slate-900 px-2 text-slate-500">Or continue with</span>
                    </div>
                </div>

                <button
                  onClick={() => setView('email-input')}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/20"
                >
                  <Mail className="w-5 h-5" />
                  Continue with Email
                </button>
              </div>
              
              {error && <p className="text-red-400 text-center text-sm">{error}</p>}
            </div>
          )}

          {/* --- VIEW: EMAIL INPUT --- */}
          {view === 'email-input' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-200">
              <div className="flex items-center gap-2 mb-2">
                <button onClick={() => setView('options')} className="text-slate-400 hover:text-white">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-bold text-white">Sign in with email</h2>
              </div>
              <p className="text-slate-400 text-sm">We'll send a magic link to your inbox to log you in instantly.</p>

              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-slate-300">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    autoFocus
                  />
                </div>
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 transition-colors disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Magic Link'}
                </button>
              </form>
            </div>
          )}

          {/* --- VIEW: CHECK EMAIL INSTRUCTIONS (NO CODE INPUT) --- */}
          {view === 'otp-input' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-200">
               <div className="flex items-center gap-2 mb-2">
                <button onClick={() => setView('email-input')} className="text-slate-400 hover:text-white">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-bold text-white">Check your email</h2>
              </div>
              <div className="text-slate-400 text-sm">
                <p className="mb-4">We sent a secure magic link to <span className="text-white font-medium">{email}</span>.</p>
                <div className="flex gap-3 items-start text-sm bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                    <ExternalLink className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                        <p className="font-medium text-slate-200">Click the link to log in</p>
                        <p className="text-slate-500 text-xs">The link will open this dashboard automatically.</p>
                    </div>
                </div>
              </div>

              {successMsg && (
                 <div className="p-3 bg-green-900/30 border border-green-800/50 rounded-lg flex items-center gap-2 text-green-200 text-sm">
                    <CheckCircle2 className="w-4 h-4" /> {successMsg}
                 </div>
              )}

              <div className="border-t border-slate-800 pt-6 mt-6">
                <p className="text-center text-sm text-slate-500">
                    Didn't receive it? <button type="button" className="text-blue-400 hover:underline font-medium" onClick={handleEmailSubmit}>Resend Magic Link</button>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
