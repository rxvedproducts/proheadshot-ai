
import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import UploadSection from './components/UploadSection';
import StyleSelector from './components/StyleSelector';
import Generator from './components/Generator';
import Gallery from './components/Gallery';
import HowItWorks from './components/HowItWorks';
import Samples from './components/Samples';
import Pricing from './components/Pricing';
import AuthModal from './components/AuthModal';
import Dashboard from './components/Dashboard';
import RefundPolicy from './components/RefundPolicy';
import TermsOfService from './components/TermsOfService';
import PrivacyPolicy from './components/PrivacyPolicy';
import CookieBanner from './components/CookieBanner';
import EnterpriseSalesModal from './components/EnterpriseSalesModal';
import RedirectHandler from './components/RedirectHandler';
import { AppStep, HeadshotStyle, User } from './types';
import { supabase, ensureUserProfileExists, getUserProfile, testSupabaseConnection } from './services/supabaseService';
import { SUPPORT_EMAIL } from './constants';
import { Loader2, CheckCircle2, AlertTriangle, Terminal, X, Copy, Check, Wrench, Sparkles, ArrowRight } from 'lucide-react';

// Module-scoped log buffer — not exposed on window, inaccessible to third-party scripts
const _systemLogs: string[] = [];

const getHashParams = () => {
  const hash = window.location.hash;
  if (!hash) return {};
  
  return hash.substring(1).split('&').reduce((acc, item) => {
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
};

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>('landing');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<HeadshotStyle | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  
  const [user, setUser] = useState<User | null>(null);
  const userRef = useRef<User | null>(null);
  const isProcessingAuth = useRef(false);
  
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isRedirectProcessing, setIsRedirectProcessing] = useState(
    () => {
      if (typeof window === 'undefined') return false;
      const hash = window.location.hash;
      const params = new URLSearchParams(window.location.search);
      // Implicit flow: #access_token= | PKCE flow (supabase-js v2 default): ?code=
      return hash.includes('access_token=') || !!params.get('code');
    }
  );
  const [oauthError, setOauthError] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    const hash = window.location.hash;
    const params = new URLSearchParams(window.location.search);
    const err = params.get('error_description') || params.get('error') ||
      (hash.includes('error=') ? new URLSearchParams(hash.slice(1)).get('error_description') || new URLSearchParams(hash.slice(1)).get('error') : null);
    return err ? decodeURIComponent(err.replace(/\+/g, ' ')) : null;
  });
  const [isEnterpriseSalesModalOpen, setIsEnterpriseSalesModalOpen] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [dbStatus, setDbStatus] = useState({
    checked: false,
    success: true,
    message: '',
    isPaused: false
  });
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState(false);
  const [wasCopied, setWasCopied] = useState(false);

  // Safely format arguments for diagnostics display without throwing on circular structures
  const safeFormat = (args: any[]): string => {
    return args
      .map(arg => {
        if (arg === null) return 'null';
        if (arg === undefined) return 'undefined';
        if (typeof arg === 'string') return arg;
        if (typeof arg === 'function') return `[Function: ${arg.name || 'anonymous'}]`;
        if (arg instanceof Error) {
          return `${arg.name}: ${arg.message}${arg.stack ? `\n${arg.stack}` : ''}`;
        }
        if (typeof arg === 'object') {
          try {
            // Check if it looks like a browser Event, window, or react internals to prevent deep serialisation
            if ('target' in arg && 'type' in arg) {
              return `[Event: ${arg.type}]`;
            }
            if ('_owner' in arg || '__reactFiber$' in arg || 'context' in arg || arg.constructor?.name === 'Window') {
              return `[Component/System Object: ${arg.constructor?.name || 'Object'}]`;
            }
            // Lightweight serialization of shallow objects
            const keys = Object.keys(arg);
            if (keys.length > 10) {
              return `[Large Object: ${arg.constructor?.name || 'Object'} with ${keys.length} keys]`;
            }
            const serialized = JSON.stringify(arg, (k, v) => {
              if (typeof v === 'object' && v !== null) {
                if (v.constructor?.name && ['Window', 'HTMLDocument', 'HTMLElement'].includes(v.constructor.name)) {
                  return `[DOM Object: ${v.constructor.name}]`;
                }
              }
              return v;
            });
            return serialized.length > 300 ? serialized.substring(0, 300) + '...' : serialized;
          } catch (_) {
            return `[Object: ${arg.constructor?.name || 'Object'}]`;
          }
        }
        try {
          return String(arg);
        } catch (_) {
          return '[Unserializable]';
        }
      })
      .join(' ');
  };

  // Global console and error interceptors feeding a safe global log array to prevent infinite rendering loops
  useEffect(() => {
    _systemLogs.push(`[System] Application loading... URL: ${window.location.origin}`);
    
    const handleGlobalError = (event: ErrorEvent) => {
      const msg = `[Error] ${event.message || event.error?.message || 'Uncaught Script Error'}`;
      _systemLogs.push(msg);
    };
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const msg = `[Promise Rejection] ${event.reason?.message || event.reason || 'Unhandled Promise Rejection'}`;
      _systemLogs.push(msg);
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Capture console.error and console.warn and console.log
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;
    const originalConsoleLog = console.log;

    console.error = (...args: any[]) => {
      originalConsoleError.apply(console, args);
      const msg = safeFormat(args);
      _systemLogs.push(`[Console Error] ${msg}`);
      if (_systemLogs.length > 150) _systemLogs.shift();
    };

    console.warn = (...args: any[]) => {
      originalConsoleWarn.apply(console, args);
      const msg = safeFormat(args);
      _systemLogs.push(`[Console Warn] ${msg}`);
      if (_systemLogs.length > 150) _systemLogs.shift();
    };

    console.log = (...args: any[]) => {
      originalConsoleLog.apply(console, args);
      const msg = safeFormat(args);
      _systemLogs.push(`[Console Log] ${msg}`);
      if (_systemLogs.length > 150) _systemLogs.shift();
    };

    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
      console.log = originalConsoleLog;
    };
  }, []);

  // Poll global logs array instead of real-time state trigger to completely decouple log generation and render cycles
  useEffect(() => {
    const updateLogs = () => {
      const logs = _systemLogs || [];
      setDebugLogs([...logs]);
    };
    updateLogs();
    const interval = setInterval(updateLogs, 1000);
    return () => clearInterval(interval);
  }, []);

  const enableDemoMode = () => {
    const demoUser = {
      id: 'offline-demo',
      email: 'demo@proheadshot.ai',
      name: 'Demo Professional',
      avatar: undefined,
      credits: 10
    };
    setUser(demoUser);
    setStep('dashboard');
    setIsAuthModalOpen(false);
    setDbStatus({
      checked: true,
      success: true, // Mark active so warning goes away or is silent
      message: 'Demo mode active using mocked data.',
      isPaused: false
    });
    if (_systemLogs) {
      _systemLogs.push("[System] Bypassed database. Launched Client-Side Demo Mode successfully with 10 credits!");
    }
  };

  const handleRedirectSuccess = async (sessionUser: any) => {
    const userData = await fetchAndSetUser(sessionUser);
    if (userData) {
      setStep('dashboard');
    }
    setIsRedirectProcessing(false);
    setIsInitializing(false);
  };

  const handleRedirectFinished = () => {
    setIsRedirectProcessing(false);
  };

  // Sync userRef with user state
  useEffect(() => {
    userRef.current = user;
  }, [user]);


  const fetchAndSetUser = async (sessionUser: any) => {
      if (!sessionUser) return;
      
      let profile = null;
      try {
        profile = await ensureUserProfileExists(sessionUser);
      } catch (err) {
        console.warn("Profile sync warning:", err);
      }

      const userData: User = {
          id: sessionUser.id,
          email: sessionUser.email || '',
          name: profile?.full_name || sessionUser.user_metadata?.full_name || sessionUser.email?.split('@')[0] || 'User',
          avatar: profile?.avatar_url || sessionUser.user_metadata?.avatar_url,
          credits: (profile?.credits !== undefined && profile?.credits !== null) ? profile.credits : 0 
      };
      
      setUser(userData);
      return userData;
  };

  const refreshCredits = async (userId: string) => {
      console.log("Starting credit poll...");
      for (let i = 0; i < 5; i++) {
          await new Promise(resolve => setTimeout(resolve, 2000));
          const profile = await getUserProfile(userId);
          if (profile) {
              setUser(prev => {
                   if (!prev) return null;
                   if (prev.credits !== profile.credits) {
                       console.log(`Credits updated to ${profile.credits} on poll #${i+1}`);
                   }
                   return { ...prev, credits: profile.credits };
              });
          }
      }
      console.log("Credit poll finished.");
  };

  useEffect(() => {
    let mounted = true;

    // Run database connection diagnostics
    testSupabaseConnection().then(status => {
      if (mounted) {
        setDbStatus({
          checked: true,
          success: status.success,
          message: status.message,
          isPaused: status.isPaused
        });
        setDebugLogs(prev => [...prev, `[DB Status Check] Connected: ${status.success}, Message: "${status.message || 'None'}", Paused: ${status.isPaused}`]);
      }
    });

    // Safety timeout: Ensure the app eventually shows something even if auth hangs
    const safetyTimeout = setTimeout(() => {
        if (mounted && (isInitializing || isRedirectProcessing)) {
            console.warn("Authentication check timed out.");
            setIsInitializing(false);
            setIsRedirectProcessing(false);
        }
    }, 5000);

    const handleAuthEvent = async (event: string, session: any) => {
      if (!mounted) return;
      console.log(`Supabase Auth Event: ${event}`);

      try {
        if (session?.user) {
          const isNewUser = userRef.current?.id !== session.user.id;
          if (isNewUser) {
            await fetchAndSetUser(session.user);
          }
          
          if (mounted) {
              setStep('dashboard');
              setIsAuthModalOpen(false);
              setIsRedirectProcessing(false);

              // Handle post-purchase redirect
              const urlParams = new URLSearchParams(window.location.search);
              if (urlParams.get('purchase') === 'success') {
                  setShowPaymentSuccess(true);
                  try {
                      window.history.replaceState(null, '', window.location.pathname);
                  } catch (historyErr) {
                      console.warn("Failed to clear purchase query from URL:", historyErr);
                  }
                  refreshCredits(session.user.id);
                  setTimeout(() => setShowPaymentSuccess(false), 5000);
              }
              
              // Clean up hash/query params left by OAuth redirect
              const hasOauthParams = (window.location.hash && window.location.hash.includes('access_token')) ||
                new URLSearchParams(window.location.search).has('code');
              if (hasOauthParams) {
                  try {
                      window.history.replaceState(null, '', window.location.pathname);
                  } catch (historyErr) {
                      console.warn("Failed to clear OAuth params from URL:", historyErr);
                  }
              }
          }
        } else {
          if (mounted) {
            setUser(null);
            setIsRedirectProcessing(false);
            // Only force landing if logged out of protected routes
            setStep(prev => {
              if (['dashboard', 'upload', 'style', 'processing'].includes(prev)) {
                 return 'landing';
              }
              return prev;
            });
          }
        }
      } catch (e) {
          console.error("Error executing auth state change handler:", e);
      } finally {
        if (mounted) {
            setIsInitializing(false);
            clearTimeout(safetyTimeout);
        }
      }
    };

    // Listening for token hash messages from Google OAuth popup (local dev only)
    const ALLOWED_MESSAGE_ORIGINS = new Set([
      'http://localhost:3000',
      'http://localhost:5173',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173',
    ]);
    const handleMessage = (event: MessageEvent) => {
      if (!mounted) return;
      if (!ALLOWED_MESSAGE_ORIGINS.has(event.origin)) return;

      if (event.data?.type === 'SUPABASE_OAUTH_HASH' && event.data?.hash) {
        console.log("App: Clean hash received from popup window");
        setIsRedirectProcessing(true);
        setIsInitializing(true);
        try {
          window.location.hash = event.data.hash;
        } catch (hashErr) {
          console.warn("Failed to set window location hash:", hashErr);
        }
      }
    };
    window.addEventListener('message', handleMessage);

    // Subscribing to SupabaseAuth triggers INITIAL_SESSION synchronously/asynchronously, which covers on-load check
    let subscription: any = null;
    try {
      const { data } = supabase.auth.onAuthStateChange((event, session) => {
         handleAuthEvent(event, session);
      });
      subscription = data?.subscription;
    } catch (e) {
      console.error("onAuthStateChange registration failed:", e);
      if (mounted) {
        setIsInitializing(false);
        clearTimeout(safetyTimeout);
      }
    }

    return () => {
      mounted = false;
      clearTimeout(safetyTimeout);
      window.removeEventListener('message', handleMessage);
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []); 

  const handleStart = () => {
    if (user) setStep('dashboard');
    else setIsAuthModalOpen(true);
  };

  const handleLoginSuccess = async (loggedInUser: User) => {
    await fetchAndSetUser({ id: loggedInUser.id, email: loggedInUser.email });
    setIsAuthModalOpen(false);
    setStep('dashboard');
    if (showPaymentSuccess) refreshCredits(loggedInUser.id);
  };

  const handleLogout = async () => {
    setUser(null);
    setStep('landing');
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleImageSelected = (base64: string) => {
    setUploadedImage(base64);
    setStep('style');
  };

  const handleStyleSelected = (style: HeadshotStyle) => {
    setSelectedStyle(style);
    setStep('processing');
  };

  const handleGenerationComplete = (imageUrl: string) => {
    setResultImage(imageUrl);
    setStep('gallery');
    if (user) {
        setUser(prev => prev ? { ...prev, credits: Math.max(0, prev.credits - 1) } : null);
    }
  };

  const handleRestart = () => {
    setUploadedImage(null);
    setSelectedStyle(null);
    setResultImage(null);
    setStep(user ? 'dashboard' : 'landing');
  };
  
  const handleNavigate = (newStep: AppStep) => {
     if (['landing', 'how-it-works', 'pricing', 'refund-policy', 'terms', 'privacy'].includes(newStep)) {
         if (!['landing', 'how-it-works', 'pricing', 'dashboard', 'refund-policy', 'terms', 'privacy'].includes(step)) {
             setUploadedImage(null);
             setSelectedStyle(null);
             setResultImage(null);
         }
     }
     setStep(newStep);
     window.scrollTo(0, 0);
  };

  const handleViewSamples = () => {
    const element = document.getElementById('samples-section');
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectPricingPlan = async (planId: string) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          planId,
          successUrl: `${window.location.origin}/?purchase=success`, 
          cancelUrl: `${window.location.origin}/?purchase=cancelled`
        }
      });
      if (error) throw new Error(error.message || "Payment service unavailable");
      if (!data || !data.url) throw new Error('Received invalid response from payment provider.');
      window.location.href = data.url;
    } catch (err: any) {
      console.error("Payment flow failed:", err);
      alert(`Payment Error: ${err.message || "Failed to initiate payment."}`);
    }
  };

  if (oauthError) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center text-stone-500 gap-4 px-4">
        <AlertTriangle className="w-10 h-10 text-red-500" />
        <p className="text-red-600 font-semibold text-center">Sign-in failed: {oauthError}</p>
        <button
          onClick={() => { setOauthError(null); window.history.replaceState(null, '', window.location.pathname); }}
          className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (isRedirectProcessing) {
    const isImplicitFlow = typeof window !== 'undefined' && window.location.hash.includes('access_token=');
    if (isImplicitFlow) {
      return (
        <RedirectHandler
          onSuccess={handleRedirectSuccess}
          onFinished={handleRedirectFinished}
        />
      );
    }
    // PKCE flow (?code=): detectSessionInUrl handles it automatically; show spinner
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center text-stone-500">
        <Loader2 className="w-10 h-10 text-amber-600 animate-spin mb-4" />
        <p className="animate-pulse">Completing sign-in...</p>
      </div>
    );
  }

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center text-stone-500">
        <Loader2 className="w-10 h-10 text-amber-600 animate-spin mb-4" />
        <p className="animate-pulse">Authenticating...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 selection:bg-amber-200/60 pb-12">
      <CookieBanner />
      {dbStatus.checked && !dbStatus.success && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-3 text-amber-800 flex flex-col md:flex-row items-center justify-center gap-4 text-sm z-50 relative animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-2 text-left animate-pulse">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <span className="leading-relaxed">
              <strong>Database Connection Alert:</strong> {dbStatus.isPaused ? "Your Supabase database instance is currently paused or offline." : dbStatus.message || "Unable to connect to Supabase backend."}
            </span>
          </div>
          <button
            onClick={enableDemoMode}
            className="flex-shrink-0 px-4 py-1.5 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-bold rounded-lg text-xs transition-all shadow-sm cursor-pointer"
          >
            Launch Client-Side Demo Mode
          </button>
        </div>
      )}
      {showPaymentSuccess && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[60] bg-green-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 animate-in slide-in-from-top-4 fade-in duration-300 border border-green-500/30">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-medium">
               Payment Successful! {user ? 'Credits are being added.' : 'Please sign in to update.'}
            </span>
        </div>
      )}

      <Header 
        onNavigate={handleNavigate} 
        user={user}
        onLoginClick={() => setIsAuthModalOpen(true)}
        onLogoutClick={handleLogout}
      />
      
      <main className="container mx-auto px-0 pb-20">
        {step === 'landing' && (
          <>
            <Hero onStart={handleStart} onViewSamples={handleViewSamples} />
            <HowItWorks onStart={handleStart} />
            <Samples onStart={handleStart} />
            {/* Indian Styles callout */}
            <div className="py-16 px-4 bg-stone-900 border-t border-stone-800">
              <div className="container mx-auto max-w-5xl">
                <div className="bg-gradient-to-br from-orange-900/40 to-amber-900/30 border border-orange-700/40 rounded-3xl p-10 md:p-14 text-center">
                  <div className="text-4xl mb-4">🇮🇳</div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Exclusive Indian Cultural Styles
                  </h2>
                  <p className="text-stone-300 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
                    The only AI headshot service celebrating South Asian heritage — with 22 regional Indian costumes (Rajasthani, Bengali, Kannadiga and more), 16 traditional Indian art forms (Madhubani, Warli, Tanjore...), and 13 unique creative styles.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 mb-8">
                    {['Rajasthani Costume','Bengali Traditional','Kannadiga Silk','Madhubani Art','Warli Style','Tanjore Gold','Mughal Portrait','South Indian Silk','Punjabi Phulkari'].map(tag => (
                      <span key={tag} className="px-3 py-1.5 bg-orange-900/50 text-orange-300 text-xs font-semibold rounded-full border border-orange-700/50">
                        {tag}
                      </span>
                    ))}
                    <span className="px-3 py-1.5 bg-amber-900/50 text-amber-300 text-xs font-semibold rounded-full border border-amber-700/50">+42 more</span>
                  </div>
                  <button
                    onClick={handleStart}
                    className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-bold px-8 py-4 rounded-xl transition-all hover:scale-105 shadow-lg shadow-orange-900/30 group"
                  >
                    Explore Indian Styles
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
            <Pricing onSelectPlan={handleSelectPricingPlan} onContactEnterpriseSales={() => setIsEnterpriseSalesModalOpen(true)} />
            {/* Final CTA before footer */}
            <div className="py-16 px-4 bg-amber-50 border-t border-amber-100">
              <div className="container mx-auto max-w-3xl text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">Ready to Look the Part?</h2>
                <p className="text-stone-500 text-lg mb-8">Start with a $2.99 plan — no subscription, no studio appointment needed.</p>
                <button
                  onClick={handleStart}
                  className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold px-10 py-4 rounded-xl transition-all hover:scale-105 shadow-md shadow-amber-100 group text-lg"
                >
                  <Sparkles className="w-5 h-5" />
                  Get Your Headshot — $2.99
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </>
        )}

        {step === 'how-it-works' && <HowItWorks onStart={handleStart} />}
        {step === 'pricing' && <Pricing onSelectPlan={handleSelectPricingPlan} onContactEnterpriseSales={() => setIsEnterpriseSalesModalOpen(true)} />}
        {step === 'refund-policy' && <RefundPolicy onBack={() => handleNavigate(user ? 'dashboard' : 'landing')} />}
        {step === 'terms' && <TermsOfService onBack={() => handleNavigate(user ? 'dashboard' : 'landing')} />}
        {step === 'privacy' && <PrivacyPolicy onBack={() => handleNavigate(user ? 'dashboard' : 'landing')} />}

        {step === 'dashboard' && (
          user ? (
            <Dashboard
              user={user}
              onStartNew={() => { setUploadedImage(null); setSelectedStyle(null); setResultImage(null); setStep('upload'); }}
              onLogout={handleLogout}
              onBuyCredits={() => handleNavigate('pricing')}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-amber-600" />
                <p className="text-stone-400 animate-pulse text-sm">Loading your dashboard...</p>
            </div>
          )
        )}

        {step === 'upload' && <UploadSection onImageSelected={handleImageSelected} />}

        {step === 'style' && (
          <div className="animate-in fade-in duration-500">
             <button onClick={() => setStep('upload')} className="ml-4 mt-4 text-stone-500 hover:text-stone-900 text-sm mb-4">
                &larr; Back to Upload
             </button>
             <StyleSelector onSelect={handleStyleSelected} selectedStyle={selectedStyle} />
          </div>
        )}

        {step === 'processing' && uploadedImage && selectedStyle && (
          <Generator 
            uploadedImage={uploadedImage}
            selectedStyle={selectedStyle}
            onComplete={handleGenerationComplete}
            onBack={() => setStep('style')}
            user={user}
            onBuyCredits={() => handleNavigate('pricing')} 
          />
        )}

        {step === 'gallery' && resultImage && <Gallery imageUrl={resultImage} onRestart={handleRestart} />}
      </main>

      <footer className="border-t border-stone-800 py-16 bg-stone-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-amber-600 p-2">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">ProHeadshot<span className="text-amber-500">AI</span></span>
              </div>
              <p className="text-stone-400 max-w-sm leading-relaxed text-sm">
                Transforming professional identity with the power of generative AI. Our mission is to make premium business photography accessible to everyone.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Product</h4>
              <ul className="space-y-4 text-sm">
                <li><button onClick={() => handleNavigate('pricing')} className="text-stone-500 hover:text-amber-400 transition-colors">Pricing</button></li>
                <li><button onClick={() => handleNavigate('how-it-works')} className="text-stone-500 hover:text-amber-400 transition-colors">How it works</button></li>
                {SUPPORT_EMAIL && <li><a href={`mailto:${SUPPORT_EMAIL}`} className="text-stone-500 hover:text-amber-400 transition-colors">Support</a></li>}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Legal</h4>
              <ul className="space-y-4 text-sm">
                <li><button onClick={() => handleNavigate('terms')} className="text-stone-500 hover:text-amber-400 transition-colors">Terms of Service</button></li>
                <li><button onClick={() => handleNavigate('privacy')} className="text-stone-500 hover:text-amber-400 transition-colors">Privacy Policy</button></li>
                <li><button onClick={() => handleNavigate('refund-policy')} className="text-stone-500 hover:text-amber-400 transition-colors">Refund Policy</button></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-stone-800 flex flex-col md:flex-row items-center justify-between gap-4 text-stone-500 text-xs">
            <p>&copy; {new Date().getFullYear()} ProHeadshot AI. All rights reserved.</p>
            <p>Made with ❤️ in California</p>
          </div>
        </div>
      </footer>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onLoginSuccess={handleLoginSuccess} />
      <EnterpriseSalesModal isOpen={isEnterpriseSalesModalOpen} onClose={() => setIsEnterpriseSalesModalOpen(false)} />

      {/* FLOATING DIAGNOSTICS & TROUBLESHOOTING PANEL — dev only */}
      {(import.meta as any).env.DEV && <div className="fixed bottom-4 right-4 z-50">
        {!isDiagnosticsOpen ? (
          <button
            onClick={() => setIsDiagnosticsOpen(true)}
            title="Troubleshooting Console"
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-full shadow-2xl transition-all duration-200 scale-100 hover:scale-105 cursor-pointer text-xs font-semibold"
          >
            <Wrench className="w-4 h-4 text-amber-500 animate-pulse" />
            <span>🔧 Troubleshoot & Logs</span>
          </button>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-[90vw] md:w-[480px] h-[400px] shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-blue-500" />
                <span className="font-bold text-sm text-slate-200">Diagnostics Console</span>
              </div>
              <button 
                onClick={() => setIsDiagnosticsOpen(false)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick stats / actions */}
            <div className="p-4 border-b border-slate-800 bg-slate-950/20 text-xs flex flex-wrap gap-2 items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Database:</span>
                <span className={`inline-flex items-center px-1.5 py-0.5 rounded font-bold ${dbStatus.success ? 'bg-green-950 text-green-400' : 'bg-amber-950 text-amber-400'}`}>
                  {dbStatus.success ? 'ONLINE' : 'OFFLINE'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Auth:</span>
                <span className={`inline-flex items-center px-1.5 py-0.5 rounded font-bold ${user ? 'bg-blue-950 text-blue-400' : 'bg-slate-950 text-slate-400'}`}>
                  {user ? 'AUTHENTICATED' : 'ANONYMOUS'}
                </span>
              </div>
              <button 
                onClick={enableDemoMode}
                className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white rounded font-bold cursor-pointer transition-all"
              >
                Launch Demo Mode (Bypass Auth)
              </button>
            </div>

            {/* Scrollable logs terminal */}
            <div className="flex-1 p-3 overflow-y-auto bg-slate-950 font-mono text-[11px] leading-relaxed select-text flex flex-col gap-1.5 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
              {debugLogs.length === 0 ? (
                <p className="text-slate-600 italic">No logs recorded yet...</p>
              ) : (
                debugLogs.map((log, idx) => {
                  let colorClass = "text-slate-400";
                  if (log.startsWith("[Error]") || log.includes("Error]")) colorClass = "text-red-400 font-semibold";
                  else if (log.startsWith("[Console Warn]") || log.includes("Warn]")) colorClass = "text-amber-400";
                  else if (log.startsWith("[System]")) colorClass = "text-indigo-400 font-bold";
                  else if (log.startsWith("[DB Status")) colorClass = "text-teal-400";
                  else if (log.includes("successfully") || log.includes("Success")) colorClass = "text-green-400";
                  return (
                    <div key={idx} className={`${colorClass} hover:bg-slate-900/50 px-1 py-0.5 rounded transition-colors break-words`}>
                      {log}
                    </div>
                  );
                })
              )}
            </div>

            {/* Actions Footer */}
            <div className="p-3 border-t border-slate-800 bg-slate-950/50 flex gap-2 justify-end">
              <button
                onClick={() => {
                  try {
                    const statusText = `=== PROHEADSHOT AI DIAGNOSTICS ===\nTime: ${new Date().toISOString()}\nDatabase Access: ${dbStatus.success}\nUser: ${user ? user.email : 'None'}\n\n=== LOGS ===\n${debugLogs.join('\n')}`;
                    navigator.clipboard.writeText(statusText);
                    setWasCopied(true);
                    setTimeout(() => setWasCopied(false), 2000);
                  } catch (e) {
                    alert("Failed to copy logs to clipboard.");
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 rounded-lg text-xs font-bold transition-all cursor-pointer"
              >
                {wasCopied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{wasCopied ? 'Copied' : 'Copy System Logs'}</span>
              </button>
            </div>
          </div>
        )}
      </div>}
    </div>
  );
};

export default App;
