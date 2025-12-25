'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { removeFromFavorites, subscribeToFavorites } from '@/services/movieService';
import { FavoriteMovie } from '@/types/firebase';
import { Heart, Play, Trash2, AlertCircle, Loader2, Grid, List } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FavoritesPage() {
  const { user, loading: authLoading } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    if (!user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (loading) setLoading(false);
      return;
    }

    const unsubscribe = subscribeToFavorites(user.uid, (items) => {
      setFavorites(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, loading]);

  const handleRemove = async (movieSlug: string) => {
    if (!user) return;

    try {
      await removeFromFavorites(user.uid, movieSlug);
    } catch (error) {
      console.error('Error removing from favorites:', error);
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
            <div className="w-20 h-20 rounded-full bg-pink-500/20 flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-pink-400" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Vui lòng đăng nhập</h1>
            <p className="text-white/60 mb-6">
              Đăng nhập để xem danh sách phim yêu thích của bạn
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
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Phim yêu thích</h1>
              <p className="text-white/60 text-sm">{favorites.length} phim</p>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex gap-1 bg-white/5 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-2 rounded-md transition-all',
                viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white'
              )}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-2 rounded-md transition-all',
                viewMode === 'list' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white'
              )}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-white/40" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Chưa có phim yêu thích</h2>
            <p className="text-white/60 mb-6">
              Thêm phim vào danh sách yêu thích để xem sau
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl font-medium hover:opacity-90 transition-opacity"
            >
              Khám phá phim
            </Link>
          </div>
        ) : viewMode === 'grid' ? (
          // Grid View
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {favorites.map((item) => (
              <div key={item.movieSlug} className="group relative">
                <Link href={`/phim/${item.movieSlug}`}>
                  <div className="relative aspect-[2/3] rounded-xl overflow-hidden">
                    <Image
                      src={item.moviePoster || '/placeholder.jpg'}
                      alt={item.movieName}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-14 h-14 rounded-full bg-violet-600 flex items-center justify-center">
                        <Play className="w-6 h-6 fill-white ml-1" />
                      </div>
                    </div>
                  </div>
                </Link>
                <div className="mt-2">
                  <Link href={`/phim/${item.movieSlug}`}>
                    <h3 className="font-medium line-clamp-2 hover:text-violet-400 transition-colors">
                      {item.movieName}
                    </h3>
                  </Link>
                  {item.movieYear && (
                    <p className="text-sm text-white/50 mt-1">{item.movieYear}</p>
                  )}
                </div>
                <button
                  onClick={() => handleRemove(item.movieSlug)}
                  className="absolute top-2 right-2 w-9 h-9 flex items-center justify-center rounded-lg bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 hover:bg-red-500/80 transition-all"
                  title="Xóa khỏi yêu thích"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          // List View
          <div className="space-y-4">
            {favorites.map((item) => (
              <div
                key={item.movieSlug}
                className="glass-card rounded-xl overflow-hidden hover:border-white/20 transition-all group"
              >
                <div className="flex gap-4 p-4">
                  {/* Poster */}
                  <Link href={`/phim/${item.movieSlug}`} className="flex-shrink-0">
                    <div className="relative w-20 md:w-28 aspect-[2/3] rounded-lg overflow-hidden">
                      <Image
                        src={item.moviePoster || '/placeholder.jpg'}
                        alt={item.movieName}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Play className="w-8 h-8 fill-white" />
                      </div>
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/phim/${item.movieSlug}`}>
                      <h3 className="font-semibold text-lg hover:text-violet-400 transition-colors line-clamp-1">
                        {item.movieName}
                      </h3>
                    </Link>

                    <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-white/50">
                      {item.movieYear && <span>{item.movieYear}</span>}
                      {item.movieType && (
                        <span className="px-2 py-0.5 rounded-full bg-white/5">
                          {item.movieType === 'series' ? 'Phim bộ' : 'Phim lẻ'}
                        </span>
                      )}
                      <span>Thêm: {formatDate(item.addedAt)}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-4">
                      <Link
                        href={`/phim/${item.movieSlug}`}
                        className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg text-sm font-medium transition-colors"
                      >
                        <Play className="w-4 h-4" />
                        Xem ngay
                      </Link>
                      <button
                        onClick={() => handleRemove(item.movieSlug)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 transition-all text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        Xóa
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
