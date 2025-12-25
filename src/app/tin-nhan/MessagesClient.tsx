'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import FriendsList from '@/components/social/FriendsList';
import PrivateChat from '@/components/social/PrivateChat';
import { MessageCircle, Users } from 'lucide-react';
import { updateOnlineStatus } from '@/services/socialService';

interface Friend {
  odUserId: string;
  userName: string;
  userPhoto?: string;
  lastMessage?: string;
  lastMessageAt?: number;
  unreadCount?: number;
}

export default function MessagesClient() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);

  // Update online status
  useEffect(() => {
    if (!user) return;

    // Set online when component mounts
    updateOnlineStatus(user.uid, true);

    // Set offline when leaving
    const handleBeforeUnload = () => {
      updateOnlineStatus(user.uid, false);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      updateOnlineStatus(user.uid, false);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [user]);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center">
              <MessageCircle className="w-6 h-6" />
            </div>
            Tin nhắn
          </h1>
          <p className="text-zinc-400 mt-2">Trò chuyện với bạn bè của bạn</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Friends List - Left Side */}
          <div className={`${selectedFriend ? 'hidden lg:block' : 'block'}`}>
            <FriendsList
              onSelectFriend={setSelectedFriend}
              selectedFriendId={selectedFriend?.odUserId}
            />
          </div>

          {/* Chat Area - Right Side */}
          <div className="lg:col-span-2">
            {selectedFriend ? (
              <div className="glass-card h-full overflow-hidden">
                <PrivateChat
                  friend={selectedFriend}
                  onBack={() => setSelectedFriend(null)}
                />
              </div>
            ) : (
              <div className="glass-card h-full flex items-center justify-center">
                <div className="text-center text-zinc-400">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                    <Users className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Chọn một cuộc trò chuyện
                  </h3>
                  <p>Chọn một người bạn từ danh sách để bắt đầu nhắn tin</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
