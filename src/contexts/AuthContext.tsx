'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
} from 'firebase/auth';
import { ref, set, get, serverTimestamp } from 'firebase/database';
import { auth, database, googleProvider } from '@/lib/firebase';
import { UserProfile, DB_PATHS } from '@/types/firebase';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        // Fetch or create user profile
        await fetchOrCreateUserProfile(user);
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Fetch or create user profile in database
  const fetchOrCreateUserProfile = async (user: User) => {
    try {
      const userRef = ref(database, `${DB_PATHS.users}/${user.uid}`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        // Update last login
        const profile = snapshot.val() as UserProfile;
        await set(userRef, {
          ...profile,
          lastLoginAt: Date.now(),
        });
        setUserProfile({ ...profile, lastLoginAt: Date.now() });
      } else {
        // Create new profile
        const newProfile: UserProfile = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          createdAt: Date.now(),
          lastLoginAt: Date.now(),
        };
        await set(userRef, newProfile);
        setUserProfile(newProfile);
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
    }
  };

  // Sign in with email/password
  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(getErrorMessage(err.code));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sign up with email/password
  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      setError(null);
      setLoading(true);
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update display name
      await updateProfile(user, { displayName });
      
      // Create user profile
      await fetchOrCreateUserProfile({ ...user, displayName } as User);
    } catch (err: any) {
      setError(getErrorMessage(err.code));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setError(null);
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      setError(getErrorMessage(err.code));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
    } catch (err: any) {
      setError(getErrorMessage(err.code));
      throw err;
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      setError(null);
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      setError(getErrorMessage(err.code));
      throw err;
    }
  };

  // Update user profile
  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    
    try {
      const userRef = ref(database, `${DB_PATHS.users}/${user.uid}`);
      await set(userRef, {
        ...userProfile,
        ...data,
      });
      setUserProfile((prev) => prev ? { ...prev, ...data } : null);
    } catch (err: any) {
      setError(getErrorMessage(err.code));
      throw err;
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        error,
        signIn,
        signUp,
        signInWithGoogle,
        logout,
        resetPassword,
        updateUserProfile,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Helper function to get error messages in Vietnamese
function getErrorMessage(code: string): string {
  const messages: Record<string, string> = {
    'auth/email-already-in-use': 'Email này đã được sử dụng',
    'auth/invalid-email': 'Email không hợp lệ',
    'auth/operation-not-allowed': 'Phương thức đăng nhập không được phép',
    'auth/weak-password': 'Mật khẩu quá yếu (tối thiểu 6 ký tự)',
    'auth/user-disabled': 'Tài khoản đã bị vô hiệu hóa',
    'auth/user-not-found': 'Không tìm thấy tài khoản với email này',
    'auth/wrong-password': 'Mật khẩu không chính xác',
    'auth/invalid-credential': 'Thông tin đăng nhập không hợp lệ',
    'auth/too-many-requests': 'Quá nhiều yêu cầu, vui lòng thử lại sau',
    'auth/popup-closed-by-user': 'Đã đóng cửa sổ đăng nhập',
    'auth/network-request-failed': 'Lỗi kết nối mạng',
  };
  return messages[code] || 'Đã xảy ra lỗi, vui lòng thử lại';
}
