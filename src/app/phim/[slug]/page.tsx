import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Play,
  Calendar,
  Clock,
  Star,
  Eye,
  Globe,
  Film,
  Users,
  Video,
} from 'lucide-react';
import { getMovieDetail, getFullImageUrl } from '@/lib/api';
import { GlassCard, GlassButton, Badge, QualityBadge } from '@/components/ui';
import { EpisodeList, MovieSection, MovieDetailActions, MovieReviewsSection } from '@/components/movie';
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

  // Get first episode for "Watch Now" button
  const firstEpisode = episodes?.[0]?.server_data?.[0];

  return (
    <div className="min-h-screen">
      {/* Hero Background */}
      <div className="relative h-[50vh] md:h-[60vh] -mt-16 md:-mt-20 overflow-hidden">
        <Image
          src={getFullImageUrl(movie.thumb_url || movie.poster_url)}
          alt={movie.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050510] via-[#050510]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050510] via-transparent to-[#050510]/50" />
      </div>

      {/* Movie Info */}
      <div className="container mx-auto px-4 -mt-48 md:-mt-64 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[300px,1fr] gap-8">
          {/* Poster */}
          <div className="hidden lg:block">
            <GlassCard className="overflow-hidden" hover={false}>
              <div className="relative aspect-[2/3]">
                <Image
                  src={getFullImageUrl(movie.poster_url || movie.thumb_url)}
                  alt={movie.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </GlassCard>
          </div>

          {/* Info */}
          <div className="space-y-6">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <QualityBadge quality={movie.quality} />
              <Badge variant="info">{movie.episode_current}</Badge>
              {movie.lang && <Badge>{movie.lang}</Badge>}
              {movie.chieurap && <Badge variant="warning">Chiếu rạp</Badge>}
            </div>

            {/* Title */}
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-2">
                {movie.name}
              </h1>
              <p className="text-lg md:text-xl text-white/60">
                {movie.origin_name}
              </p>
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-white/70">
              {movie.year && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-violet-400" />
                  {movie.year}
                </span>
              )}
              {movie.time && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-violet-400" />
                  {movie.time}
                </span>
              )}
              {movie.view > 0 && (
                <span className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-violet-400" />
                  {formatViewCount(movie.view)} lượt xem
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Video className="w-4 h-4 text-violet-400" />
                {movie.episode_current} / {movie.episode_total || '?'} tập
              </span>
            </div>

            {/* Categories & Countries */}
            <div className="flex flex-wrap gap-2">
              {movie.category?.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/the-loai/${cat.slug}`}
                  className="px-3 py-1.5 text-sm bg-white/[0.05] border border-white/[0.1] rounded-full hover:bg-white/[0.1] hover:border-white/[0.2] transition-all"
                >
                  {cat.name}
                </Link>
              ))}
              {movie.country?.map((c) => (
                <Link
                  key={c.slug}
                  href={`/quoc-gia/${c.slug}`}
                  className="px-3 py-1.5 text-sm bg-violet-500/10 border border-violet-500/20 rounded-full hover:bg-violet-500/20 transition-all flex items-center gap-1"
                >
                  <Globe className="w-3 h-3" />
                  {c.name}
                </Link>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              {firstEpisode && (
                <Link href={`/xem-phim/${slug}/${firstEpisode.slug}`}>
                  <GlassButton variant="primary" size="lg">
                    <Play className="w-5 h-5 fill-white" />
                    Xem phim
                  </GlassButton>
                </Link>
              )}
              {movie.trailer_url && (
                <a
                  href={movie.trailer_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GlassButton variant="default" size="lg">
                    <Film className="w-5 h-5" />
                    Xem trailer
                  </GlassButton>
                </a>
              )}
            </div>

            {/* User Actions - Favorite, Rating, Share */}
            <MovieDetailActions movie={movie} />

            {/* Director & Actors */}
            {(movie.director?.length > 0 || movie.actor?.length > 0) && (
              <GlassCard className="p-4" hover={false}>
                <div className="space-y-3">
                  {movie.director?.length > 0 && (
                    <div className="flex items-start gap-3">
                      <span className="text-sm text-white/50 min-w-[80px]">Đạo diễn:</span>
                      <span className="text-sm text-white/80">
                        {movie.director.join(', ')}
                      </span>
                    </div>
                  )}
                  {movie.actor?.length > 0 && (
                    <div className="flex items-start gap-3">
                      <span className="text-sm text-white/50 min-w-[80px]">Diễn viên:</span>
                      <span className="text-sm text-white/80 line-clamp-2">
                        {movie.actor.slice(0, 10).join(', ')}
                        {movie.actor.length > 10 && '...'}
                      </span>
                    </div>
                  )}
                </div>
              </GlassCard>
            )}

            {/* Synopsis */}
            {movie.content && (
              <div className="space-y-2">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <span className="w-1 h-5 bg-gradient-to-b from-violet-600 to-purple-600 rounded-full" />
                  Nội dung phim
                </h2>
                <div
                  className="text-white/70 leading-relaxed text-sm md:text-base"
                  dangerouslySetInnerHTML={{ __html: movie.content }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Episode List */}
        {episodes && episodes.length > 0 && (
          <div className="mt-12 space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-violet-600 to-purple-600 rounded-full" />
              Danh sách tập phim
            </h2>
            <EpisodeList episodes={episodes} movieSlug={slug} />
          </div>
        )}

        {/* Reviews Section */}
        <div className="mt-12">
          <MovieReviewsSection movieSlug={slug} movieName={movie.name} />
        </div>

        {/* Notify/Showtimes */}
        {(movie.notify || movie.showtimes) && (
          <GlassCard className="mt-8 p-4" hover={false}>
            {movie.notify && (
              <p className="text-amber-400 text-sm">{movie.notify}</p>
            )}
            {movie.showtimes && (
              <p className="text-white/70 text-sm mt-2">{movie.showtimes}</p>
            )}
          </GlassCard>
        )}
      </div>
    </div>
  );
}
