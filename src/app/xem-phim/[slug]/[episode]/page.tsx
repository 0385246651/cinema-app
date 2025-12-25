import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ChevronLeft, ChevronRight, Home, Film, Play, Star, Calendar, Globe } from 'lucide-react';
import { getMovieDetail, getFullImageUrl } from '@/lib/api';
import { WatchPageClient } from '@/components/movie';
import { stripHtml } from '@/lib/utils';

interface PageProps {
  params: Promise<{ slug: string; episode: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, episode } = await params;

  try {
    const data = await getMovieDetail(slug);
    const movie = data?.movie;

    if (!movie) {
      return { title: 'Không tìm thấy phim' };
    }

    return {
      title: `${movie.name} - Tập ${episode} | CinemaHub`,
      description: `Xem phim ${movie.name} - ${movie.origin_name} tập ${episode} vietsub chất lượng cao.`,
    };
  } catch {
    return { title: 'Không tìm thấy phim' };
  }
}

export default async function WatchPage({ params }: PageProps) {
  const { slug, episode } = await params;

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

  // Find current episode data
  const currentServer = episodes?.[0];
  const episodeList = currentServer?.server_data || [];
  const currentEpisodeIndex = episodeList.findIndex((ep) => ep.slug === episode);
  const currentEpisode = episodeList[currentEpisodeIndex];

  // If episode not found, redirect to first available episode
  if (!currentEpisode && episodeList.length > 0) {
    const firstEpisode = episodeList[0];
    redirect(`/xem-phim/${slug}/${firstEpisode.slug}`);
  }

  if (!currentEpisode) {
    notFound();
  }

  // Navigation
  const prevEpisode = currentEpisodeIndex > 0 ? episodeList[currentEpisodeIndex - 1] : null;
  const nextEpisode = currentEpisodeIndex < episodeList.length - 1 ? episodeList[currentEpisodeIndex + 1] : null;
  const posterUrl = getFullImageUrl(movie.thumb_url || movie.poster_url);

  return (
    <div className="min-h-screen relative">
      {/* Cinematic Background */}
      <div className="fixed inset-0 -z-10">
        <Image
          src={posterUrl}
          alt=""
          fill
          className="object-cover opacity-20 blur-3xl scale-110"
          priority={false}
          quality={30}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050510]/80 via-[#050510]/90 to-[#050510]" />
        <div className="absolute inset-0 bg-gradient-to-r from-violet-900/10 via-transparent to-purple-900/10" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 pb-12 pt-4">
        {/* Header Section */}
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-white/50 flex-wrap mb-3">
            <Link href="/" className="hover:text-violet-400 transition-colors flex items-center gap-1.5 group">
              <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Trang chủ</span>
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link href={`/phim/${slug}`} className="hover:text-violet-400 transition-colors line-clamp-1 max-w-[200px]">
              {movie.name}
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-violet-400 font-medium">{currentEpisode.name}</span>
          </nav>

          {/* Movie Title Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
                <Play className="w-4 h-4 fill-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold line-clamp-1">{movie.name}</h1>
                <p className="text-xs text-white/50">{movie.origin_name}</p>
              </div>
            </div>

            {/* Quick Info Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 bg-violet-500/20 text-violet-300 rounded-md text-xs font-bold border border-violet-500/30">
                {movie.quality || 'HD'}
              </span>
              <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 rounded-md text-xs font-medium border border-emerald-500/30">
                {currentEpisodeIndex + 1}/{episodeList.length} tập
              </span>
              <span className="px-2.5 py-1 bg-white/5 text-white/70 rounded-md text-xs font-medium border border-white/10">
                {movie.lang || 'Vietsub'}
              </span>
            </div>
          </div>
        </div>

        {/* Video Section */}
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 xl:grid-cols-[1fr,400px] gap-6">
            {/* Main Player Column */}
            <div className="space-y-4">
              {/* Player with tracking */}
              <WatchPageClient
                movie={movie}
                currentEpisode={currentEpisode}
                episodes={episodes}
                serverIndex={0}
                poster={posterUrl}
                hasPrev={!!prevEpisode}
                hasNext={!!nextEpisode}
                nextEpisodeSlug={nextEpisode?.slug}
              />

              {/* Quick Episode Navigation */}
              <div className="flex items-center justify-between gap-2 md:gap-4 p-3 md:p-4 bg-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/[0.05]">
                <div className="flex items-center gap-1.5 md:gap-2">
                  {prevEpisode ? (
                    <Link href={`/xem-phim/${slug}/${prevEpisode.slug}`}>
                      <button className="flex items-center gap-1 md:gap-2 px-2.5 md:px-4 py-2 md:py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs md:text-sm font-medium transition-all hover:scale-105 border border-white/10">
                        <ChevronLeft className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        <span className="hidden sm:inline">Tập trước</span>
                      </button>
                    </Link>
                  ) : (
                    <button disabled className="flex items-center gap-1 md:gap-2 px-2.5 md:px-4 py-2 md:py-2.5 bg-white/5 rounded-xl text-xs md:text-sm font-medium opacity-50 cursor-not-allowed border border-white/5">
                      <ChevronLeft className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      <span className="hidden sm:inline">Tập trước</span>
                    </button>
                  )}

                  <div className="px-3 md:px-5 py-1.5 md:py-2.5 bg-gradient-to-r from-violet-600/20 to-purple-600/20 border border-violet-500/30 rounded-xl">
                    <span className="text-violet-300 font-bold text-xs md:text-base">{currentEpisode.name}</span>
                  </div>

                  {nextEpisode ? (
                    <Link href={`/xem-phim/${slug}/${nextEpisode.slug}`}>
                      <button className="flex items-center gap-1 md:gap-2 px-2.5 md:px-4 py-2 md:py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 rounded-xl text-xs md:text-sm font-bold transition-all hover:scale-105 shadow-lg shadow-violet-500/20">
                        <span className="hidden sm:inline">Tập sau</span>
                        <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      </button>
                    </Link>
                  ) : (
                    <button disabled className="flex items-center gap-1 md:gap-2 px-2.5 md:px-4 py-2 md:py-2.5 bg-white/5 rounded-xl text-xs md:text-sm font-medium opacity-50 cursor-not-allowed border border-white/5">
                      <span className="hidden sm:inline">Tập sau</span>
                      <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    </button>
                  )}
                </div>

                <Link href={`/phim/${slug}`} className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-medium transition-all border border-white/10">
                  <Film className="w-4 h-4" />
                  Chi tiết phim
                </Link>
              </div>

              {/* Movie Info Card - Enhanced */}
              <div className="p-5 bg-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/[0.05] group hover:border-violet-500/20 transition-all duration-300">
                <div className="flex gap-5">
                  {/* Poster */}
                  <Link href={`/phim/${slug}`} className="w-24 flex-shrink-0 hidden sm:block">
                    <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-xl shadow-black/30 group-hover:shadow-violet-500/20 transition-shadow">
                      <Image
                        src={getFullImageUrl(movie.poster_url || movie.thumb_url)}
                        alt={movie.name}
                        fill
                        sizes="96px"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0 space-y-3">
                    <div>
                      <Link href={`/phim/${slug}`}>
                        <h2 className="text-lg font-bold hover:text-violet-400 transition-colors line-clamp-1">
                          {movie.name}
                        </h2>
                      </Link>
                      <p className="text-sm text-white/40 italic line-clamp-1">
                        {movie.origin_name}
                      </p>
                    </div>

                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-2">
                      <span className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 rounded-lg text-xs text-white/60">
                        <Calendar className="w-3.5 h-3.5 text-violet-400" />
                        {movie.year}
                      </span>
                      <span className="flex items-center gap-1.5 px-2.5 py-1 bg-yellow-500/10 rounded-lg text-xs text-yellow-300">
                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                        {movie.tmdb?.vote_average?.toFixed(1) || 'N/A'}
                      </span>
                      <span className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 rounded-lg text-xs text-white/60">
                        <Globe className="w-3.5 h-3.5 text-blue-400" />
                        {movie.country?.[0]?.name || 'N/A'}
                      </span>
                    </div>

                    {/* Description */}
                    {movie.content && (
                      <p className="text-sm text-white/50 line-clamp-2 leading-relaxed">
                        {stripHtml(movie.content)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar - LiveChat rendered in WatchPageClient */}
            <div className="xl:order-2">
              {/* LiveChat component is rendered inside WatchPageClient */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
