import { Metadata } from 'next';
import { getDubbedMovies, getFullImageUrl } from '@/lib/api';
import { MovieGrid, Pagination } from '@/components/movie';
import { Volume2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Phim Thuyết Minh | PhimHay',
  description: 'Xem phim thuyết minh tiếng Việt chất lượng cao. Phim bộ, phim lẻ, hoạt hình lồng tiếng Việt.',
};

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function ThuyetMinhPage({ searchParams }: PageProps) {
  const { page: pageParam } = await searchParams;
  const page = parseInt(pageParam || '1', 10);
  
  let data;
  try {
    data = await getDubbedMovies(page, 24);
  } catch (error) {
    console.error('Error fetching dubbed movies:', error);
    data = null;
  }

  const movies = data?.data?.items || [];
  const pagination = data?.data?.params?.pagination || { totalPages: 1, currentPage: page };

  // Filter movies that are actually dubbed (contain thuyết minh in lang)
  const dubbedMovies = movies.filter((movie: any) => {
    const lang = (movie.lang || '').toLowerCase();
    return lang.includes('thuyết minh') || 
           lang.includes('thuyet minh') || 
           lang.includes('lồng tiếng') ||
           lang.includes('long tieng') ||
           lang.includes('vietsub + thuyết minh');
  });

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <Volume2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
                Phim Thuyết Minh
              </h1>
              <p className="text-white/60 mt-1">
                Phim lồng tiếng Việt - Dễ xem, dễ hiểu
              </p>
            </div>
          </div>
          
          {/* Info banner */}
          <div className="glass-card p-4 rounded-xl border-l-4 border-orange-500">
            <p className="text-sm text-white/70">
              🔊 Tất cả phim trong danh mục này đều có <span className="text-orange-400 font-semibold">THUYẾT MINH tiếng Việt</span>. 
              Phù hợp cho người lớn tuổi và trẻ em chưa biết đọc phụ đề.
            </p>
          </div>
        </div>

        {/* Movies Grid */}
        {dubbedMovies.length > 0 ? (
          <>
            <MovieGrid movies={dubbedMovies} />
            
            {pagination.totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  baseUrl="/thuyet-minh"
                />
              </div>
            )}
          </>
        ) : movies.length > 0 ? (
          // Show all movies if filter returns empty
          <>
            <p className="text-white/50 mb-4 text-sm">
              Hiển thị tất cả phim có liên quan đến thuyết minh:
            </p>
            <MovieGrid movies={movies} />
            
            {pagination.totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  baseUrl="/thuyet-minh"
                />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <Volume2 className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Không tìm thấy phim</h2>
            <p className="text-white/50">Vui lòng thử lại sau</p>
          </div>
        )}
      </div>
    </div>
  );
}
