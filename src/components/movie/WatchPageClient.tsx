'use client';

import React, { useEffect } from 'react';
import { VideoPlayer, EmbedPlayer } from '@/components/movie';
import { MovieActions } from '@/components/movie/MovieActions';
import { LiveChat } from '@/components/movie/LiveChat';
import { useAuth } from '@/contexts/AuthContext';
import { saveWatchProgress } from '@/services/movieService';

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
  serverIndex: number;
  poster: string;
  hasPrev: boolean;
  hasNext: boolean;
}

export function WatchPageClient({
  movie,
  currentEpisode,
  serverIndex,
  poster,
  hasPrev,
  hasNext,
}: WatchPageClientProps) {
  const hasStream = Boolean(currentEpisode.link_m3u8);
  const hasEmbed = Boolean(currentEpisode.link_embed);

  return (
    <>
      <div className="space-y-4">
        {/* Video Player with tracking */}
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
          />
        ) : hasEmbed ? (
          <EmbedPlayer src={currentEpisode.link_embed} />
        ) : (
          <div className="relative aspect-video bg-black/60 rounded-2xl flex items-center justify-center border border-white/10">
            <p className="text-white/70 text-sm">Không có nguồn phát cho tập này.</p>
          </div>
        )}

        {/* Movie Actions - Favorite, Rating, Share */}
        <div className="glass-card p-4 rounded-xl">
          <MovieActions movie={movie} />
        </div>
      </div>

      {/* Live Chat */}
      <LiveChat movieSlug={movie.slug} movieName={movie.name} />
    </>
  );
}
