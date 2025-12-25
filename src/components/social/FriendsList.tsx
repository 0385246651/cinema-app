'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import {
  subscribeFriends,
  subscribeFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
  searchUsers,
  sendFriendRequest,
} from '@/services/socialService';
import { UserPlus, Users, Bell, Search, Check, X, UserX } from 'lucide-react';

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

interface FriendsListProps {
  onSelectFriend?: (friend: Friend) => void;
  selectedFriendId?: string;
}

export default function FriendsList({ onSelectFriend, selectedFriendId }: FriendsListProps) {
  const { user } = useAuth();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  // const [unreadCount, setUnreadCount] = useState(0); // Unused
  const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'search'>('friends');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    setLoading(true);

    const unsubFriends = subscribeFriends(user.uid, (data) => {
      console.log('Friends data:', data);
      setFriends(data);
      setLoading(false);
    });

    const unsubRequests = subscribeFriendRequests(user.uid, setRequests);
    // const unsubUnread = subscribeUnreadCount(user.uid, setUnreadCount); // Unused

    return () => {
      unsubFriends();
      unsubRequests();
      // unsubUnread();
    };
  }, [user]);

  const handleSearch = async () => {
    if (!user || !searchTerm.trim()) return;

    setIsSearching(true);
    try {
      const results = await searchUsers(searchTerm, user.uid);
      setSearchResults(results as SearchResult[]);
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
      // Remove from search results after sending
      setSearchResults((prev) => prev.filter((u) => u.odUserId !== toUserId));
    } catch (error: unknown) {
      alert((error as Error).message || 'Không thể gửi lời mời');
    }
  };

  const handleAcceptRequest = async (request: FriendRequest) => {
    if (!user) return;

    try {
      await acceptFriendRequest(user, request);
    } catch (error) {
      console.error('Accept error:', error);
    }
  };

  const handleRejectRequest = async (fromUserId: string) => {
    if (!user) return;

    try {
      await rejectFriendRequest(user.uid, fromUserId);
    } catch (error) {
      console.error('Reject error:', error);
    }
  };

  const handleRemoveFriend = async (friendId: string) => {
    if (!user) return;
    // Removed confirm for now to ensure action works
    // if (!confirm('Bạn có chắc muốn xóa bạn này?')) return;

    try {
      await removeFriend(user.uid, friendId);
    } catch (error) {
      console.error('Remove error:', error);
    }
  };

  const formatTime = (timestamp?: number) => {
    if (!timestamp) return '';
    const now = Date.now();
    const diff = now - timestamp;

    if (diff < 60000) return 'Vừa xong';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} phút`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} giờ`;
    return new Date(timestamp).toLocaleDateString('vi-VN');
  };

  if (!user) {
    return (
      <div className="glass-card p-6 text-center">
        <Users className="w-12 h-12 mx-auto mb-3 text-zinc-400" />
        <p className="text-zinc-400">Đăng nhập để xem danh sách bạn bè</p>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      {/* Header Tabs */}
      <div className="flex border-b border-white/10">
        <button
          onClick={() => setActiveTab('friends')}
          className={`flex-1 px-4 py-3 flex items-center justify-center gap-2 transition-colors ${activeTab === 'friends'
            ? 'bg-white/10 text-white'
            : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
        >
          <Users className="w-4 h-4" />
          <span>Bạn bè</span>
          {friends.length > 0 && (
            <span className="ml-1 px-1.5 py-0.5 text-xs bg-emerald-500/20 text-emerald-400 rounded-full">
              {friends.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('requests')}
          className={`flex-1 px-4 py-3 flex items-center justify-center gap-2 transition-colors ${activeTab === 'requests'
            ? 'bg-white/10 text-white'
            : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
        >
          <Bell className="w-4 h-4" />
          <span>Lời mời</span>
          {requests.length > 0 && (
            <span className="ml-1 px-1.5 py-0.5 text-xs bg-red-500/20 text-red-400 rounded-full animate-pulse">
              {requests.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('search')}
          className={`flex-1 px-4 py-3 flex items-center justify-center gap-2 transition-colors ${activeTab === 'search'
            ? 'bg-white/10 text-white'
            : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
        >
          <UserPlus className="w-4 h-4" />
          <span>Thêm bạn</span>
        </button>
      </div>

      {/* Content */}
      <div className="p-4 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20">
        {/* Friends Tab */}
        {activeTab === 'friends' && (
          <div className="space-y-2">
            {loading ? (
              <div className="text-center py-8 text-zinc-400">
                <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                Đang tải...
              </div>
            ) : friends.length === 0 ? (
              <div className="text-center py-8 text-zinc-400">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Chưa có bạn bè nào</p>
                <p className="text-sm mt-1">Tìm kiếm và kết bạn ngay!</p>
              </div>
            ) : (
              friends.map((friend) => (
                <div
                  key={friend.odUserId}
                  onClick={() => onSelectFriend?.(friend)}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 group ${selectedFriendId === friend.odUserId
                    ? 'bg-emerald-500/20 border border-emerald-500/50'
                    : 'hover:bg-white/5 border border-transparent'
                    }`}
                >
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-emerald-500 to-cyan-500 relative">
                      {friend.userPhoto ? (
                        <Image
                          src={friend.userPhoto}
                          alt={friend.userName}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg">
                          {friend.userName?.charAt(0)?.toUpperCase()}
                        </div>
                      )}
                    </div>
                    {/* Online indicator */}
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-zinc-500 rounded-full border-2 border-zinc-900" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white truncate">
                        {friend.userName}
                      </span>
                      {friend.unreadCount && friend.unreadCount > 0 && (
                        <span className="px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full">
                          {friend.unreadCount}
                        </span>
                      ) || null}
                    </div>
                    {friend.lastMessage && (
                      <p className="text-sm text-zinc-400 truncate">
                        {friend.lastMessage}
                      </p>
                    )}
                  </div>

                  {/* Time & Actions */}
                  <div className="flex items-center gap-2">
                    {friend.lastMessageAt && (
                      <span className="text-xs text-zinc-500">
                        {formatTime(friend.lastMessageAt)}
                      </span>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFriend(friend.odUserId);
                      }}
                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                      title="Xóa bạn"
                    >
                      <UserX className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Requests Tab */}
        {activeTab === 'requests' && (
          <div className="space-y-2">
            {requests.length === 0 ? (
              <div className="text-center py-8 text-zinc-400">
                <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Không có lời mời kết bạn</p>
              </div>
            ) : (
              requests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10"
                >
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-orange-500 to-pink-500 relative">
                    {request.fromUserPhoto ? (
                      <Image
                        src={request.fromUserPhoto}
                        alt={request.fromUserName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg">
                        {request.fromUserName?.charAt(0)?.toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-white block truncate">
                      {request.fromUserName}
                    </span>
                    <span className="text-sm text-zinc-400">
                      Muốn kết bạn với bạn
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAcceptRequest(request)}
                      className="p-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 transition-colors"
                      title="Chấp nhận"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleRejectRequest(request.fromUserId)}
                      className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors"
                      title="Từ chối"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Search Tab */}
        {activeTab === 'search' && (
          <div className="space-y-4">
            {/* Search Input */}
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Tìm theo tên hoặc email..."
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              </div>
              <button
                onClick={handleSearch}
                disabled={isSearching || !searchTerm.trim()}
                className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
              >
                {isSearching ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Tìm'
                )}
              </button>
            </div>

            {/* Search Results */}
            <div className="space-y-2">
              {searchResults.length === 0 ? (
                <div className="text-center py-8 text-zinc-400">
                  <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Nhập tên để tìm bạn bè</p>
                </div>
              ) : (
                searchResults.map((user) => (
                  <div
                    key={user.odUserId}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10"
                  >
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-violet-500 to-fuchsia-500 relative">
                      {user.photoURL ? (
                        <Image
                          src={user.photoURL}
                          alt={user.displayName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg">
                          {user.displayName?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <span className="font-medium text-white block truncate">
                        {user.displayName || 'Người dùng'}
                      </span>
                      {user.email && (
                        <span className="text-sm text-zinc-400 truncate block">
                          {user.email}
                        </span>
                      )}
                    </div>

                    {/* Add Button */}
                    <button
                      onClick={() => handleSendRequest(user.odUserId)}
                      className="px-3 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span className="hidden sm:inline">Kết bạn</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
