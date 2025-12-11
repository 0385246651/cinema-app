import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCBGTYV8M84z6qucLxr2cwDcefQ5CrrELI",
  authDomain: "moveweb-d6b21.firebaseapp.com",
  databaseURL: "https://moveweb-d6b21-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "moveweb-d6b21",
  storageBucket: "moveweb-d6b21.firebasestorage.app",
  messagingSenderId: "825162461954",
  appId: "1:825162461954:web:ba115c285761f44a4c481b",
  measurementId: "G-YJ42GT7FEJ"
};

// Initialize Firebase (prevent re-initialization in development)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize services
export const auth = getAuth(app);
export const database = getDatabase(app);

// Auth providers
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();

// Analytics (only in browser)
export const initAnalytics = async () => {
  if (typeof window !== 'undefined' && await isSupported()) {
    return getAnalytics(app);
  }
  return null;
};

export default app;
