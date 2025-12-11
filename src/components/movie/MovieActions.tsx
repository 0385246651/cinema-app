'use client';

import React, { useState, useEffect } from 'react';
import { Heart, Star, Share2, BookmarkPlus, Check, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from '@/components/auth';
import { StarRating } from '@/components/ui/StarRating';
import {
  addToFavorites,
  removeFromFavorites,
  isFavorite,
  rateMovie,
  getUserRating,
} from '@/services/movieService';
import { cn } from '@/lib/utils';
import type { MovieDetail } from '@/types';

interface MovieActionsProps {
  movie: MovieDetail['movie'];
}

export function MovieActions({ movie }: MovieActionsProps) {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showRating, setShowRating] = useState(false);

  // Check favorite status and user rating on mount
  useEffect(() => {
    if (user) {
      checkFavoriteStatus();
      loadUserRating();
    }
  }, [user, movie.slug]);

  const checkFavoriteStatus = async () => {
    if (!user) return;
    const status = await isFavorite(user.uid, movie.slug);
    setIsFav(status);
  };

  const loadUserRating = async () => {
    if (!user) return;
    const rating = await getUserRating(user.uid, movie.slug);
    if (rating) {
      setUserRating(rating.rating);
    }
  };

  const handleFavoriteClick = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setLoading(true);
    try {
      if (isFav) {
        await removeFromFavorites(user.uid, movie.slug);
        setIsFav(false);
      } else {
        await addToFavorites(user.uid, {
          movieSlug: movie.slug,
          movieName: movie.name,
          moviePoster: movie.poster_url || movie.thumb_url || '',
          movieYear: movie.year,
          movieType: movie.type,
        });
        setIsFav(true);
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRatingChange = async (rating: number) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    try {
      await rateMovie(user.uid, {
        movieSlug: movie.slug,
        movieName: movie.name,
        rating,
      });
      setUserRating(rating);
    } catch (err) {
      console.error('Error rating movie:', err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: movie.name,
          text: `Xem phim ${movie.name} tại PhimHay`,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Đã sao chép link vào clipboard!');
    }
  };

  return (
    <>
      <div className="flex items-center gap-3 flex-wrap">
        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          disabled={loading}
          className={cn(
            'flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all',
            isFav
              ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
              : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:text-white'
          )}
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Heart className={cn('w-5 h-5', isFav && 'fill-pink-400')} />
          )}
          <span>{isFav ? 'Đã thích' : 'Yêu thích'}</span>
        </button>

        {/* Rating Button */}
        <div className="relative">
          <button
            onClick={() => setShowRating(!showRating)}
            className={cn(
              'flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all',
              userRating > 0
                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:text-white'
            )}
          >
            <Star className={cn('w-5 h-5', userRating > 0 && 'fill-yellow-400')} />
            <span>{userRating > 0 ? `${userRating}/5` : 'Đánh giá'}</span>
          </button>

          {/* Rating Popup */}
          {showRating && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowRating(false)}
              />
              <div className="absolute left-0 bottom-full mb-2 p-4 bg-[#0a0a1a]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50">
                <p className="text-sm text-white/60 mb-3">Đánh giá phim này:</p>
                <StarRating
                  value={userRating}
                  onChange={(rating) => {
                    handleRatingChange(rating);
                    setShowRating(false);
                  }}
                  size="lg"
                />
              </div>
            </>
          )}
        </div>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-5 py-3 rounded-xl font-medium bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:text-white transition-all"
        >
          <Share2 className="w-5 h-5" />
          <span className="hidden sm:inline">Chia sẻ</span>
        </button>
      </div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}
