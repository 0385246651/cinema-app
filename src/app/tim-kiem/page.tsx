import { Metadata } from 'next';
import { searchMovies } from '@/lib/api';
import { MovieGrid, Pagination } from '@/components/movie';
import { SearchInput } from '@/components/ui';
import { Search as SearchIcon } from 'lucide-react';

interface PageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { q } = await searchParams;
  
  return {
    title: q ? `Tìm kiếm: ${q} | PhimHay` : 'Tìm kiếm phim | PhimHay',
    description: q 
      ? `Kết quả tìm kiếm cho "${q}" - Xem phim chất lượng cao`
      : 'Tìm kiếm phim hay, phim mới nhất',
  };
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q: query, page: pageParam } = await searchParams;
  const page = parseInt(pageParam || '1');

  let movies: any[] = [];
  let pagination: any = null;

  if (query) {
    const data = await searchMovies(query, page, 24);
    movies = data?.data?.items || [];
    pagination = data?.data?.params?.pagination;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="max-w-2xl mx-auto mb-12">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">
          <span className="gradient-text">Tìm kiếm phim</span>
        </h1>
        
        <form action="/tim-kiem" method="get" className="relative">
          <SearchInput
            name="q"
            defaultValue={query}
            placeholder="Nhập tên phim, diễn viên, đạo diễn..."
            className="w-full text-lg py-4"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-violet-600 to-purple-600 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
          >
            Tìm kiếm
          </button>
        </form>
      </div>

      {/* Search Results */}
      {query ? (
        <>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">
              Kết quả tìm kiếm cho: <span className="text-violet-400">"{query}"</span>
            </h2>
            {pagination && (
              <p className="text-white/50 text-sm">
                Tìm thấy {pagination.totalItems} kết quả
              </p>
            )}
          </div>

          {movies.length > 0 ? (
            <>
              <MovieGrid movies={movies} />
              {pagination && pagination.totalPages > 1 && (
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  baseUrl={`/tim-kiem?q=${encodeURIComponent(query)}`}
                />
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-24 h-24 mb-4 rounded-full bg-white/[0.05] flex items-center justify-center">
                <SearchIcon className="w-10 h-10 text-white/30" />
              </div>
              <p className="text-white/50 text-lg mb-2">Không tìm thấy kết quả</p>
              <p className="text-white/30 text-sm">
                Thử tìm kiếm với từ khóa khác
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 mb-4 rounded-full bg-white/[0.05] flex items-center justify-center">
            <SearchIcon className="w-10 h-10 text-white/30" />
          </div>
          <p className="text-white/50 text-lg">Nhập từ khóa để tìm kiếm phim</p>
        </div>
      )}
    </div>
  );
}
