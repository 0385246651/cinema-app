import { Metadata } from 'next';
import { getMoviesByCategory, getCategories, getCountries } from '@/lib/api';
import { MovieGrid, Pagination, FilterBar } from '@/components/movie';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; year?: string; country?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug);

  return {
    title: `Phim ${category?.name || slug} | PhimHay`,
    description: `Xem phim thể loại ${category?.name || slug} mới nhất, chất lượng cao, vietsub.`,
  };
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { page: pageParam, year, country } = await searchParams;
  const page = parseInt(pageParam || '1');

  const [data, categories, countries] = await Promise.all([
    getMoviesByCategory(slug, page, 24),
    getCategories(),
    getCountries(),
  ]);

  const category = categories.find((c) => c.slug === slug);
  const movies = data?.data?.items || [];
  const pagination = data?.data?.params?.pagination;

  return (
    <div className="container mx-auto px-4 py-8 pt-16">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          <span className="gradient-text">Phim {category?.name || slug}</span>
        </h1>
        {pagination && (
          <p className="text-white/50">
            Trang {pagination.currentPage} / {pagination.totalPages} • {pagination.totalItems} phim
          </p>
        )}
      </div>

      {/* Filter Bar */}
      <FilterBar countries={countries} categories={categories} baseUrl={`/the-loai/${slug}`} hideCategory />

      {/* Movie Grid */}
      <MovieGrid movies={movies} />

      {/* Pagination */}
      {pagination && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          baseUrl={`/the-loai/${slug}`}
        />
      )}
    </div>
  );
}
