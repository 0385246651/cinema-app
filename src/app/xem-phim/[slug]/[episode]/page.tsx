import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, ChevronRight, Home, List, MessageCircle } from 'lucide-react';
import { getMovieDetail, getFullImageUrl } from '@/lib/api';
import { GlassCard, GlassButton } from '@/components/ui';
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
      title: `${movie.name} - Tập ${episode} | PhimHay`,
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

  if (!currentEpisode) {
    notFound();
  }

  // Navigation
  const prevEpisode = currentEpisodeIndex > 0 ? episodeList[currentEpisodeIndex - 1] : null;
  const nextEpisode = currentEpisodeIndex < episodeList.length - 1 ? episodeList[currentEpisodeIndex + 1] : null;

  return (
    <div className="min-h-screen pb-12">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-white/50 flex-wrap">
          <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
            <Home className="w-4 h-4" />
            Trang chủ
          </Link>
          <span>/</span>
          <Link href={`/phim/${slug}`} className="hover:text-white transition-colors line-clamp-1">
            {movie.name}
          </Link>
          <span>/</span>
          <span className="text-violet-400">{currentEpisode.name}</span>
        </div>
      </div>

      {/* Video Player Section */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr,350px] gap-6">
          {/* Main Content */}
          <div className="space-y-4">
            {/* Player with tracking */}
            <WatchPageClient
              movie={movie}
              currentEpisode={currentEpisode}
              serverIndex={0}
              poster={getFullImageUrl(movie.thumb_url || movie.poster_url)}
              hasPrev={!!prevEpisode}
              hasNext={!!nextEpisode}
            />

            {/* Player Controls */}
            <GlassCard className="p-4" hover={false}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Episode Navigation */}
                <div className="flex items-center gap-2">
                  {prevEpisode ? (
                    <Link href={`/xem-phim/${slug}/${prevEpisode.slug}`}>
                      <GlassButton variant="outline" size="sm">
                        <ChevronLeft className="w-4 h-4" />
                        Tập trước
                      </GlassButton>
                    </Link>
                  ) : (
                    <GlassButton variant="outline" size="sm" disabled>
                      <ChevronLeft className="w-4 h-4" />
                      Tập trước
                    </GlassButton>
                  )}

                  <span className="px-4 py-2 bg-violet-600/20 border border-violet-500/30 rounded-lg text-violet-400 font-medium">
                    {currentEpisode.name}
                  </span>

                  {nextEpisode ? (
                    <Link href={`/xem-phim/${slug}/${nextEpisode.slug}`}>
                      <GlassButton variant="outline" size="sm">
                        Tập sau
                        <ChevronRight className="w-4 h-4" />
                      </GlassButton>
                    </Link>
                  ) : (
                    <GlassButton variant="outline" size="sm" disabled>
                      Tập sau
                      <ChevronRight className="w-4 h-4" />
                    </GlassButton>
                  )}
                </div>

                {/* Links */}
                <div className="flex items-center gap-2">
                  <Link href={`/phim/${slug}`}>
                    <GlassButton variant="ghost" size="sm">
                      <List className="w-4 h-4" />
                      Chi tiết phim
                    </GlassButton>
                  </Link>
                </div>
              </div>
            </GlassCard>

            {/* Server Selection */}
            <GlassCard className="p-4" hover={false}>
              <h3 className="text-sm font-medium text-white/60 mb-3">Chọn Server:</h3>
              <div className="flex flex-wrap gap-2">
                {episodes?.map((server, index) => (
                  <button
                    key={server.server_name}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      index === 0
                        ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white'
                        : 'bg-white/[0.05] text-white/70 hover:bg-white/[0.1]'
                    }`}
                  >
                    {server.server_name}
                  </button>
                ))}
              </div>
            </GlassCard>

            {/* Movie Info Card */}
            <GlassCard className="p-4" hover={false}>
              <div className="flex gap-4">
                <div className="w-24 flex-shrink-0 hidden sm:block">
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
                    <Image
                      src={getFullImageUrl(movie.poster_url || movie.thumb_url)}
                      alt={movie.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/phim/${slug}`}>
                    <h2 className="text-lg font-semibold hover:text-violet-400 transition-colors line-clamp-1">
                      {movie.name}
                    </h2>
                  </Link>
                  <p className="text-sm text-white/50 line-clamp-1 mb-2">
                    {movie.origin_name}
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs text-white/60 mb-3">
                    <span className="px-2 py-1 bg-white/[0.05] rounded">{movie.year}</span>
                    <span className="px-2 py-1 bg-white/[0.05] rounded">{movie.quality}</span>
                    <span className="px-2 py-1 bg-white/[0.05] rounded">{movie.lang}</span>
                    <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded">
                      {movie.episode_current}/{movie.episode_total || '?'}
                    </span>
                  </div>
                  {movie.content && (
                    <p className="text-sm text-white/50 line-clamp-2">
                      {stripHtml(movie.content)}
                    </p>
                  )}
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Sidebar - Episode List */}
          <div className="xl:order-2">
            <GlassCard className="p-4 sticky top-24" hover={false}>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <List className="w-4 h-4 text-violet-400" />
                Danh sách tập ({episodeList.length} tập)
              </h3>
              <div className="max-h-[500px] overflow-y-auto space-y-1 pr-2">
                {episodeList.map((ep) => (
                  <Link
                    key={ep.slug}
                    href={`/xem-phim/${slug}/${ep.slug}`}
                    className={`block px-3 py-2 rounded-lg text-sm transition-all ${
                      ep.slug === episode
                        ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white'
                        : 'bg-white/[0.03] hover:bg-white/[0.08] text-white/70 hover:text-white'
                    }`}
                  >
                    {ep.name}
                  </Link>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
