import { Metadata } from 'next';
import { getMoviesByType } from '@/lib/api';
import { MovieGrid, Pagination } from '@/components/movie';
import { MOVIE_TYPES } from '@/lib/constants';

interface PageProps {
  params: Promise<{ type: string }>;
  searchParams: Promise<{ page?: string }>;
}

const typeMap: Record<string, string> = {
  'phim-bo': 'phim-bo',
  'phim-le': 'phim-le',
  'tv-shows': 'tv-shows',
  'hoat-hinh': 'hoat-hinh',
  'phim-moi': 'phim-moi-cap-nhat',
};

const titleMap: Record<string, string> = {
  'phim-bo': 'Phim Bộ',
  'phim-le': 'Phim Lẻ',
  'tv-shows': 'TV Shows',
  'hoat-hinh': 'Hoạt Hình',
  'phim-moi': 'Phim Mới Cập Nhật',
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { type } = await params;
  const title = titleMap[type] || 'Danh sách phim';

  return {
    title: `${title} | PhimHay`,
    description: `Xem ${title.toLowerCase()} mới nhất, chất lượng cao, vietsub.`,
  };
}

export default async function MovieListPage({ params, searchParams }: PageProps) {
  const { type } = await params;
  const { page: pageParam } = await searchParams;
  const page = parseInt(pageParam || '1');
  const apiType = typeMap[type] || type;

  const data = await getMoviesByType(apiType, page, 24);
  const movies = data?.data?.items || [];
  const pagination = data?.data?.params?.pagination;
  const title = titleMap[type] || data?.data?.titlePage || 'Danh sách phim';

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          <span className="gradient-text">{title}</span>
        </h1>
        {pagination && (
          <p className="text-white/50">
            Trang {pagination.currentPage} / {pagination.totalPages} • {pagination.totalItems} phim
          </p>
        )}
      </div>

      {/* Movie Grid */}
      <MovieGrid movies={movies} />

      {/* Pagination */}
      {pagination && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          baseUrl={`/danh-sach/${type}`}
        />
      )}
    </div>
  );
}
