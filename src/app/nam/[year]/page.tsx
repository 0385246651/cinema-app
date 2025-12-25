import { Metadata } from 'next';
import { getMoviesByYear, getCountries, getCategories } from '@/lib/api';
import { MovieGrid, Pagination, FilterBar } from '@/components/movie';

interface PageProps {
  params: Promise<{ year: string }>;
  searchParams: Promise<{ page?: string; country?: string; category?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { year } = await params;

  return {
    title: `Phim năm ${year} | CinemaHub`,
    description: `Danh sách phim phát hành năm ${year} mới nhất, chất lượng cao.`,
  };
}

export default async function YearPage({ params, searchParams }: PageProps) {
  const { year } = await params;
  const { page: pageParam, country, category } = await searchParams;
  const page = parseInt(pageParam || '1');
  const numericYear = parseInt(year);

  // Validate year
  if (isNaN(numericYear)) {
    return <div>Năm không hợp lệ</div>;
  }

  const [data, countries, categories] = await Promise.all([
    getMoviesByYear(numericYear, page, 24),
    getCountries(),
    getCategories(),
  ]);

  const movies = data?.data?.items || [];
  const pagination = data?.data?.params?.pagination;

  return (
    <div className="container mx-auto px-4 py-8 pt-16">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          <span className="gradient-text">Phim năm {year}</span>
        </h1>
        {pagination && (
          <p className="text-white/50">
            Trang {pagination.currentPage} / {pagination.totalPages} • {pagination.totalItems} phim
          </p>
        )}
      </div>

      {/* Filter Bar */}
      <FilterBar countries={countries} categories={categories} baseUrl={`/nam/${year}`} hideYear />

      {/* Movie Grid */}
      <MovieGrid movies={movies} />

      {/* Pagination */}
      {pagination && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          baseUrl={`/nam/${year}`}
        />
      )}
    </div>
  );
}
