'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from '@/components/auth';
import {
  ref,
  push,
  onValue,
  off,
  query,
  orderByChild,
  limitToLast,
  remove,
} from 'firebase/database';
import { database } from '@/lib/firebase';
import { DB_PATHS } from '@/types/firebase';
import {
  MessageCircle,
  Send,
  X,
  Minimize2,
  Maximize2,
  Users,
  Smile,
  Trash2,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  message: string;
  createdAt: number;
  type?: 'message' | 'system';
}

interface LiveChatProps {
  movieSlug: string;
}

// Popular emoji list
const EMOJIS = ['😀', '😂', '🤣', '😍', '🥰', '😎', '🤩', '😢', '😱', '🔥', '❤️', '👍', '👎', '💯', '🎬', '🍿'];

export function LiveChat({ movieSlug }: LiveChatProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [now, setNow] = useState(Date.now());

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Update 'now' every minute for online status
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(interval);
  }, []);

  // Subscribe to messages
  useEffect(() => {
    const chatRef = ref(database, `${DB_PATHS.chat}/${movieSlug}`);
    const chatQuery = query(chatRef, orderByChild('createdAt'), limitToLast(100));

    return onValue(chatQuery, (snapshot) => {
      if (!snapshot.exists()) {
        setMessages([]);
        return;
      }

      const data: ChatMessage[] = [];
      snapshot.forEach((child) => {
        data.push({
          id: child.key!,
          ...child.val(),
        });
      });

      setMessages(data);

      // Update unread count if chat is closed
      if (!isOpen && data.length > messages.length) {
        setUnreadCount((prev) => prev + (data.length - messages.length));
      }
    });
  }, [movieSlug, isOpen, messages.length]);

  // Simulate online users (based on recent messages)
  const onlineCount = useMemo(() => {
    const recentUsers = new Set(
      messages
        .filter((m) => now - m.createdAt < 5 * 60 * 1000) // Last 5 minutes
        .map((m) => m.userId)
    );
    return Math.max(recentUsers.size, 1);
  }, [messages, now]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized]);

  // Reset unread when opening
  const toggleChat = () => {
    if (!isOpen) {
      setUnreadCount(0);
    }
    setIsOpen(!isOpen);
  };

  const handleSend = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (!newMessage.trim()) return;

    const chatRef = ref(database, `${DB_PATHS.chat}/${movieSlug}`);

    try {
      await push(chatRef, {
        userId: user.uid,
        userName: user.displayName || 'Người dùng',
        userPhoto: user.photoURL || null,
        message: newMessage.trim(),
        createdAt: Date.now(),
        type: 'message',
      });

      setNewMessage('');
      setShowEmoji(false);
      inputRef.current?.focus();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleDelete = async (messageId: string) => {
    try {
      const msgRef = ref(database, `${DB_PATHS.chat}/${movieSlug}/${messageId}`);
      await remove(msgRef);
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const addEmoji = (emoji: string) => {
    setNewMessage((prev) => prev + emoji);
    inputRef.current?.focus();
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Floating chat button when closed
  if (!isOpen) {
    return (
      <>
        <button
          onClick={toggleChat}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 transition-all hover:scale-105 group"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="font-medium">Chat</span>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center font-bold animate-bounce">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
          <span className="absolute -bottom-8 right-0 text-xs text-white/50 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            {onlineCount} đang xem
          </span>
        </button>
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </>
    );
  }

  return (
    <>
      <div
        className={cn(
          'fixed z-50 transition-all duration-300 ease-out',
          isMinimized
            ? 'bottom-6 right-6 w-72'
            : 'bottom-6 right-6 w-80 sm:w-96'
        )}
      >
        <div
          className={cn(
            'glass-card rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10',
            'flex flex-col',
            isMinimized ? 'h-14' : 'h-[500px] max-h-[70vh]'
          )}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-violet-600/20 to-purple-600/20 border-b border-white/10 cursor-pointer"
            onClick={() => isMinimized && setIsMinimized(false)}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <MessageCircle className="w-5 h-5 text-violet-400" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Live Chat</h3>
                <p className="text-xs text-white/50 flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {onlineCount} người đang xem
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMinimized(!isMinimized);
                }}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                {isMinimized ? (
                  <Maximize2 className="w-4 h-4" />
                ) : (
                  <Minimize2 className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          {!isMinimized && (
            <>
              <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-3 space-y-3 scroll-smooth"
              >
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <MessageCircle className="w-12 h-12 text-white/20 mb-3" />
                    <p className="text-white/50 text-sm">Chưa có tin nhắn nào</p>
                    <p className="text-white/30 text-xs">Hãy bắt đầu cuộc trò chuyện!</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        'flex gap-2 group',
                        msg.userId === user?.uid && 'flex-row-reverse'
                      )}
                    >
                      {/* Avatar */}
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {msg.userPhoto ? (
                          <Image
                            src={msg.userPhoto}
                            alt={msg.userName}
                            width={32}
                            height={32}
                            className="object-cover"
                          />
                        ) : (
                          <User className="w-4 h-4" />
                        )}
                      </div>

                      {/* Message */}
                      <div
                        className={cn(
                          'max-w-[75%] rounded-2xl px-3 py-2',
                          msg.userId === user?.uid
                            ? 'bg-gradient-to-r from-violet-600 to-purple-600 rounded-tr-sm'
                            : 'bg-white/10 rounded-tl-sm'
                        )}
                      >
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={cn(
                            'text-xs font-medium',
                            msg.userId === user?.uid ? 'text-white/80' : 'text-violet-400'
                          )}>
                            {msg.userId === user?.uid ? 'Bạn' : msg.userName}
                          </span>
                          <span className="text-[10px] text-white/40">
                            {formatTime(msg.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm break-words">{msg.message}</p>
                      </div>

                      {/* Delete button */}
                      {msg.userId === user?.uid && (
                        <button
                          onClick={() => handleDelete(msg.id)}
                          className="self-center p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-400 transition-all"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Emoji Picker */}
              {showEmoji && (
                <div className="px-3 py-2 border-t border-white/10 bg-white/5">
                  <div className="flex flex-wrap gap-1">
                    {EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => addEmoji(emoji)}
                        className="w-8 h-8 rounded hover:bg-white/10 transition-colors text-lg"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-3 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowEmoji(!showEmoji)}
                    className={cn(
                      'p-2 rounded-lg transition-colors',
                      showEmoji ? 'bg-violet-600 text-white' : 'hover:bg-white/10 text-white/50'
                    )}
                  >
                    <Smile className="w-5 h-5" />
                  </button>

                  <input
                    ref={inputRef}
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={user ? 'Nhập tin nhắn...' : 'Đăng nhập để chat'}
                    className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-violet-500/50"
                    disabled={!user}
                  />

                  <button
                    onClick={handleSend}
                    disabled={!newMessage.trim()}
                    className="p-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>

                {!user && (
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="w-full mt-2 py-2 text-xs text-violet-400 hover:text-violet-300 transition-colors"
                  >
                    Đăng nhập để tham gia chat →
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}
