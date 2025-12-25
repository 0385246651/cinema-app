'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { Country, Category } from '@/types';

interface FilterBarProps {
  countries: Country[];
  categories: Category[];
  baseUrl: string;
  hideCategory?: boolean;
  hideCountry?: boolean;
  hideYear?: boolean;
}

const years = Array.from({ length: 56 }, (_, i) => 2025 - i);

const langOptions = [
  { value: '', label: 'Tất cả' },
  { value: 'vietsub', label: 'Vietsub' },
];

export function FilterBar({
  countries,
  categories,
  baseUrl,
  hideCategory = false,
  hideCountry = false,
  hideYear = false,
}: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentYear = searchParams.get('year') || '';
  const currentCountry = searchParams.get('country') || '';
  const currentCategory = searchParams.get('category') || '';
  const currentLang = searchParams.get('lang') || '';

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    // Reset to page 1 when filter changes
    params.delete('page');

    const queryString = params.toString();
    router.push(`${baseUrl}${queryString ? `?${queryString}` : ''}`);
  };

  const clearFilters = () => {
    router.push(baseUrl);
  };

  const hasFilters = currentYear || currentCountry || currentCategory || currentLang;

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6 p-4 bg-white/5 rounded-xl border border-white/10">
      {/* Category Filter */}
      {!hideCategory && (
        <div className="relative">
          <select
            value={currentCategory}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="appearance-none bg-white/10 border border-white/20 rounded-lg px-4 py-2 pr-10 text-sm text-white focus:outline-none focus:border-violet-500 cursor-pointer hover:bg-white/15 transition-colors"
          >
            <option value="" className="bg-[#0a0a1a]">Tất cả thể loại</option>
            {categories.map((cat) => (
              <option key={cat.slug} value={cat.slug} className="bg-[#0a0a1a]">
                {cat.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
        </div>
      )}

      {/* Country Filter */}
      {!hideCountry && (
        <div className="relative">
          <select
            value={currentCountry}
            onChange={(e) => handleFilterChange('country', e.target.value)}
            className="appearance-none bg-white/10 border border-white/20 rounded-lg px-4 py-2 pr-10 text-sm text-white focus:outline-none focus:border-violet-500 cursor-pointer hover:bg-white/15 transition-colors"
          >
            <option value="" className="bg-[#0a0a1a]">Tất cả quốc gia</option>
            {countries.map((country) => (
              <option key={country.slug} value={country.slug} className="bg-[#0a0a1a]">
                {country.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
        </div>
      )}

      {/* Year Filter */}
      {!hideYear && (
        <div className="relative">
          <select
            value={currentYear}
            onChange={(e) => handleFilterChange('year', e.target.value)}
            className="appearance-none bg-white/10 border border-white/20 rounded-lg px-4 py-2 pr-10 text-sm text-white focus:outline-none focus:border-violet-500 cursor-pointer hover:bg-white/15 transition-colors"
          >
            <option value="" className="bg-[#0a0a1a]">Tất cả năm</option>
            {years.map((year) => (
              <option key={year} value={year} className="bg-[#0a0a1a]">
                {year}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
        </div>
      )}

      {/* Language Filter */}
      <div className="relative">
        <select
          value={currentLang}
          onChange={(e) => handleFilterChange('lang', e.target.value)}
          className="appearance-none bg-white/10 border border-white/20 rounded-lg px-4 py-2 pr-10 text-sm text-white focus:outline-none focus:border-violet-500 cursor-pointer hover:bg-white/15 transition-colors"
        >
          {langOptions.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#0a0a1a]">
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
      </div>

      {/* Clear Filters */}
      {hasFilters && (
        <button
          onClick={clearFilters}
          className="px-4 py-2 text-sm text-white/70 hover:text-white bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg transition-colors"
        >
          Xóa bộ lọc
        </button>
      )}
    </div>
  );
}
