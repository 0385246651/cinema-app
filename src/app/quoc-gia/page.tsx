import { Metadata } from 'next';
import Link from 'next/link';
import { getCountries } from '@/lib/api';
import { GlassCard } from '@/components/ui';
import { Globe } from 'lucide-react';
import { Country } from '@/types';

export const metadata: Metadata = {
  title: 'Quốc gia | PhimHay',
  description: 'Xem phim theo quốc gia - Trung Quốc, Hàn Quốc, Nhật Bản, Âu Mỹ và nhiều quốc gia khác.',
};

const FALLBACK_COUNTRIES: Country[] = [
  { id: 'trung-quoc', name: 'Trung Quốc', slug: 'trung-quoc' },
  { id: 'han-quoc', name: 'Hàn Quốc', slug: 'han-quoc' },
  { id: 'nhat-ban', name: 'Nhật Bản', slug: 'nhat-ban' },
  { id: 'thai-lan', name: 'Thái Lan', slug: 'thai-lan' },
  { id: 'au-my', name: 'Âu Mỹ', slug: 'au-my' },
  { id: 'dai-loan', name: 'Đài Loan', slug: 'dai-loan' },
  { id: 'hong-kong', name: 'Hồng Kông', slug: 'hong-kong' },
  { id: 'an-do', name: 'Ấn Độ', slug: 'an-do' },
  { id: 'anh', name: 'Anh', slug: 'anh' },
  { id: 'phap', name: 'Pháp', slug: 'phap' },
  { id: 'canada', name: 'Canada', slug: 'canada' },
  { id: 'viet-nam', name: 'Việt Nam', slug: 'viet-nam' },
  { id: 'duc', name: 'Đức', slug: 'duc' },
  { id: 'tay-ban-nha', name: 'Tây Ban Nha', slug: 'tay-ban-nha' },
  { id: 'tho-nhi-ky', name: 'Thổ Nhĩ Kỳ', slug: 'tho-nhi-ky' },
  { id: 'ha-lan', name: 'Hà Lan', slug: 'ha-lan' },
  { id: 'indonesia', name: 'Indonesia', slug: 'indonesia' },
  { id: 'nga', name: 'Nga', slug: 'nga' },
  { id: 'mexico', name: 'Mexico', slug: 'mexico' },
  { id: 'ba-lan', name: 'Ba Lan', slug: 'ba-lan' },
  { id: 'uc', name: 'Úc', slug: 'uc' },
  { id: 'thuy-dien', name: 'Thụy Điển', slug: 'thuy-dien' },
  { id: 'malaysia', name: 'Malaysia', slug: 'malaysia' },
  { id: 'brazil', name: 'Brazil', slug: 'brazil' },
  { id: 'philippines', name: 'Philippines', slug: 'philippines' },
  { id: 'bo-dao-nha', name: 'Bồ Đào Nha', slug: 'bo-dao-nha' },
  { id: 'y', name: 'Ý', slug: 'y' },
  { id: 'dan-mach', name: 'Đan Mạch', slug: 'dan-mach' },
];

export default async function CountriesPage() {
  let countries: Country[] = [];
  try {
    countries = await getCountries();
  } catch (error) {
    console.error('Failed to fetch countries:', error);
  }

  // Use fallback if API returns empty
  if (!countries || countries.length === 0) {
    countries = FALLBACK_COUNTRIES;
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-16">
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
            <GlassCard className="p-4 h-full flex flex-col items-center justify-center text-center min-h-[100px] group hover:bg-white/10 transition-all cursor-pointer">
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
