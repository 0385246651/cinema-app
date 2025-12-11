'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { User, LogOut, History, Heart, Star, Settings, ChevronDown, MessageCircle, Users, Bell } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from './AuthModal';
import { cn } from '@/lib/utils';
import { subscribeUnreadCount, subscribeFriendRequests } from '@/services/socialService';

export function UserMenu() {
  const { user, userProfile, logout, loading } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [pendingRequests, setPendingRequests] = useState(0);

  // Subscribe to notifications
  useEffect(() => {
    if (!user) return;

    const unsubUnread = subscribeUnreadCount(user.uid, setUnreadMessages);
    const unsubRequests = subscribeFriendRequests(user.uid, (requests) => {
      setPendingRequests(requests.length);
    });

    return () => {
      unsubUnread();
      unsubRequests();
    };
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      setShowDropdown(false);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (loading) {
    return (
      <div className="w-10 h-10 rounded-xl bg-white/10 animate-pulse" />
    );
  }

  if (!user) {
    return (
      <>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl font-medium text-sm hover:shadow-lg hover:shadow-violet-600/30 transition-all"
        >
          <User className="w-4 h-4" />
          <span className="hidden sm:inline">Đăng nhập</span>
        </button>
        <AuthModal isOpen={showModal} onClose={() => setShowModal(false)} />
      </>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 p-1.5 pr-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
      >
        <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-violet-500/20">
          {user.photoURL ? (
            <Image
              src={user.photoURL}
              alt={user.displayName || 'User'}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-violet-400 font-semibold">
              {(user.displayName || user.email || 'U')[0].toUpperCase()}
            </div>
          )}
          {/* Notification badge */}
          {(unreadMessages > 0 || pendingRequests > 0) && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse border-2 border-zinc-900" />
          )}
        </div>
        <span className="hidden md:inline text-sm font-medium max-w-[100px] truncate">
          {user.displayName || 'User'}
        </span>
        <ChevronDown className={cn(
          "w-4 h-4 text-white/50 transition-transform",
          showDropdown && "rotate-180"
        )} />
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setShowDropdown(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 top-full mt-2 w-64 bg-[#0a0a1a]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50">
            {/* User Info */}
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-violet-500/20 flex-shrink-0">
                  {user.photoURL ? (
                    <Image
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-violet-400 font-bold text-lg">
                      {(user.displayName || user.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold truncate">{user.displayName || 'User'}</p>
                  <p className="text-sm text-white/50 truncate">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              <Link
                href="/tin-nhan"
                onClick={() => setShowDropdown(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="flex-1">Tin nhắn</span>
                {unreadMessages > 0 && (
                  <span className="px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full animate-pulse">
                    {unreadMessages > 99 ? '99+' : unreadMessages}
                  </span>
                )}
              </Link>

              <Link
                href="/ban-be"
                onClick={() => setShowDropdown(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-colors"
              >
                <Users className="w-5 h-5" />
                <span className="flex-1">Bạn bè</span>
                {pendingRequests > 0 && (
                  <span className="px-1.5 py-0.5 text-xs bg-orange-500 text-white rounded-full animate-pulse">
                    {pendingRequests}
                  </span>
                )}
              </Link>

              <div className="my-2 border-t border-white/10" />

              <Link
                href="/lich-su"
                onClick={() => setShowDropdown(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-colors"
              >
                <History className="w-5 h-5" />
                <span>Lịch sử xem</span>
              </Link>
              
              <Link
                href="/yeu-thich"
                onClick={() => setShowDropdown(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-colors"
              >
                <Heart className="w-5 h-5" />
                <span>Phim yêu thích</span>
              </Link>
              
              <Link
                href="/danh-gia"
                onClick={() => setShowDropdown(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-colors"
              >
                <Star className="w-5 h-5" />
                <span>Đánh giá của tôi</span>
              </Link>
              
              <Link
                href="/tai-khoan"
                onClick={() => setShowDropdown(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-colors"
              >
                <Settings className="w-5 h-5" />
                <span>Cài đặt tài khoản</span>
              </Link>
            </div>

            {/* Logout */}
            <div className="p-2 border-t border-white/10">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
