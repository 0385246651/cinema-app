import React from 'react';
import { MovieCard } from './MovieCard';
import { MovieGridSkeleton } from '@/components/ui';
import type { Movie } from '@/types';

interface MovieGridProps {
  movies: Movie[];
  loading?: boolean;
}

export function MovieGrid({ movies, loading }: MovieGridProps) {
  if (loading) {
    return <MovieGridSkeleton count={12} />;
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-24 h-24 mb-4 rounded-full bg-white/[0.05] flex items-center justify-center">
          <span className="text-4xl">🎬</span>
        </div>
        <p className="text-white/50">Không tìm thấy phim nào</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 3xl:grid-cols-8 4xl:grid-cols-10 gap-4 md:gap-6 3xl:gap-8">
      {movies.map((movie, index) => (
        <MovieCard
          key={movie._id || movie.slug}
          movie={movie}
          priority={index < 6}
        />
      ))}
    </div>
  );
}
