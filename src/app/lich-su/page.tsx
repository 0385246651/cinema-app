'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { removeFromHistory, subscribeToWatchHistory } from '@/services/movieService';
import { WatchHistory } from '@/types/firebase';
import { History, Play, Trash2, Clock, Film, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function WatchHistoryPage() {
  const { user, loading: authLoading } = useAuth();
  const [history, setHistory] = useState<WatchHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'watching' | 'completed'>('all');

  useEffect(() => {
    if (!user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (loading) setLoading(false);
      return;
    }

    // Subscribe to realtime updates
    const unsubscribe = subscribeToWatchHistory(user.uid, (items) => {
      setHistory(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, loading]);

  const handleRemove = async (movieSlug: string, episodeSlug?: string) => {
    if (!user) return;

    try {
      await removeFromHistory(user.uid, movieSlug, episodeSlug);
    } catch (error) {
      console.error('Error removing from history:', error);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return 'Hôm nay';
    } else if (days === 1) {
      return 'Hôm qua';
    } else if (days < 7) {
      return `${days} ngày trước`;
    } else {
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes} phút`;
  };

  const filteredHistory = history.filter((item) => {
    if (filter === 'watching') return !item.completed && item.progress < 90;
    if (filter === 'completed') return item.completed || item.progress >= 90;
    return true;
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 rounded-full bg-violet-500/20 flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-violet-400" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Vui lòng đăng nhập</h1>
            <p className="text-white/60 mb-6">
              Đăng nhập để xem lịch sử phim bạn đã xem
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl font-medium hover:opacity-90 transition-opacity"
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Lịch sử xem</h1>
            <p className="text-white/60 text-sm">{history.length} phim trong lịch sử</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {[
            { value: 'all', label: 'Tất cả' },
            { value: 'watching', label: 'Đang xem' },
            { value: 'completed', label: 'Đã xem xong' },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => setFilter(item.value as typeof filter)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                filter === item.value
                  ? 'bg-violet-600 text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
              <Film className="w-10 h-10 text-white/40" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Chưa có lịch sử xem</h2>
            <p className="text-white/60 mb-6">
              {filter === 'all'
                ? 'Bạn chưa xem phim nào. Hãy khám phá ngay!'
                : filter === 'watching'
                  ? 'Không có phim đang xem dở'
                  : 'Không có phim đã xem xong'}
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl font-medium hover:opacity-90 transition-opacity"
            >
              Khám phá phim
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredHistory.map((item, index) => (
              <div
                key={`${item.movieSlug}-${item.episodeSlug || 'full'}`}
                className="glass-card rounded-xl overflow-hidden hover:border-white/20 transition-all group"
              >
                <div className="flex gap-4 p-4">
                  {/* Poster */}
                  <Link
                    href={item.episodeSlug
                      ? `/xem-phim/${item.movieSlug}/${item.episodeSlug}`
                      : `/phim/${item.movieSlug}`
                    }
                    className="flex-shrink-0"
                  >
                    <div className="relative w-28 md:w-36 aspect-[2/3] rounded-lg overflow-hidden">
                      <Image
                        src={item.moviePoster || '/placeholder.jpg'}
                        alt={item.movieName}
                        fill
                        sizes="(max-width: 768px) 112px, 144px"
                        priority={index < 2}
                        className="object-cover"
                      />
                      {/* Progress Bar */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
                        <div
                          className={cn(
                            'h-full',
                            item.completed || item.progress >= 90
                              ? 'bg-green-500'
                              : 'bg-violet-500'
                          )}
                          style={{ width: `${Math.min(item.progress, 100)}%` }}
                        />
                      </div>
                      {/* Play Overlay */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <div className="w-12 h-12 rounded-full bg-violet-600 flex items-center justify-center">
                          <Play className="w-5 h-5 fill-white ml-0.5" />
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={item.episodeSlug
                        ? `/xem-phim/${item.movieSlug}/${item.episodeSlug}`
                        : `/phim/${item.movieSlug}`
                      }
                    >
                      <h3 className="font-semibold text-lg line-clamp-2 hover:text-violet-400 transition-colors">
                        {item.movieName}
                      </h3>
                    </Link>

                    {item.episodeName && (
                      <p className="text-white/60 text-sm mt-1">
                        {item.episodeName}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-white/50">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {formatDate(item.updatedAt)}
                      </span>
                      <span>
                        {formatDuration(item.currentTime)} / {formatDuration(item.duration)}
                      </span>
                      <span className={cn(
                        'px-2 py-0.5 rounded-full text-xs font-medium',
                        item.completed || item.progress >= 90
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-violet-500/20 text-violet-400'
                      )}>
                        {item.completed || item.progress >= 90
                          ? 'Đã xem xong'
                          : `Đã xem ${Math.round(item.progress)}%`}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-4">
                      <Link
                        href={item.episodeSlug
                          ? `/xem-phim/${item.movieSlug}/${item.episodeSlug}`
                          : `/phim/${item.movieSlug}`
                        }
                        className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg text-sm font-medium transition-colors"
                      >
                        <Play className="w-4 h-4" />
                        {item.completed || item.progress >= 90 ? 'Xem lại' : 'Tiếp tục xem'}
                      </Link>
                      <button
                        onClick={() => handleRemove(item.movieSlug, item.episodeSlug)}
                        className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 transition-all"
                        title="Xóa khỏi lịch sử"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
