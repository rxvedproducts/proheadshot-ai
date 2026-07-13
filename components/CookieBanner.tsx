
import React, { useState, useEffect } from 'react';
import { X, Cookie } from 'lucide-react';
import { initAnalytics } from '../services/analyticsService';

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
    if (choice === 'accepted') {
      initAnalytics();
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 pointer-events-none">
      <div className="container mx-auto max-w-4xl pointer-events-auto">
        <div className="bg-white border border-stone-200 rounded-2xl shadow-xl shadow-stone-200/60 p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 animate-in slide-in-from-bottom-full duration-500">
          <div className="hidden md:flex p-3 bg-amber-50 rounded-full border border-amber-100">
            <Cookie className="w-8 h-8 text-amber-600" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h4 className="text-lg font-bold text-stone-900 mb-2 flex items-center justify-center md:justify-start gap-2">
              <Cookie className="w-5 h-5 text-amber-600 md:hidden" />
              Cookie Preferences
            </h4>
            <p className="text-stone-500 text-sm leading-relaxed">
              We use cookies to enhance your experience, analyze site traffic, and support our marketing efforts. Your privacy choice is stored in your browser.
            </p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => handleConsent('rejected')}
              className="flex-1 md:flex-none px-6 py-2.5 text-stone-500 hover:text-stone-800 text-sm font-medium transition-colors"
            >
              Reject All
            </button>
            <button
              onClick={() => handleConsent('accepted')}
              className="flex-1 md:flex-none px-8 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold rounded-xl transition-all shadow-sm shadow-amber-100"
            >
              Accept All
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="hidden md:block p-1 text-stone-400 hover:text-stone-700"
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
