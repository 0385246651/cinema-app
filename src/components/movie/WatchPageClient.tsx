'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { VideoPlayer, EmbedPlayer } from '@/components/movie';
import { MovieActions } from '@/components/movie/MovieActions';
import { LiveChat } from '@/components/movie/LiveChat';
import { EpisodeDropdown } from '@/components/movie/EpisodeDropdown';
import { SkipForward, X, Clock, Tv } from 'lucide-react';
import type { Episode, EpisodeData } from '@/types';

interface WatchPageClientProps {
  movie: {
    slug: string;
    name: string;
    origin_name: string;
    poster_url: string;
    thumb_url: string;
    year: number;
    type: 'series' | 'single' | 'hoathinh' | 'tvshows';
    quality: string;
    lang: string;
    episode_current: string;
    episode_total: string;
    content: string;
    category: { id: string; name: string; slug: string }[];
    country: { id: string; name: string; slug: string }[];
    actor: string[];
    director: string[];
    view: number;
    status: 'ongoing' | 'completed';
    _id: string;
    time: string;
    trailer_url: string;
    chieurap: boolean;
    sub_docquyen: boolean;
    notify: string;
    showtimes: string;
  };
  currentEpisode: {
    name: string;
    slug: string;
    link_m3u8: string;
    link_embed: string;
  };
  episodes: Episode[];
  serverIndex: number;
  poster: string;
  hasPrev: boolean;
  hasNext: boolean;
  nextEpisodeSlug?: string;
}

export function WatchPageClient({
  movie,
  currentEpisode,
  episodes,
  serverIndex,
  poster,
  hasPrev,
  hasNext,
  nextEpisodeSlug,
}: WatchPageClientProps) {
  const router = useRouter();
  const hasStream = Boolean(currentEpisode.link_m3u8);
  const hasEmbed = Boolean(currentEpisode.link_embed);

  // Auto-next countdown state
  const [showAutoNext, setShowAutoNext] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const autoNextCancelled = useRef(false);

  // Handle video end - start countdown
  const handleVideoEnd = useCallback(() => {
    if (hasNext && nextEpisodeSlug) {
      autoNextCancelled.current = false;
      setShowAutoNext(true);
      setCountdown(10);
    }
  }, [hasNext, nextEpisodeSlug]);

  // Countdown effect
  useEffect(() => {
    if (showAutoNext && countdown > 0 && !autoNextCancelled.current) {
      countdownRef.current = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (showAutoNext && countdown === 0 && !autoNextCancelled.current) {
      // Navigate to next episode
      router.push(`/xem-phim/${movie.slug}/${nextEpisodeSlug}`);
    }

    return () => {
      if (countdownRef.current) {
        clearTimeout(countdownRef.current);
      }
    };
  }, [showAutoNext, countdown, router, movie.slug, nextEpisodeSlug]);

  // Cancel auto-next
  const cancelAutoNext = () => {
    autoNextCancelled.current = true;
    setShowAutoNext(false);
    setCountdown(10);
  };

  // Skip to next immediately
  const skipToNext = () => {
    if (nextEpisodeSlug) {
      router.push(`/xem-phim/${movie.slug}/${nextEpisodeSlug}`);
    }
  };

  // Navigate handlers
  const handlePrev = useCallback(() => {
    const currentServer = episodes[0];
    const currentIndex = currentServer?.server_data.findIndex(ep => ep.slug === currentEpisode.slug);
    if (currentIndex > 0) {
      const prevEp = currentServer.server_data[currentIndex - 1];
      router.push(`/xem-phim/${movie.slug}/${prevEp.slug}`);
    }
  }, [episodes, currentEpisode.slug, movie.slug, router]);

  const handleNext = useCallback(() => {
    if (nextEpisodeSlug) {
      router.push(`/xem-phim/${movie.slug}/${nextEpisodeSlug}`);
    }
  }, [movie.slug, nextEpisodeSlug, router]);

  return (
    <>
      <div className="space-y-4">
        {/* Video Player with tracking */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
          {hasStream ? (
            <VideoPlayer
              src={currentEpisode.link_m3u8}
              poster={poster}
              title={`${movie.name} - ${currentEpisode.name}`}
              movieSlug={movie.slug}
              movieName={movie.name}
              moviePoster={poster}
              episodeSlug={currentEpisode.slug}
              episodeName={currentEpisode.name}
              serverIndex={serverIndex}
              hasPrev={hasPrev}
              hasNext={hasNext}
              onPrev={hasPrev ? handlePrev : undefined}
              onNext={hasNext ? handleNext : undefined}
              onEnded={handleVideoEnd}
            />
          ) : hasEmbed ? (
            <EmbedPlayer src={currentEpisode.link_embed} />
          ) : (
            <div className="relative aspect-video bg-gradient-to-br from-[#0a0a1f] to-[#050510] rounded-2xl flex items-center justify-center border border-white/10">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-white/5 flex items-center justify-center">
                  <Tv className="w-8 h-8 text-white/30" />
                </div>
                <p className="text-white/50 text-sm">Không có nguồn phát cho tập này.</p>
              </div>
            </div>
          )}

          {/* Auto-Next Overlay */}
          {showAutoNext && (
            <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-30 animate-fadeIn">
              <div className="text-center space-y-5 p-8">
                <div className="flex items-center justify-center gap-2 text-white/60 text-sm">
                  <Clock className="w-4 h-4 animate-pulse" />
                  <span>Tập tiếp theo sẽ phát sau</span>
                </div>

                <div className="relative w-28 h-28 mx-auto">
                  {/* Countdown Circle */}
                  <svg className="w-28 h-28 transform -rotate-90">
                    <circle
                      cx="56"
                      cy="56"
                      r="50"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="4"
                      fill="none"
                    />
                    <circle
                      cx="56"
                      cy="56"
                      r="50"
                      stroke="url(#countdownGradient)"
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray={314.16}
                      strokeDashoffset={314.16 * (1 - countdown / 10)}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-linear"
                    />
                    <defs>
                      <linearGradient id="countdownGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="50%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#d946ef" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-white">
                    {countdown}
                  </span>
                </div>

                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={cancelAutoNext}
                    className="px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 border border-white/10"
                  >
                    <X className="w-4 h-4" />
                    Hủy
                  </button>
                  <button
                    onClick={skipToNext}
                    className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 rounded-xl text-sm font-bold transition-all duration-200 flex items-center gap-2 shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105"
                  >
                    <SkipForward className="w-4 h-4" />
                    Xem ngay
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Episode Dropdown - Enhanced */}
        {episodes && episodes.length > 0 && (
          <div className="relative z-20 p-4 bg-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/[0.05] hover:border-violet-500/20 transition-all duration-300">
            <EpisodeDropdown
              episodes={episodes}
              currentSlug={currentEpisode.slug}
              movieSlug={movie.slug}
            />
          </div>
        )}

        {/* Movie Actions - Favorite, Rating, Share */}
        <div className="p-4 bg-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/[0.05]">
          <MovieActions movie={movie} />
        </div>
      </div>

      {/* Live Chat */}
      <LiveChat movieSlug={movie.slug} />
    </>
  );
}

