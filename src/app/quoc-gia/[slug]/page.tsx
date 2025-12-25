import { Metadata } from 'next';
import { getMoviesByCountry, getCountries } from '@/lib/api';
import { MovieGrid, Pagination } from '@/components/movie';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const countries = await getCountries();
  const country = countries.find((c) => c.slug === slug);

  return {
    title: `Phim ${country?.name || slug} | PhimHay`,
    description: `Xem phim ${country?.name || slug} mới nhất, chất lượng cao, vietsub.`,
  };
}

export default async function CountryPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = parseInt(pageParam || '1');

  const [data, countries] = await Promise.all([
    getMoviesByCountry(slug, page, 24),
    getCountries(),
  ]);

  const country = countries.find((c) => c.slug === slug);
  const movies = data?.data?.items || [];
  const pagination = data?.data?.params?.pagination;

  return (
    <div className="container mx-auto px-4 py-8 pt-16">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          <span className="gradient-text">Phim {country?.name || slug}</span>
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
          baseUrl={`/quoc-gia/${slug}`}
        />
      )}
    </div>
  );
}
