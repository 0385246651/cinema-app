'use client';

import React, { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = 'login' | 'register' | 'forgot';

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { signIn, signUp, signInWithGoogle, resetPassword, error, clearError, loading } = useAuth();

  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState('');

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setDisplayName('');
    setSuccess('');
    clearError();
  };

  const switchMode = (newMode: AuthMode) => {
    resetForm();
    setMode(newMode);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    clearError();

    try {
      if (mode === 'login') {
        await signIn(email, password);
        onClose();
      } else if (mode === 'register') {
        if (password !== confirmPassword) {
          return;
        }
        await signUp(email, password, displayName);
        onClose();
      } else if (mode === 'forgot') {
        await resetPassword(email);
        setSuccess('Đã gửi email đặt lại mật khẩu!');
      }
    } catch (err) {
      // Error is handled in context
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      onClose();
    } catch (err) {
      // Error is handled in context
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative w-full max-w-lg bg-gradient-to-br from-[#0f0f2a] to-[#050510] rounded-3xl border border-white/10 shadow-2xl shadow-violet-500/10 z-10 transform transition-all">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="relative px-8 pt-10 pb-6 text-center">
            {/* Background Decoration */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-violet-600/20 rounded-full blur-3xl -z-10" />

            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <User className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-bold">
              {mode === 'login' && 'Đăng Nhập'}
              {mode === 'register' && 'Đăng Ký'}
              {mode === 'forgot' && 'Quên Mật Khẩu'}
            </h2>
            <p className="text-white/50 mt-2">
              {mode === 'login' && 'Đăng nhập để lưu lịch sử xem phim'}
              {mode === 'register' && 'Tạo tài khoản mới'}
              {mode === 'forgot' && 'Nhập email để đặt lại mật khẩu'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-4">
            {/* Google Sign In */}
            {mode !== 'forgot' && (
              <>
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-medium transition-all disabled:opacity-50"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Đăng nhập với Google
                </button>

                <div className="flex items-center gap-4">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-white/40 text-sm">hoặc</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>
              </>
            )}

            {/* Display Name (Register only) */}
            {mode === 'register' && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Tên hiển thị"
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-violet-500/50 transition-colors"
                />
              </div>
            )}

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-violet-500/50 transition-colors"
              />
            </div>

            {/* Password */}
            {mode !== 'forgot' && (
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mật khẩu"
                  required
                  minLength={6}
                  className="w-full pl-12 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-violet-500/50 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            )}

            {/* Confirm Password (Register only) */}
            {mode === 'register' && (
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Xác nhận mật khẩu"
                  required
                  minLength={6}
                  className={cn(
                    "w-full pl-12 pr-4 py-3.5 bg-white/5 border rounded-xl text-white placeholder:text-white/40 focus:outline-none transition-colors",
                    confirmPassword && password !== confirmPassword
                      ? "border-red-500/50"
                      : "border-white/10 focus:border-violet-500/50"
                  )}
                />
                {confirmPassword && password !== confirmPassword && (
                  <p className="absolute -bottom-5 left-0 text-xs text-red-400">
                    Mật khẩu không khớp
                  </p>
                )}
              </div>
            )}

            {/* Error Message with Popup Help */}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                <p>{error}</p>
                {error.includes('Popup bị chặn') && (
                  <div className="mt-3 p-3 bg-white/5 rounded-lg text-white/70 text-xs space-y-2">
                    <p className="font-semibold text-white/90">📱 Cách bật popup:</p>
                    <div>
                      <p className="font-medium text-amber-400">iPhone Safari:</p>
                      <p>Settings → Safari → Tắt &quot;Block Pop-ups&quot;</p>
                    </div>
                    <div>
                      <p className="font-medium text-green-400">Chrome Android:</p>
                      <p>⋮ → Settings → Site settings → Pop-ups → Cho phép</p>
                    </div>
                    <p className="text-white/50 italic mt-2">Sau khi bật, quay lại và thử đăng nhập lại.</p>
                  </div>
                )}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-sm">
                {success}
              </div>
            )}

            {/* Forgot Password Link */}
            {mode === 'login' && (
              <button
                type="button"
                onClick={() => switchMode('forgot')}
                className="text-sm text-violet-400 hover:text-violet-300 transition-colors"
              >
                Quên mật khẩu?
              </button>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || (mode === 'register' && password !== confirmPassword)}
              className="w-full py-4 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl font-semibold text-white shadow-lg shadow-violet-600/30 hover:shadow-violet-600/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {mode === 'login' && 'Đăng Nhập'}
              {mode === 'register' && 'Đăng Ký'}
              {mode === 'forgot' && 'Gửi Email'}
            </button>

            {/* Switch Mode */}
            <div className="text-center text-sm text-white/50">
              {mode === 'login' && (
                <>
                  Chưa có tài khoản?{' '}
                  <button
                    type="button"
                    onClick={() => switchMode('register')}
                    className="text-violet-400 hover:text-violet-300 font-medium"
                  >
                    Đăng ký ngay
                  </button>
                </>
              )}
              {mode === 'register' && (
                <>
                  Đã có tài khoản?{' '}
                  <button
                    type="button"
                    onClick={() => switchMode('login')}
                    className="text-violet-400 hover:text-violet-300 font-medium"
                  >
                    Đăng nhập
                  </button>
                </>
              )}
              {mode === 'forgot' && (
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="text-violet-400 hover:text-violet-300 font-medium"
                >
                  ← Quay lại đăng nhập
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
