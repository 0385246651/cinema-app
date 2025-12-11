'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  subscribePrivateMessages,
  sendPrivateMessage,
  markMessagesAsRead,
  subscribeUserStatus,
} from '@/services/socialService';
import { Send, ArrowLeft, Smile, MoreVertical, Circle } from 'lucide-react';

// Simple emoji list
const EMOJI_LIST = [
  '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '😊',
  '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😋', '😛', '😜',
  '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐',
  '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪',
  '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶',
  '🥴', '😵', '🤯', '🤠', '🥳', '😎', '🤓', '🧐', '😕', '😟',
  '🙁', '☹️', '😮', '😯', '😲', '😳', '🥺', '😦', '😧', '😨',
  '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞', '😓', '😩',
  '😫', '🥱', '😤', '😡', '😠', '🤬', '👍', '👎', '👏', '🙌',
  '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '💔', '💕',
];

interface Friend {
  odUserId: string;
  userName: string;
  userPhoto?: string;
}

interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  senderPhoto?: string;
  receiverId: string;
  message: string;
  createdAt: number;
  read: boolean;
}

interface PrivateChatProps {
  friend: Friend;
  onBack?: () => void;
}

export default function PrivateChat({ friend, onBack }: PrivateChatProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [friendStatus, setFriendStatus] = useState<{ isOnline: boolean; lastSeen: number }>({
    isOnline: false,
    lastSeen: 0,
  });
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Subscribe to messages
  useEffect(() => {
    if (!user) return;

    const unsubMessages = subscribePrivateMessages(user.uid, friend.odUserId, (data) => {
      setMessages(data);
      // Mark as read when receiving new messages
      markMessagesAsRead(user.uid, friend.odUserId);
    });

    const unsubStatus = subscribeUserStatus(friend.odUserId, setFriendStatus);

    // Mark existing messages as read
    markMessagesAsRead(user.uid, friend.odUserId);

    return () => {
      unsubMessages();
      unsubStatus();
    };
  }, [user, friend.odUserId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!user || !newMessage.trim() || sending) return;

    setSending(true);
    try {
      await sendPrivateMessage(user, friend.odUserId, newMessage.trim());
      setNewMessage('');
      setShowEmoji(false);
      inputRef.current?.focus();
    } catch (error) {
      console.error('Send error:', error);
    } finally {
      setSending(false);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage((prev) => prev + emoji);
    inputRef.current?.focus();
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatLastSeen = (timestamp: number) => {
    if (!timestamp) return 'Không xác định';
    
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 60000) return 'Vừa mới';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} phút trước`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} giờ trước`;
    return new Date(timestamp).toLocaleDateString('vi-VN');
  };

  // Group messages by date
  const groupedMessages: { date: string; messages: Message[] }[] = [];
  let currentDate = '';
  
  messages.forEach((msg) => {
    const msgDate = new Date(msg.createdAt).toDateString();
    if (msgDate !== currentDate) {
      currentDate = msgDate;
      groupedMessages.push({ date: msgDate, messages: [msg] });
    } else {
      groupedMessages[groupedMessages.length - 1].messages.push(msg);
    }
  });

  if (!user) return null;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-white/10 bg-white/5">
        {onBack && (
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-lg hover:bg-white/10 transition-colors lg:hidden"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}

        {/* Avatar */}
        <div className="relative">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-emerald-500 to-cyan-500">
            {friend.userPhoto ? (
              <img
                src={friend.userPhoto}
                alt={friend.userName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white font-bold">
                {friend.userName?.charAt(0)?.toUpperCase()}
              </div>
            )}
          </div>
          <Circle
            className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 ${
              friendStatus.isOnline ? 'text-emerald-500 fill-emerald-500' : 'text-zinc-500 fill-zinc-500'
            }`}
          />
        </div>

        {/* Info */}
        <div className="flex-1">
          <h3 className="font-semibold text-white">{friend.userName}</h3>
          <p className="text-xs text-zinc-400">
            {friendStatus.isOnline ? (
              <span className="text-emerald-400">Đang hoạt động</span>
            ) : (
              `Hoạt động ${formatLastSeen(friendStatus.lastSeen)}`
            )}
          </p>
        </div>

        {/* Actions */}
        <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
          <MoreVertical className="w-5 h-5 text-zinc-400" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/20">
        {messages.length === 0 ? (
          <div className="text-center py-12 text-zinc-400">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
              <Send className="w-8 h-8" />
            </div>
            <p>Chưa có tin nhắn nào</p>
            <p className="text-sm mt-1">Hãy gửi lời chào đầu tiên!</p>
          </div>
        ) : (
          groupedMessages.map((group) => (
            <div key={group.date}>
              {/* Date Divider */}
              <div className="flex items-center gap-4 my-4">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-xs text-zinc-500 px-2">
                  {new Date(group.date).toLocaleDateString('vi-VN', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'numeric',
                  })}
                </span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* Messages in group */}
              <div className="space-y-2">
                {group.messages.map((msg) => {
                  const isMe = msg.senderId === user.uid;
                  
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                          isMe
                            ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-br-md'
                            : 'bg-white/10 text-white rounded-bl-md'
                        }`}
                      >
                        <p className="break-words whitespace-pre-wrap">{msg.message}</p>
                        <div className={`flex items-center gap-1 mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <span className={`text-xs ${isMe ? 'text-white/70' : 'text-zinc-500'}`}>
                            {formatTime(msg.createdAt)}
                          </span>
                          {isMe && msg.read && (
                            <span className="text-xs text-white/70">• Đã xem</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/10 bg-white/5 relative">
        {/* Emoji Picker */}
        {showEmoji && (
          <div className="absolute bottom-full left-0 mb-2 p-3 bg-zinc-900 border border-white/10 rounded-xl shadow-xl z-50 w-72">
            <div className="grid grid-cols-10 gap-1 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20">
              {EMOJI_LIST.map((emoji, idx) => (
                <button
                  key={idx}
                  onClick={() => handleEmojiSelect(emoji)}
                  className="p-1.5 text-xl hover:bg-white/10 rounded transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowEmoji(!showEmoji)}
            className={`p-2.5 rounded-xl transition-colors ${
              showEmoji ? 'bg-emerald-500/20 text-emerald-400' : 'hover:bg-white/10 text-zinc-400'
            }`}
          >
            <Smile className="w-5 h-5" />
          </button>

          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Nhập tin nhắn..."
            className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50"
          />

          <button
            onClick={handleSend}
            disabled={!newMessage.trim() || sending}
            className="p-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all"
          >
            {sending ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
