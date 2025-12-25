'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { User, Mail, Camera, Save, LogOut, Settings, Shield, Loader2, Upload } from 'lucide-react';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function AccountClient() {
  const { user, userProfile, updateUserProfile, updateUserPassword, logout, loading } = useAuth();
  const router = useRouter();

  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
      return;
    }

    // Prioritize userProfile if available, otherwise fallback to Auth user
    if (userProfile) {
      setDisplayName(userProfile.displayName || user?.displayName || '');
      setPhotoURL(userProfile.photoURL || user?.photoURL || '');
    } else if (user) {
      setDisplayName(user.displayName || '');
      setPhotoURL(user.photoURL || '');
    }
  }, [user, userProfile, loading, router]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Vui lòng chọn file ảnh hợp lệ' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB
      setMessage({ type: 'error', text: 'Kích thước ảnh không được quá 5MB' });
      return;
    }

    setIsUploading(true);
    setMessage(null);

    try {
      const storageRef = ref(storage, `profile_images/${user.uid}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      setPhotoURL(downloadURL);
      setMessage({ type: 'success', text: 'Đã tải ảnh lên! Nhấn "Lưu thay đổi" để cập nhật.' });
    } catch (error) {
      console.error('Upload error:', error);
      setMessage({ type: 'error', text: 'Lỗi tải ảnh. Vui lòng thử lại.' });
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsUpdating(true);
    setMessage(null);

    try {
      // 1. Update Profile (Name, Photo)
      await updateUserProfile({
        displayName,
        photoURL: photoURL || null
      });

      // 2. Update Password (if provided)
      let msg = 'Cập nhật thông tin thành công!';

      if (newPassword) {
        if (newPassword.length < 6) {
          throw new Error('Mật khẩu mới phải có ít nhất 6 ký tự');
        }
        if (newPassword !== confirmPassword) {
          throw new Error('Mật khẩu xác nhận không khớp');
        }

        await updateUserPassword(newPassword);
        setNewPassword('');
        setConfirmPassword('');
        msg = 'Cập nhật thông tin và mật khẩu thành công!';
      }

      setMessage({ type: 'success', text: msg });

      // Auto clear message after 3s
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      console.error(error);
      setMessage({ type: 'error', text: error.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.' });
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Settings className="w-8 h-8 text-violet-500" />
            Cài đặt tài khoản
          </h1>
          <p className="text-zinc-400">Quản lý thông tin cá nhân và bảo mật</p>
        </div>

        <div className="space-y-6">
          {/* Profile Card */}
          <div className="bg-[#12122a] border border-white/5 rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-violet-500" />
              Thông tin cá nhân
            </h2>

            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="flex flex-col items-center justify-center w-full">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <div
                  className="relative group cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                  title="Nhấn để đổi ảnh đại diện"
                >
                  <div className={`w-32 h-32 rounded-full overflow-hidden bg-violet-500/10 border-4 border-violet-500/20 shadow-xl shadow-violet-500/10 transition-all group-hover:border-violet-500/50 ${isUploading ? 'opacity-50' : ''}`}>
                    {photoURL ? (
                      <Image
                        src={photoURL}
                        alt="Profile"
                        fill
                        sizes="128px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-violet-500">
                        {displayName?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Overlay with Camera Icon */}
                  <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all backdrop-blur-[2px]">
                    {isUploading ? (
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    ) : (
                      <Camera className="w-8 h-8 text-white drop-shadow-lg" />
                    )}
                  </div>

                  {/* Small edit badge button */}
                  <div className="absolute bottom-1 right-1 p-2 bg-violet-600 rounded-full border-4 border-[#12122a] text-white shadow-lg group-hover:scale-110 transition-transform">
                    <Camera className="w-4 h-4" />
                  </div>
                </div>
                <p className="mt-3 text-sm text-zinc-500 font-medium">Nhấn vào ảnh để thay đổi</p>
              </div>

              {/* Basic Info */}
              <div className="grid gap-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                    Tên hiển thị
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Nhập tên hiển thị của bạn"
                      className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-all font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">
                    Email
                  </label>
                  <div className="relative cursor-not-allowed">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                    <input
                      type="email"
                      value={user.email || ''}
                      disabled
                      className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/50"
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-zinc-500">
                    Email không thể thay đổi vì được liên kết với tài khoản đăng nhập.
                  </p>
                </div>
              </div>

              {/* Password Section (Only for Password Users) */}
              {user.providerData.some(p => p.providerId === 'password') && (
                <div className="pt-4 border-t border-white/5">
                  <h3 className="text-lg font-medium text-white mb-4">Đổi mật khẩu</h3>
                  <div className="grid gap-6">
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-1.5">
                        Mật khẩu mới
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                        className="w-full px-4 py-2.5 bg-black/20 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-1.5">
                        Xác nhận mật khẩu
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Nhập lại mật khẩu mới"
                        className="w-full px-4 py-2.5 bg-black/20 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/50 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Message Alert */}
              {message && (
                <div className={`p-4 rounded-xl flex items-center gap-3 ${message.type === 'success'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                  {message.type === 'success' ? (
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                  )}
                  {message.text}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-4 pt-2">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all shadow-lg shadow-violet-600/20"
                >
                  {isUpdating ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  <span>{isUpdating ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Security / Dangerous Zone */}
          <div className="bg-[#12122a] border border-white/5 rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5 text-violet-500" />
              Bảo mật & Đăng nhập
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5">
                <div>
                  <h3 className="font-medium text-white">Đăng xuất</h3>
                  <p className="text-sm text-zinc-400">Đăng xuất khỏi thiết bị hiện tại</p>
                </div>
                <button
                  onClick={() => logout()}
                  className="px-4 py-2 border border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/30 rounded-lg transition-colors text-sm font-medium"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
