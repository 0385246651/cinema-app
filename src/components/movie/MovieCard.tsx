'use client';

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Star, Clock, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getFullImageUrl } from '@/lib/api';
import { QualityBadge, EpisodeBadge } from '@/components/ui';
import { gsap } from 'gsap';
import type { Movie } from '@/types';

interface MovieCardProps {
  movie: Movie;
  priority?: boolean;
  index?: number;
}

export function MovieCard({ movie, priority = false, index = 0 }: MovieCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const playBtnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    // Initial animation on mount
    gsap.fromTo(card,
      { opacity: 0, y: 40, scale: 0.95 },
      { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        duration: 0.6, 
        delay: index * 0.08,
        ease: 'power3.out'
      }
    );
  }, [index]);

  const handleMouseEnter = () => {
    const card = cardRef.current;
    const image = imageRef.current;
    const overlay = overlayRef.current;
    const playBtn = playBtnRef.current;
    
    if (card) {
      gsap.to(card, {
        y: -10,
        scale: 1.02,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
    
    if (image) {
      gsap.to(image, {
        scale: 1.15,
        duration: 0.5,
        ease: 'power2.out'
      });
    }
    
    if (overlay) {
      gsap.to(overlay, {
        opacity: 0.9,
        duration: 0.3
      });
    }
    
    if (playBtn) {
      gsap.to(playBtn, {
        scale: 1,
        opacity: 1,
        duration: 0.3,
        ease: 'back.out(1.7)'
      });
    }
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    const image = imageRef.current;
    const overlay = overlayRef.current;
    const playBtn = playBtnRef.current;
    
    if (card) {
      gsap.to(card, {
        y: 0,
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
    
    if (image) {
      gsap.to(image, {
        scale: 1,
        duration: 0.5,
        ease: 'power2.out'
      });
    }
    
    if (overlay) {
      gsap.to(overlay, {
        opacity: 0.6,
        duration: 0.3
      });
    }
    
    if (playBtn) {
      gsap.to(playBtn, {
        scale: 0.7,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in'
      });
    }
  };

  return (
    <Link
      ref={cardRef}
      href={`/phim/${movie.slug}`}
      className="group block opacity-0"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-sm shadow-xl shadow-black/20">
        {/* Animated Glow Border */}
        <div className="absolute -inset-[1px] bg-gradient-to-r from-violet-600/0 via-violet-600/50 to-violet-600/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
        
        {/* Poster Image */}
        <div ref={imageRef} className="absolute inset-0">
          <Image
            src={getFullImageUrl(movie.poster_url || movie.thumb_url)}
            alt={movie.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
            className="object-cover"
            priority={priority}
          />
        </div>

        {/* Gradient Overlay */}
        <div 
          ref={overlayRef}
          className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-60 transition-opacity duration-300" 
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
          <QualityBadge quality={movie.quality} />
          <EpisodeBadge current={movie.episode_current} />
        </div>

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            ref={playBtnRef}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-violet-600/50 scale-[0.7] opacity-0"
          >
            <div className="absolute inset-0 rounded-full bg-violet-500/50 animate-ping" />
            <Play className="w-7 h-7 text-white fill-white ml-1 relative z-10" />
          </div>
        </div>

        {/* Bottom Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {/* Meta info */}
          <div className="flex items-center gap-2 mb-2">
            {movie.lang && (
              <span className="text-[10px] font-medium px-2 py-1 bg-violet-500/30 backdrop-blur-sm rounded-full text-violet-200 border border-violet-400/30">
                {movie.lang.includes('Vietsub') ? '🎬 Vietsub' : movie.lang.includes('Thuyết') ? '🎙️ TM' : movie.lang}
              </span>
            )}
            {movie.year && (
              <span className="text-[10px] px-2 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white/70 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {movie.year}
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
