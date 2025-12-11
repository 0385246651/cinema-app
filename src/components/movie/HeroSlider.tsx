'use client';

import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade, Navigation } from 'swiper/modules';
import { Play, Info, Star, Clock, Calendar, ChevronLeft, ChevronRight, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getFullImageUrl } from '@/lib/api';
import { GlassButton } from '@/components/ui';
import { gsap } from 'gsap';
import type { Movie } from '@/types';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';

interface HeroSliderProps {
  movies: Movie[];
}

export function HeroSlider({ movies }: HeroSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<any>(null);

  if (!movies || movies.length === 0) return null;

  // Take top 5 movies for hero slider
  const heroMovies = movies.slice(0, 6);

  return (
    <section className="relative -mt-16 md:-mt-20">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-violet-500/20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <Swiper
        ref={swiperRef}
        modules={[Autoplay, Pagination, EffectFade, Navigation]}
        effect="fade"
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        pagination={{ 
          clickable: true,
          bulletClass: 'swiper-pagination-bullet !w-3 !h-3 !bg-white/30 !rounded-full transition-all duration-300',
          bulletActiveClass: '!bg-violet-500 !w-8 !rounded-full',
        }}
        navigation={{
          prevEl: '.hero-prev',
          nextEl: '.hero-next',
        }}
        loop={true}
        speed={800}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="h-[75vh] min-h-[550px] max-h-[850px]"
      >
        {heroMovies.map((movie, index) => (
          <SwiperSlide key={movie._id || movie.slug}>
            <HeroSlide movie={movie} isActive={activeIndex === index} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation */}
      <button className="hero-prev absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all duration-300 group">
        <ChevronLeft className="w-6 h-6 group-hover:text-violet-400 transition-colors" />
      </button>
      <button className="hero-next absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all duration-300 group">
        <ChevronRight className="w-6 h-6 group-hover:text-violet-400 transition-colors" />
      </button>

      {/* Movie Thumbnails */}
      <div className="absolute bottom-32 right-8 z-20 hidden lg:flex gap-3">
        {heroMovies.map((movie, index) => (
          <button
            key={movie._id || movie.slug}
            onClick={() => swiperRef.current?.swiper?.slideTo(index)}
            className={cn(
              "relative w-16 h-24 rounded-lg overflow-hidden border-2 transition-all duration-300",
              activeIndex === index 
                ? "border-violet-500 scale-110 shadow-lg shadow-violet-500/50" 
                : "border-white/20 opacity-60 hover:opacity-100"
            )}
          >
            <Image
              src={getFullImageUrl(movie.poster_url || movie.thumb_url)}
              alt={movie.name}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#050510] via-[#050510]/80 to-transparent z-10 pointer-events-none" />
    </section>
  );
}

function HeroSlide({ movie, isActive }: { movie: Movie; isActive: boolean }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const badgesRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive) return;

    const tl = gsap.timeline();
    
    // Reset elements
    gsap.set([titleRef.current, badgesRef.current, metaRef.current, actionsRef.current], {
      opacity: 0,
      y: 50,
    });

    // Animate in sequence
    tl.to(badgesRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power3.out',
    })
    .to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
    }, '-=0.3')
    .to(metaRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power3.out',
    }, '-=0.4')
    .to(actionsRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power3.out',
    }, '-=0.3');

    return () => {
      tl.kill();
    };
  }, [isActive]);

  return (
    <div className="relative h-full w-full">
      {/* Background Image with Ken Burns Effect */}
      <div className={cn(
        "absolute inset-0 transition-transform duration-[6000ms] ease-linear",
        isActive ? "scale-110" : "scale-100"
      )}>
        <Image
          src={getFullImageUrl(movie.thumb_url || movie.poster_url)}
          alt={movie.name}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Multi-layer Overlays for Depth */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050510] via-transparent to-black/40" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-900/20 via-transparent to-transparent" />

      {/* Animated Light Rays */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-conic from-violet-500/20 via-transparent to-transparent animate-spin-slow" style={{ animationDuration: '20s' }} />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-4 md:px-8">
          <div ref={contentRef} className="max-w-2xl space-y-6">
            {/* Badges */}
            <div ref={badgesRef} className="flex items-center gap-3 flex-wrap opacity-0">
              {movie.quality && (
                <span className="px-4 py-1.5 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl text-sm font-bold tracking-wide shadow-lg shadow-violet-600/30">
                  {movie.quality}
                </span>
              )}
              {movie.episode_current && (
                <span className="px-4 py-1.5 bg-white/10 backdrop-blur-xl rounded-xl text-sm font-medium border border-white/20 shadow-lg">
                  📺 {movie.episode_current}
                </span>
              )}
              {movie.lang && (
                <span className="px-4 py-1.5 bg-emerald-500/20 backdrop-blur-xl rounded-xl text-sm font-medium border border-emerald-500/30 text-emerald-300">
                  🎬 {movie.lang}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 
              ref={titleRef}
              className="text-4xl md:text-5xl lg:text-7xl font-black leading-tight opacity-0"
              style={{
                textShadow: '0 0 40px rgba(139, 92, 246, 0.3), 0 4px 20px rgba(0,0,0,0.5)'
              }}
            >
              <span className="bg-gradient-to-r from-white via-white to-violet-200 bg-clip-text text-transparent">
                {movie.name}
              </span>
            </h1>

            {/* Origin Name */}
            <p className="text-lg md:text-xl text-white/50 font-light italic">
              {movie.origin_name}
            </p>

            {/* Meta Info */}
            <div ref={metaRef} className="flex items-center gap-4 md:gap-6 text-sm flex-wrap opacity-0">
              {movie.year && (
                <span className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10">
                  <Calendar className="w-4 h-4 text-violet-400" />
                  <span className="text-white/80">{movie.year}</span>
                </span>
              )}
              {movie.time && (
                <span className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span className="text-white/80">{movie.time}</span>
                </span>
              )}
              {movie.tmdb?.vote_average && (
                <span className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-yellow-300 font-semibold">{movie.tmdb.vote_average.toFixed(1)}</span>
                </span>
              )}
            </div>

            {/* Categories */}
            {movie.category && movie.category.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                {movie.category.slice(0, 4).map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/the-loai/${cat.slug}`}
                    className="px-4 py-1.5 text-sm bg-white/5 border border-white/10 rounded-full hover:bg-violet-500/20 hover:border-violet-500/50 hover:text-violet-300 transition-all duration-300"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Actions */}
            <div ref={actionsRef} className="flex items-center gap-4 pt-4 opacity-0">
              <Link href={`/phim/${movie.slug}`}>
                <button className="group relative px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl font-bold text-lg flex items-center gap-3 overflow-hidden shadow-2xl shadow-violet-600/40 hover:shadow-violet-600/60 transition-all duration-300 hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                  <Play className="w-6 h-6 fill-white relative z-10" />
                  <span className="relative z-10">Xem Ngay</span>
                </button>
              </Link>
              <Link href={`/phim/${movie.slug}`}>
                <button className="px-8 py-4 bg-white/10 backdrop-blur-xl rounded-2xl font-semibold text-lg flex items-center gap-3 border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105">
                  <Info className="w-6 h-6" />
                  Chi tiết
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}
