import { Suspense } from 'react';
import { getNewMovies, getMoviesByType, getTheaterMovies } from '@/lib/api';
import { HeroSlider, MovieSection, TheaterSection } from '@/components/movie';
import { HeroSkeleton, MovieGridSkeleton } from '@/components/ui';
import { Film, Tv, Play, Sparkles } from 'lucide-react';

export const revalidate = 3600; // Revalidate every hour

export default async function HomePage() {
  // Fetch data in parallel
  const [newMoviesRes, seriesRes, singleRes, animeRes, theaterRes] = await Promise.all([
    getNewMovies(1),
    getMoviesByType('phim-bo', 1, 12),
    getMoviesByType('phim-le', 1, 12),
    getMoviesByType('hoat-hinh', 1, 12),
    getTheaterMovies(1, 12),
  ]);

  const newMovies = newMoviesRes?.items || [];
  const seriesMovies = seriesRes?.data?.items || [];
  const singleMovies = singleRes?.data?.items || [];
  const animeMovies = animeRes?.data?.items || [];
  const theaterMovies = theaterRes?.data?.items || [];

  return (
    <div className="page-content">
      {/* Animated Background */}
      <div className="animated-bg" />
      
      {/* Hero Slider */}
      <Suspense fallback={<HeroSkeleton />}>
        <HeroSlider movies={newMovies.slice(0, 6)} />
      </Suspense>

      {/* Content Sections */}
      <div className="container mx-auto px-4 py-12 space-y-16">
        {/* Phim Mới Cập Nhật */}
        <Suspense fallback={<MovieGridSkeleton count={6} />}>
          <MovieSection
            title="Phim Mới Cập Nhật"
            href="/danh-sach/phim-moi"
            movies={newMovies}
            icon={<Sparkles className="w-5 h-5" />}
          />
        </Suspense>

        {/* Phim Chiếu Rạp - Special Section */}
        <Suspense fallback={<MovieGridSkeleton count={6} />}>
          <TheaterSection movies={theaterMovies} />
        </Suspense>

        {/* Phim Bộ */}
        <Suspense fallback={<MovieGridSkeleton count={6} />}>
          <MovieSection
            title="Phim Bộ Mới"
            href="/danh-sach/phim-bo"
            movies={seriesMovies}
            icon={<Tv className="w-5 h-5" />}
          />
        </Suspense>

        {/* Phim Lẻ */}
        <Suspense fallback={<MovieGridSkeleton count={6} />}>
          <MovieSection
            title="Phim Lẻ Hot"
            href="/danh-sach/phim-le"
            movies={singleMovies}
            icon={<Film className="w-5 h-5" />}
          />
        </Suspense>

        {/* Hoạt Hình */}
        <Suspense fallback={<MovieGridSkeleton count={6} />}>
          <MovieSection
            title="Hoạt Hình"
            href="/danh-sach/hoat-hinh"
            movies={animeMovies}
            icon={<Play className="w-5 h-5" />}
          />
        </Suspense>
      </div>
    </div>
  );
}
