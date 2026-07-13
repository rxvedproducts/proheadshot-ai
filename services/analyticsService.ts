import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported, logEvent, type Analytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: (import.meta as any).env.VITE_FIREBASE_API_KEY,
  authDomain: (import.meta as any).env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: (import.meta as any).env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: (import.meta as any).env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: (import.meta as any).env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: (import.meta as any).env.VITE_FIREBASE_APP_ID,
  measurementId: (import.meta as any).env.VITE_FIREBASE_MEASUREMENT_ID,
};

let analytics: Analytics | null = null;

// Only initializes when explicitly called after the user accepts the cookie
// banner — never on import — so no tracking happens without consent.
export const initAnalytics = () => {
  if (analytics) return; // already initialized
  if (!firebaseConfig.apiKey || !firebaseConfig.measurementId) return;

  // isSupported() guards against private-mode/embedded-webview crashes
  // rather than letting initializeApp throw.
  isSupported()
    .then((supported) => {
      if (supported) {
        const app = initializeApp(firebaseConfig);
        analytics = getAnalytics(app);
      }
    })
    .catch((err) => console.warn('Firebase Analytics unsupported in this environment:', err));
};

// Call once at app startup: resumes tracking for a returning visitor who
// already accepted cookies in a previous session.
export const initAnalyticsIfConsented = () => {
  try {
    if (localStorage.getItem('cookie-consent') === 'accepted') {
      initAnalytics();
    }
  } catch (e) {
    console.warn('localStorage not available for consent check:', e);
  }
};

export const trackEvent = (eventName: string, params?: Record<string, unknown>) => {
  if (!analytics) return;
  try {
    logEvent(analytics, eventName, params);
  } catch (err) {
    console.warn(`Failed to log analytics event "${eventName}":`, err);
  }
};

export const trackScreenView = (screenName: string) => {
  trackEvent('screen_view', { screen_name: screenName, firebase_screen: screenName });
};
