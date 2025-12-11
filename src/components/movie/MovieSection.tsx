'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, FreeMode } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { ChevronLeft, ChevronRight, ArrowRight, Play, Star, Ticket, Film } from 'lucide-react';
import { MovieCard } from './MovieCard';
import { cn } from '@/lib/utils';
import { getFullImageUrl } from '@/lib/api';
import { gsap } from 'gsap';
import type { Movie } from '@/types';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';

interface MovieSectionProps {
  title: string;
  href?: string;
  movies: Movie[];
  className?: string;
  icon?: React.ReactNode;
}

export function MovieSection({ title, href, movies, className, icon }: MovieSectionProps) {
  const swiperRef = useRef<SwiperType | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.fromTo(section,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
          once: true,
        },
      }
    );
  }, []);

  if (!movies || movies.length === 0) return null;

  return (
    <section ref={sectionRef} className={cn('relative', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          {icon && (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
              {icon}
            </div>
          )}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">
              <span className="bg-gradient-to-r from-white via-violet-200 to-violet-400 bg-clip-text text-transparent">
                {title}
              </span>
            </h2>
            <div className="h-1 w-16 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full mt-2" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className="p-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] hover:bg-violet-500/20 hover:border-violet-500/50 transition-all duration-300 group"
            >
              <ChevronLeft className="w-5 h-5 group-hover:text-violet-400 transition-colors" />
            </button>
            <button
              onClick={() => swiperRef.current?.slideNext()}
              className="p-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] hover:bg-violet-500/20 hover:border-violet-500/50 transition-all duration-300 group"
            >
              <ChevronRight className="w-5 h-5 group-hover:text-violet-400 transition-colors" />
            </button>
          </div>

          {href && (
            <Link
              href={href}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white/80 hover:text-white bg-white/[0.05] hover:bg-violet-500/20 border border-white/[0.1] hover:border-violet-500/50 rounded-xl transition-all duration-300 group"
            >
              Xem tất cả
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>
      </div>

      {/* Carousel */}
      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        modules={[Navigation, FreeMode]}
        spaceBetween={16}
        slidesPerView={2}
        freeMode={{ enabled: true, sticky: true }}
        breakpoints={{
          480: { slidesPerView: 2.5, spaceBetween: 16 },
          640: { slidesPerView: 3.5, spaceBetween: 20 },
          768: { slidesPerView: 4.5, spaceBetween: 20 },
          1024: { slidesPerView: 5.5, spaceBetween: 24 },
          1280: { slidesPerView: 6.5, spaceBetween: 24 },
        }}
        className="!overflow-visible"
      >
        {movies.map((movie, index) => (
          <SwiperSlide key={movie._id || movie.slug}>
            <MovieCard movie={movie} priority={index < 4} index={index} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

// Theater/Cinema Movies Section - Special design
export function TheaterSection({ movies }: { movies: Movie[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.fromTo(section,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
      }
    );
  }, []);

  if (!movies || movies.length === 0) return null;

  const featuredMovie = movies[0];
  const otherMovies = movies.slice(1, 7);

  return (
    <section ref={sectionRef} className="relative py-16">
      {/* Background Decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-violet-900/10 via-transparent to-transparent pointer-events-none" />
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
          <Ticket className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-3xl md:text-4xl font-black">
            <span className="bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 bg-clip-text text-transparent">
              Phim Chiếu Rạp
            </span>
          </h2>
          <p className="text-white/50 mt-1">Những bộ phim đang hot nhất</p>
        </div>
        <Link
          href="/danh-sach/phim-le"
          className="ml-auto flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 hover:border-amber-500/50 rounded-xl transition-all duration-300 group"
        >
          Xem tất cả
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Featured Movie */}
        <div className="lg:col-span-2">
          <Link href={`/phim/${featuredMovie.slug}`} className="group block relative">
            <div className="relative aspect-video rounded-3xl overflow-hidden">
              <Image
                src={getFullImageUrl(featuredMovie.thumb_url || featuredMovie.poster_url)}
                alt={featuredMovie.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
              
              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-white/20">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-2xl shadow-amber-600/50">
                    <Play className="w-8 h-8 text-white fill-white ml-1" />
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-8">
                {/* Badges */}
                <div className="flex items-center gap-3 mb-4">
                  {featuredMovie.quality && (
                    <span className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg text-sm font-bold">
                      {featuredMovie.quality}
                    </span>
                  )}
                  {featuredMovie.lang && (
                    <span className="px-3 py-1.5 bg-white/10 backdrop-blur-xl rounded-lg text-sm font-medium border border-white/20">
                      {featuredMovie.lang.includes('Vietsub') ? '🎬 Vietsub' : featuredMovie.lang}
                    </span>
                  )}
                  {featuredMovie.tmdb?.vote_average && (
                    <span className="px-3 py-1.5 bg-yellow-500/20 rounded-lg text-sm font-bold text-yellow-300 flex items-center gap-1 border border-yellow-500/30">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      {featuredMovie.tmdb.vote_average.toFixed(1)}
                    </span>
                  )}
                </div>
                
                <h3 className="text-3xl md:text-4xl font-black text-white mb-2 group-hover:text-amber-200 transition-colors">
                  {featuredMovie.name}
                </h3>
                <p className="text-white/60 text-lg">
                  {featuredMovie.origin_name}
                </p>
              </div>
              
              {/* Border */}
              <div className="absolute inset-0 rounded-3xl border border-white/10 group-hover:border-amber-500/50 transition-colors duration-500" />
            </div>
          </Link>
        </div>

        {/* Other Movies Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-4">
          {otherMovies.map((movie, index) => (
            <Link 
              key={movie._id || movie.slug} 
              href={`/phim/${movie.slug}`}
              className="group relative aspect-[2/3] rounded-2xl overflow-hidden"
            >
              <Image
                src={getFullImageUrl(movie.poster_url || movie.thumb_url)}
                alt={movie.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
              
              {/* Quality Badge */}
              {movie.quality && (
                <div className="absolute top-2 left-2 px-2 py-1 bg-amber-500/90 rounded-md text-xs font-bold">
                  {movie.quality}
                </div>
              )}
              
              {/* Title */}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-amber-200 transition-colors">
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
    </section>
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
        {movies.slice(0, 5).map((movie) => (
          <MovieCardCompact key={movie._id || movie.slug} movie={movie} />
        ))}
      </div>
    </div>
  );
}

// Import compact card variant
import { MovieCardCompact } from './MovieCard';
