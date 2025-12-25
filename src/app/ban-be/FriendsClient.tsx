'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import FriendsList from '@/components/social/FriendsList';
import { Users, UserPlus, Search, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { subscribeFriends, subscribeFriendRequests, searchUsers, sendFriendRequest } from '@/services/socialService';

interface Friend {
  odUserId: string;
  userName: string;
  userPhoto?: string;
  lastMessage?: string;
  lastMessageAt?: number;
  unreadCount?: number;
}

interface FriendRequest {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromUserPhoto?: string;
}

interface SearchResult {
  odUserId: string;
  displayName: string;
  photoURL?: string;
  email?: string;
}

export default function FriendsClient() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!user) return;

    const unsubFriends = subscribeFriends(user.uid, setFriends);
    const unsubRequests = subscribeFriendRequests(user.uid, setRequests);

    return () => {
      unsubFriends();
      unsubRequests();
    };
  }, [user]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleSearch = async () => {
    if (!user || !searchTerm.trim()) return;

    setIsSearching(true);
    try {
      const results = await searchUsers(searchTerm, user.uid);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSendRequest = async (toUserId: string) => {
    if (!user) return;

    try {
      await sendFriendRequest(user, toUserId);
      setSearchResults((prev) => prev.filter((u) => u.odUserId !== toUserId));
      alert('Đã gửi lời mời kết bạn!');
    } catch (error: unknown) {
      alert((error as Error).message || 'Không thể gửi lời mời');
    }
  };

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500">
              <Users className="w-6 h-6" />
            </div>
            Bạn bè
          </h1>
          <p className="text-zinc-400 mt-2">Quản lý và tìm kiếm bạn bè</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Friends List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search Box */}
            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-400" />
                Tìm bạn mới
              </h3>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Tìm theo tên hoặc email..."
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50"
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                </div>
                <button
                  onClick={handleSearch}
                  disabled={isSearching || !searchTerm.trim()}
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-xl transition-colors font-medium"
                >
                  {isSearching ? 'Đang tìm...' : 'Tìm kiếm'}
                </button>
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="mt-4 space-y-2">
                  {searchResults.map((result) => (
                    <div
                      key={result.odUserId}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10"
                    >
                      <div className="w-12 h-12 relative rounded-full overflow-hidden bg-gradient-to-br from-violet-500 to-fuchsia-500">
                        {result.photoURL ? (
                          <Image
                            src={result.photoURL}
                            alt={result.displayName}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg">
                            {result.displayName?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-white block truncate">
                          {result.displayName || 'Người dùng'}
                        </span>
                        {result.email && (
                          <span className="text-sm text-zinc-400 truncate block">
                            {result.email}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleSendRequest(result.odUserId)}
                        className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg transition-colors flex items-center gap-2"
                      >
                        <UserPlus className="w-4 h-4" />
                        Kết bạn
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Friends Grid */}
            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-violet-400" />
                Danh sách bạn bè ({friends.length})
              </h3>

              {friends.length === 0 ? (
                <div className="text-center py-12 text-zinc-400">
                  <Users className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg">Chưa có bạn bè nào</p>
                  <p className="text-sm mt-1">Tìm kiếm và kết bạn ngay!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {friends.map((friend) => (
                    <div
                      key={friend.odUserId}
                      className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-violet-500/30 transition-all group"
                    >
                      <div className="w-14 h-14 relative rounded-full overflow-hidden bg-gradient-to-br from-emerald-500 to-cyan-500 flex-shrink-0">
                        {friend.userPhoto ? (
                          <Image
                            src={friend.userPhoto}
                            alt={friend.userName}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white font-bold text-xl">
                            {friend.userName?.charAt(0)?.toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-white block truncate">
                          {friend.userName}
                        </span>
                        {friend.lastMessage && (
                          <p className="text-sm text-zinc-400 truncate">
                            {friend.lastMessage}
                          </p>
                        )}
                      </div>
                      <Link
                        href="/tin-nhan"
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 opacity-0 group-hover:opacity-100 transition-all"
                        title="Nhắn tin"
                      >
                        <MessageCircle className="w-5 h-5" />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Friend Requests */}
          <div className="space-y-6">
            {/* Pending Requests */}
            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-orange-400" />
                Lời mời kết bạn
                {requests.length > 0 && (
                  <span className="ml-auto px-2 py-0.5 text-sm bg-red-500/20 text-red-400 rounded-full">
                    {requests.length}
                  </span>
                )}
              </h3>

              <FriendsList />
            </div>

            {/* Quick Stats */}
            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Thống kê</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10">
                  <span className="text-zinc-400">Tổng bạn bè</span>
                  <span className="text-2xl font-bold text-emerald-400">{friends.length}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-orange-500/10">
                  <span className="text-zinc-400">Lời mời đang chờ</span>
                  <span className="text-2xl font-bold text-orange-400">{requests.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
