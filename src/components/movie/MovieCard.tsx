'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Star, Clock, Calendar, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getFullImageUrl } from '@/lib/api';
import { QualityBadge, EpisodeBadge } from '@/components/ui';
import type { Movie } from '@/types';

interface MovieCardProps {
  movie: Movie;
  priority?: boolean;
  index?: number;
}

export function MovieCard({ movie, priority = false, index = 0 }: MovieCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <Link
      href={`/phim/${movie.slug}`}
      className={cn(
        "group block relative backface-hidden will-change-transform transition-all duration-500 ease-out",
        "hover:-translate-y-2 hover:scale-[1.02]",
        // Simple entrance animation using Tailwind/CSS
        "animate-in fade-in slide-in-from-bottom-4 duration-700"
      )}
      style={{
        animationDelay: `${index * 50}ms`,
        animationFillMode: 'both'
      }}
    >
      <div style={{ height: 0, paddingTop: '150%', width: '100%' }} className="relative rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm shadow-xl shadow-black/20 ring-1 ring-white/10 group-hover:ring-violet-500/50 transition-all duration-300">
        {/* Animated Glow Border */}
        <div className="absolute -inset-[1px] bg-gradient-to-r from-violet-600/0 via-violet-600/50 to-violet-600/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 blur-md group-hover:animate-pulse" />

        {/* Skeleton Loading */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-white/10 animate-pulse">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skeleton-shimmer" />
          </div>
        )}

        {/* Poster Image */}
        <div className={cn(
          "absolute inset-0 transition-all duration-700 group-hover:scale-110",
          isLoaded ? "opacity-100" : "opacity-0"
        )}>
          <Image
            src={getFullImageUrl(movie.poster_url || movie.thumb_url)}
            alt={movie.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
            className="object-cover"
            priority={priority}
            onLoad={() => setIsLoaded(true)}
          />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2 z-10">
          <QualityBadge quality={movie.quality} />
          <EpisodeBadge current={movie.episode_current} />
        </div>

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-50 group-hover:scale-100">
          <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/30 group-hover:bg-violet-600 group-hover:border-violet-500 transition-colors">
            <Play className="w-6 h-6 text-white fill-white ml-1" />
          </div>
        </div>

        {/* Bottom Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {movie.lang && (
              <span className="text-[10px] font-medium px-2 py-1 bg-violet-500/30 backdrop-blur-sm rounded-full text-violet-200 border border-violet-400/30">
                {movie.lang.includes('Vietsub') ? '🎬 Vietsub' : movie.lang.includes('Thuyết') ? '🎙️ TM' : movie.lang}
              </span>
            )}
            {movie.country && movie.country.length > 0 && (
              <span className="text-[10px] px-2 py-1 bg-blue-500/20 backdrop-blur-sm rounded-full text-blue-200 border border-blue-400/20 flex items-center gap-1">
                <Globe className="w-3 h-3" />
                {movie.country[0].name}
              </span>
            )}
            {movie.year && (
              <span className="text-[10px] px-2 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white/70 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {movie.year}
              </span>
            )}
            {movie.tmdb && movie.tmdb.vote_average > 0 && (
              <span className="text-[10px] px-2 py-1 bg-yellow-500/20 backdrop-blur-sm rounded-full text-yellow-200 border border-yellow-400/20 flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                {movie.tmdb.vote_average.toFixed(1)}
              </span>
            )}
          </div>
        </div>

        {/* Glass Border Effect */}
        <div className="absolute inset-0 rounded-2xl border border-white/[0.15] group-hover:border-violet-400/50 transition-colors duration-500 pointer-events-none" />

        {/* Corner Shine Effect */}
        <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-white/20 to-transparent rounded-tl-2xl opacity-50" />
      </div>

      {/* Title & Origin Name */}
      <div className="mt-4 px-1">
        <h3 className="font-semibold text-white/95 line-clamp-1 group-hover:text-violet-300 transition-colors duration-300">
          {movie.name}
        </h3>
        <p className="text-sm text-white/50 line-clamp-1 mt-1">
          {movie.origin_name}
        </p>
      </div>
    </Link>
  );
}

// Compact version for sidebars
export function MovieCardCompact({ movie }: MovieCardProps) {
  return (
    <Link
      href={`/phim/${movie.slug}`}
      className="group flex gap-3 p-2 rounded-xl hover:bg-white/[0.05] transition-colors"
    >
      <div className="relative w-16 aspect-[2/3] rounded-lg overflow-hidden flex-shrink-0">
        <Image
          src={getFullImageUrl(movie.poster_url || movie.thumb_url)}
          alt={movie.name}
          fill
          sizes="64px"
          className="object-cover"
        />
      </div>
      <div className="flex-1 min-w-0 py-1">
        <h4 className="font-medium text-sm text-white/90 line-clamp-2 group-hover:text-violet-400 transition-colors">
          {movie.name}
        </h4>
        <p className="text-xs text-white/50 mt-1">{movie.year}</p>
        <div className="flex items-center gap-2 mt-2">
          <QualityBadge quality={movie.quality} />
        </div>
      </div>
    </Link>
  );
}
