'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { removeRating, subscribeToRatings } from '@/services/movieService';
import { MovieRating } from '@/types/firebase';
import { Star, Trash2, Film, AlertCircle, Loader2, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function RatingsPage() {
  const { user, loading: authLoading } = useAuth();
  const [ratings, setRatings] = useState<MovieRating[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      if (loading) setLoading(false);
      return;
    }

    // Subscribe to realtime updates
    const unsubscribe = subscribeToRatings(user.uid, (items) => {
      setRatings(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, loading]);

  const handleRemove = async (movieSlug: string) => {
    if (!user) return;
    // Removed confirm for now to ensure action works
    // if (!confirm('Bạn có chắc muốn xóa đánh giá này?')) return;

    try {
      await removeRating(user.uid, movieSlug);
    } catch (error: any) {
      console.error('Error removing rating:', error);
      alert('Không thể xóa đánh giá: ' + (error.message || error));
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

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
              Đăng nhập để xem danh sách phim bạn đã đánh giá
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
            <Star className="w-6 h-6 fill-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Đánh giá của tôi</h1>
            <p className="text-white/60 text-sm">{ratings.length} phim đã đánh giá</p>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
          </div>
        ) : ratings.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
              <Film className="w-10 h-10 text-white/40" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Chưa có đánh giá nào</h2>
            <p className="text-white/60 mb-6">
              Bạn chưa đánh giá phim nào. Hãy xem phim và để lại cảm nhận nhé!
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl font-medium hover:opacity-90 transition-opacity"
            >
              Khám phá phim
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ratings.map((item, index) => (
              <div
                key={item.movieSlug}
                className="glass-card rounded-xl overflow-hidden hover:border-white/20 transition-all group flex flex-col h-full"
              >
                <div className="flex gap-4 p-4 flex-1">
                  {/* Poster */}
                  <Link
                    href={`/phim/${item.movieSlug}`}
                    className="flex-shrink-0"
                  >
                    <div className="relative w-24 aspect-[2/3] rounded-lg overflow-hidden">
                      <Image
                        src={item.moviePoster || '/placeholder.jpg'}
                        alt={item.movieName}
                        fill
                        sizes="(max-width: 768px) 96px, 96px"
                        priority={index < 3}
                        className="object-cover"
                      />
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col">
                    <Link
                      href={`/phim/${item.movieSlug}`}
                      className="mb-1"
                    >
                      <h3 className="font-semibold text-lg line-clamp-1 hover:text-violet-400 transition-colors">
                        {item.movieName}
                      </h3>
                    </Link>

                    <div className="flex items-center gap-1 mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={cn(
                            "w-4 h-4",
                            star <= item.rating
                              ? "fill-yellow-500 text-yellow-500"
                              : "text-white/20"
                          )}
                        />
                      ))}
                      <span className="ml-2 text-yellow-500 font-bold text-sm">
                        {item.rating}/5
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-white/50 mb-3">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(item.createdAt)}</span>
                    </div>

                    {item.content && (
                      <div className="bg-white/5 rounded-lg p-2.5 mb-3">
                        <p className="text-white/80 text-sm line-clamp-2 italic">
                          "{item.content}"
                        </p>
                      </div>
                    )}

                    <div className="mt-auto flex justify-end">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleRemove(item.movieSlug);
                        }}
                        className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 transition-all"
                        title="Xóa đánh giá"
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
