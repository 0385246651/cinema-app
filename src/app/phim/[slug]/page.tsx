import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Play,
  Star,
  Eye,
  Video,
} from 'lucide-react';
import { getMovieDetail, getFullImageUrl } from '@/lib/api';
import { Badge, QualityBadge } from '@/components/ui';
import { MovieDetailTabs } from '@/components/movie';
import { stripHtml, formatViewCount } from '@/lib/utils';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const data = await getMovieDetail(slug);
    const movie = data?.movie;

    if (!movie) {
      return { title: 'Không tìm thấy phim' };
    }

    return {
      title: `${movie.name} - ${movie.origin_name} | PhimHay`,
      description: stripHtml(movie.content || '').slice(0, 160),
      openGraph: {
        title: movie.name,
        description: stripHtml(movie.content || '').slice(0, 160),
        images: [getFullImageUrl(movie.poster_url || movie.thumb_url)],
      },
    };
  } catch {
    return { title: 'Không tìm thấy phim' };
  }
}

export default async function MovieDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let data;
  try {
    data = await getMovieDetail(slug);
  } catch (error) {
    notFound();
  }

  if (!data?.movie) {
    notFound();
  }

  const { movie, episodes } = data;
  const firstEpisode = episodes?.[0]?.server_data?.[0];

  return (
    <div className="min-h-screen pb-20">
      {/* Background w/ Blur */}
      <div className="absolute inset-0 h-[60vh] overflow-hidden -z-10">
        <Image
          src={getFullImageUrl(movie.thumb_url || movie.poster_url)}
          alt={movie.name}
          fill
          className="object-cover opacity-30 blur-2xl scale-110"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050510]/60 via-[#050510]/90 to-[#050510]" />
      </div>

      <div className="container mx-auto px-4 pt-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-white/50 mb-6 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
          <Link href="/" className="hover:text-white transition-colors">Trang Chủ</Link>
          <span className="opacity-30">/</span>
          {movie.type === 'series' ? (
            <Link href="/danh-sach/phim-bo" className="hover:text-white transition-colors">Phim Bộ</Link>
          ) : movie.type === 'single' ? (
            <Link href="/danh-sach/phim-le" className="hover:text-white transition-colors">Phim Lẻ</Link>
          ) : movie.type === 'tvshows' ? (
            <Link href="/danh-sach/tv-shows" className="hover:text-white transition-colors">TV Shows</Link>
          ) : movie.type === 'hoathinh' ? (
            <Link href="/danh-sach/hoat-hinh" className="hover:text-white transition-colors">Hoạt Hình</Link>
          ) : (
            <span className="hover:text-white transition-colors">Phim</span>
          )}
          <span className="opacity-30">/</span>
          <span className="text-white font-medium truncate max-w-[200px]">{movie.name}</span>
        </nav>

        {/* Main Content - Horizontal Layout using Grid */}
        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6 md:gap-8">
          {/* Poster Column - includes poster + action buttons */}
          <div className="flex flex-col items-center md:items-start gap-4">
            {/* Poster */}
            <div className="relative w-[260px] sm:w-[220px] md:w-full">
              <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl shadow-violet-500/20 group">
                <Image
                  src={getFullImageUrl(movie.poster_url || movie.thumb_url)}
                  alt={movie.name}
                  fill
                  sizes="(max-width: 640px) 260px, (max-width: 768px) 220px, 220px"
                  quality={95}
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  priority
                />
                {/* Corner Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  <Badge variant="success" className="shadow-lg backdrop-blur-md text-xs">
                    {movie.episode_current}
                  </Badge>
                  <QualityBadge quality={movie.quality} />
                </div>
              </div>
            </div>

            {/* Action Buttons - Below Poster */}
            <div className="flex flex-col gap-3 w-[260px] sm:w-[220px] md:w-full">
              {firstEpisode ? (
                <Link href={`/xem-phim/${slug}/${firstEpisode.slug}`} className="w-full">
                  <button className="w-full px-4 py-3 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-violet-600/30 hover:scale-105 hover:shadow-violet-600/50 transition-all duration-300">
                    <Play className="w-5 h-5 fill-white" />
                    Xem Phim
                  </button>
                </Link>
              ) : (
                <button disabled className="w-full px-4 py-3 bg-white/10 rounded-xl font-bold flex items-center justify-center gap-2 cursor-not-allowed text-white/50">
                  Đang cập nhật
                </button>
              )}

              {movie.trailer_url && (
                <a href={movie.trailer_url} target="_blank" rel="noopener noreferrer" className="w-full">
                  <button className="w-full px-4 py-3 bg-red-500/20 text-red-400 border border-red-500/40 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-red-500/30 hover:scale-105 transition-all duration-300">
                    <Video className="w-5 h-5" />
                    Trailer
                  </button>
                </a>
              )}
            </div>
          </div>

          {/* Info Section */}
          <div className="min-w-0">
            {/* Title */}
            <h1 className="text-2xl md:text-4xl font-bold mb-1 text-white leading-tight">
              {movie.name}
            </h1>
            <h2 className="text-base md:text-lg text-white/50 font-light italic mb-4">
              {movie.origin_name}
            </h2>

            {/* Quick Stats */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {/* Rating - Always show, display N/A if no rating */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500/15 rounded-lg border border-yellow-500/30">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="font-bold text-yellow-200">
                  {movie.tmdb?.vote_average && movie.tmdb.vote_average > 0
                    ? movie.tmdb.vote_average.toFixed(1)
                    : 'N/A'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10">
                <Eye className="w-4 h-4 text-white/50" />
                <span className="font-medium text-sm">{formatViewCount(movie.view)}</span>
              </div>
              {movie.year && (
                <span className="px-3 py-1.5 bg-white/5 rounded-lg border border-white/10 text-sm font-medium">
                  {movie.year}
                </span>
              )}
              {movie.time && (
                <span className="px-3 py-1.5 bg-white/5 rounded-lg border border-white/10 text-sm font-medium">
                  {movie.time}
                </span>
              )}
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-5">
              {movie.category?.slice(0, 5).map((c) => (
                <Link
                  key={c.id}
                  href={`/the-loai/${c.slug}`}
                  className="inline-flex items-center justify-center px-3 py-1.5 bg-violet-500/20 text-violet-300 rounded-full text-xs font-medium hover:bg-violet-500/30 transition-colors border border-violet-500/30 leading-none"
                >
                  {c.name}
                </Link>
              ))}
            </div>

            {/* Extra Info Grid - Aligned properly */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm mb-5">
              {movie.country?.[0] && (
                <div className="flex items-center gap-2">
                  <span className="text-white/40 min-w-[80px]">Quốc gia:</span>
                  <Link href={`/quoc-gia/${movie.country[0].slug}`} className="text-white/80 hover:text-violet-400 transition-colors">
                    {movie.country[0].name}
                  </Link>
                </div>
              )}
              {movie.lang && (
                <div className="flex items-center gap-2">
                  <span className="text-white/40 min-w-[80px]">Ngôn ngữ:</span>
                  <span className="text-white/80">{movie.lang}</span>
                </div>
              )}
              {movie.episode_total && (
                <div className="flex items-center gap-2">
                  <span className="text-white/40 min-w-[80px]">Số tập:</span>
                  <span className="text-white/80">{movie.episode_total}</span>
                </div>
              )}
              {movie.year && (
                <div className="flex items-center gap-2">
                  <span className="text-white/40 min-w-[80px]">Năm:</span>
                  <span className="text-white/80">{movie.year}</span>
                </div>
              )}
            </div>

            {/* Director & Actors */}
            {(movie.director?.length > 0 || movie.actor?.length > 0) && (
              <div className="space-y-3 text-sm">
                {movie.director?.length > 0 && (
                  <div className="flex items-start gap-2">
                    <span className="text-white/40 min-w-[80px] flex-shrink-0">Đạo diễn:</span>
                    <span className="text-violet-300">{movie.director.join(', ')}</span>
                  </div>
                )}
                {movie.actor?.length > 0 && (
                  <div className="flex items-start gap-2">
                    <span className="text-white/40 min-w-[80px] flex-shrink-0">Diễn viên:</span>
                    <span className="text-white/70 line-clamp-2">{movie.actor.slice(0, 8).join(', ')}{movie.actor.length > 8 ? '...' : ''}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Content Section with Tabs */}
        <div className="mt-10 max-w-5xl mx-auto">
          <MovieDetailTabs
            content={movie.content}
            episodes={episodes}
            movieSlug={slug}
            movieName={movie.name}
            moviePoster={movie.poster_url}
          />
        </div>

      </div>
    </div>
  );
}
