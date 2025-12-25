'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Play, Star, Ticket, Globe, ChevronLeft, ChevronRight } from 'lucide-react';
import { MovieCard, MovieCardCompact } from './MovieCard';
import { cn } from '@/lib/utils';
import { getFullImageUrl } from '@/lib/api';
import { AnimatedSection, AnimatedGrid } from '@/components/ui/AnimatedSection';
import { NativeCarousel } from '@/components/ui/NativeCarousel';
import type { Movie } from '@/types';

interface MovieSectionProps {
  title: string;
  href?: string;
  movies: Movie[];
  className?: string;
  icon?: React.ReactNode;
  priority?: boolean;
}

export function MovieSection({ title, href, movies, className, icon, priority = false }: MovieSectionProps) {
  const carouselRef = React.useRef<{ scrollLeft: () => void; scrollRight: () => void }>(null);
  const [canScroll, setCanScroll] = useState({ left: false, right: true });

  if (!movies || movies.length === 0) return null;

  return (
    <AnimatedSection className={cn('relative', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3 min-w-0">
          {icon && (
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30 flex-shrink-0">
              {icon}
            </div>
          )}
          <div className="min-w-0">
            <h2 className="text-xl md:text-3xl font-bold truncate">
              <span className="bg-gradient-to-r from-white via-violet-200 to-violet-400 bg-clip-text text-transparent">
                {title}
              </span>
            </h2>
            <div className="h-1 w-12 md:w-16 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full mt-1" />
          </div>
        </div>

        {/* View All Button */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Carousel Navigation - Desktop only */}
          <button
            onClick={() => carouselRef.current?.scrollLeft()}
            disabled={!canScroll.left}
            className={cn(
              "hidden md:flex w-9 h-9 rounded-lg bg-white/[0.05] border border-white/10 items-center justify-center transition-all flex-shrink-0",
              canScroll.left
                ? "hover:bg-violet-500/20 hover:border-violet-500/50 text-white"
                : "opacity-30 cursor-not-allowed text-white/50"
            )}
            aria-label="Previous"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => carouselRef.current?.scrollRight()}
            disabled={!canScroll.right}
            className={cn(
              "hidden md:flex w-9 h-9 rounded-lg bg-white/[0.05] border border-white/10 items-center justify-center transition-all flex-shrink-0",
              canScroll.right
                ? "hover:bg-violet-500/20 hover:border-violet-500/50 text-white"
                : "opacity-30 cursor-not-allowed text-white/50"
            )}
            aria-label="Next"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {href && (
            <Link
              href={href}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs md:text-sm font-medium text-white/80 hover:text-white bg-white/[0.05] hover:bg-violet-500/20 border border-white/[0.1] hover:border-violet-500/50 rounded-xl transition-all duration-300 group ml-1 flex-shrink-0 whitespace-nowrap"
            >
              <span className="hidden sm:inline">Xem tất cả</span>
              <span className="sm:hidden">Tất cả</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>
      </div>

      {/* Carousel for all screens */}
      <NativeCarousel
        ref={carouselRef}
        gap="0.75rem"
        onScrollStateChange={({ canScrollLeft, canScrollRight }) => {
          setCanScroll({ left: canScrollLeft, right: canScrollRight });
        }}
      >
        {movies.map((movie, index) => (
          <MovieCard
            key={`${movie._id || movie.slug}-${index}`}
            movie={movie}
            priority={priority && index < 4}
            index={index}
          />
        ))}
      </NativeCarousel>
    </AnimatedSection>
  );
}

// Theater/Cinema Movies Section - Special design
export function TheaterSection({ movies }: { movies: Movie[] }) {
  if (!movies || movies.length === 0) return null;

  const featuredMovie = movies[0];
  const otherMovies = movies.slice(1, 5);

  return (
    <AnimatedSection className="relative py-4 md:py-8">
      {/* Background Decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-violet-900/10 via-transparent to-transparent pointer-events-none" />

      {/* Header - Compact on mobile */}
      <div className="flex items-center gap-3 mb-6 md:mb-10">
        <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30 flex-shrink-0">
          <Ticket className="w-5 h-5 md:w-7 md:h-7" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-xl md:text-4xl font-black">
            <span className="bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 bg-clip-text text-transparent">
              Phim Chiếu Rạp
            </span>
          </h2>
          <p className="text-white/50 text-xs md:text-base mt-0.5 md:mt-1 hidden sm:block">Những bộ phim đang hot nhất</p>
        </div>
        <Link
          href="/danh-sach/phim-chieu-rap"
          className="flex items-center gap-1.5 px-3 md:px-5 py-1.5 md:py-2.5 text-xs md:text-sm font-medium text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 hover:border-amber-500/50 rounded-xl transition-all duration-300 group flex-shrink-0"
        >
          <span className="hidden sm:inline">Xem tất cả</span>
          <span className="sm:hidden">Tất cả</span>
          <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Featured Movie */}
        <div className="lg:col-span-2">
          <Link href={`/phim/${featuredMovie.slug}`} className="group block relative">
            <div className="relative aspect-video rounded-2xl md:rounded-3xl overflow-hidden">
              <Image
                src={getFullImageUrl(featuredMovie.thumb_url || featuredMovie.poster_url)}
                alt={featuredMovie.name}
                fill
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />

              {/* Badges - Top left corner */}
              <div className="absolute top-3 md:top-4 left-3 md:left-4 flex items-center gap-2 flex-wrap z-10">
                {featuredMovie.quality && (
                  <span className="px-2 md:px-3 py-1 md:py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-md md:rounded-lg text-xs md:text-sm font-bold shadow-lg">
                    {featuredMovie.quality}
                  </span>
                )}
                {featuredMovie.lang && (
                  <span className="px-2 md:px-3 py-1 md:py-1.5 bg-black/60 backdrop-blur-md rounded-md md:rounded-lg text-xs md:text-sm font-medium border border-white/20">
                    {featuredMovie.lang.includes('Vietsub') ? 'Vietsub' : featuredMovie.lang}
                  </span>
                )}
                {featuredMovie.tmdb?.vote_average && (
                  <span className="px-2 md:px-3 py-1 md:py-1.5 bg-black/60 backdrop-blur-md rounded-md md:rounded-lg text-xs md:text-sm font-bold text-yellow-300 flex items-center gap-1 border border-yellow-500/30">
                    <Star className="w-3 h-3 md:w-4 md:h-4 fill-yellow-400 text-yellow-400" />
                    {featuredMovie.tmdb.vote_average.toFixed(1)}
                  </span>
                )}
              </div>

              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-white/20">
                  <div className="w-11 h-11 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-2xl shadow-amber-600/50">
                    <Play className="w-5 h-5 md:w-8 md:h-8 text-white fill-white ml-0.5 md:ml-1" />
                  </div>
                </div>
              </div>

              {/* Title Content - Bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
                <h3 className="text-xl md:text-4xl font-black text-white mb-1 md:mb-2 group-hover:text-amber-200 transition-colors line-clamp-2">
                  {featuredMovie.name}
                </h3>
                <p className="text-white/60 text-sm md:text-lg line-clamp-1">
                  {featuredMovie.origin_name}
                </p>
              </div>

              {/* Border */}
              <div className="absolute inset-0 rounded-2xl md:rounded-3xl border border-white/10 group-hover:border-amber-500/50 transition-colors duration-500" />
            </div>
          </Link>
        </div>

        {/* Other Movies Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-4">
          {otherMovies.map((movie, index) => (
            <Link
              key={`${movie._id || movie.slug}-${index}`}
              href={`/phim/${movie.slug}`}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden"
            >
              <Image
                src={getFullImageUrl(movie.poster_url || movie.thumb_url)}
                alt={movie.name}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

              {/* Quality, Year and Country Badges */}
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {movie.quality && (
                  <span className="px-2 py-1 bg-amber-500/90 rounded-md text-xs font-bold shadow-lg">
                    {movie.quality}
                  </span>
                )}
                {movie.year && (
                  <span className="px-2 py-1 bg-black/60 backdrop-blur-md rounded-md text-xs font-medium text-white/80">
                    {movie.year}
                  </span>
                )}
                {movie.country && movie.country.length > 0 && (
                  <span className="px-2 py-1 bg-blue-500/30 backdrop-blur-md rounded-md text-xs font-medium text-blue-200 flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    {movie.country[0].name}
                  </span>
                )}
              </div>

              {/* Vote Badge */}
              {movie.tmdb?.vote_average && movie.tmdb.vote_average > 0 && (
                <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded-md text-xs font-bold text-yellow-400 flex items-center gap-1 border border-yellow-500/30">
                  <Star className="w-3 h-3 fill-yellow-400" />
                  {movie.tmdb.vote_average.toFixed(1)}
                </div>
              )}

              {/* Title */}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h4 className="font-semibold text-sm line-clamp-1 group-hover:text-amber-200 transition-colors">
                  {movie.name}
                </h4>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 rounded-full bg-amber-500/90 flex items-center justify-center">
                  <Play className="w-5 h-5 fill-white ml-0.5" />
                </div>
              </div>

              <div className="absolute inset-0 rounded-2xl border border-white/10 group-hover:border-amber-500/50 transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

// Vertical list for sidebar
export function MovieListVertical({
  title,
  movies,
  href,
}: {
  title: string;
  movies: Movie[];
  href?: string;
}) {
  if (!movies || movies.length === 0) return null;

  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold gradient-text">{title}</h3>
        {href && (
          <Link href={href} className="text-xs text-white/50 hover:text-white">
            Xem thêm →
          </Link>
        )}
      </div>
      <div className="space-y-1">
        {movies.slice(0, 5).map((movie, index) => (
          <MovieCardCompact key={`${movie._id || movie.slug}-${index}`} movie={movie} />
        ))}
      </div>
    </div>
  );
}
