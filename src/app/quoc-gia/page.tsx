import { Metadata } from 'next';
import Link from 'next/link';
import { getCountries } from '@/lib/api';
import { GlassCard } from '@/components/ui';
import { Globe } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Quốc gia | PhimHay',
  description: 'Xem phim theo quốc gia - Trung Quốc, Hàn Quốc, Nhật Bản, Âu Mỹ và nhiều quốc gia khác.',
};

export default async function CountriesPage() {
  const countries = await getCountries();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          <span className="gradient-text">Quốc gia</span>
        </h1>
        <p className="text-white/50">
          Khám phá phim theo quốc gia sản xuất
        </p>
      </div>

      {/* Countries Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {countries.map((country) => (
          <Link key={country.slug} href={`/quoc-gia/${country.slug}`}>
            <GlassCard className="p-4 h-full flex flex-col items-center justify-center text-center min-h-[100px] group">
              <Globe className="w-6 h-6 mb-2 text-violet-400 group-hover:scale-110 transition-transform" />
              <span className="font-medium text-white/90 group-hover:text-violet-400 transition-colors">
                {country.name}
              </span>
            </GlassCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
