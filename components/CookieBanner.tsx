
import React, { useState, useEffect } from 'react';
import { X, Cookie } from 'lucide-react';

const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('cookie-consent');
      if (!consent) {
        const timer = setTimeout(() => setIsVisible(true), 1500);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      console.warn("localStorage not available:", e);
    }
  }, []);

  const handleConsent = (choice: 'accepted' | 'rejected') => {
    try {
      localStorage.setItem('cookie-consent', choice);
    } catch (e) {
      console.warn("localStorage not available:", e);
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 pointer-events-none">
      <div className="container mx-auto max-w-4xl pointer-events-auto">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 animate-in slide-in-from-bottom-full duration-500">
          <div className="hidden md:flex p-3 bg-blue-500/10 rounded-full">
            <Cookie className="w-8 h-8 text-blue-400" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h4 className="text-lg font-bold text-white mb-2 flex items-center justify-center md:justify-start gap-2">
              <Cookie className="w-5 h-5 text-blue-400 md:hidden" />
              Cookie Preferences
            </h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              We use cookies to enhance your experience, analyze site traffic, and support our marketing efforts. Your privacy choice is stored in your browser.
            </p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button 
              onClick={() => handleConsent('rejected')}
              className="flex-1 md:flex-none px-6 py-2.5 text-slate-400 hover:text-white text-sm font-medium transition-colors"
            >
              Reject All
            </button>
            <button 
              onClick={() => handleConsent('accepted')}
              className="flex-1 md:flex-none px-8 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-900/20"
            >
              Accept All
            </button>
            <button 
              onClick={() => setIsVisible(false)}
              className="hidden md:block p-1 text-slate-500 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
