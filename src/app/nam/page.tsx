'use client';

import Link from 'next/link';
import { Calendar, ChevronRight, Filter } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function YearsPage() {
  const router = useRouter();
  const currentYear = new Date().getFullYear();
  const displayYears = Array.from({ length: 30 }, (_, i) => currentYear + 1 - i); // Grid display (Next Year -> 30 years back)
  const allYears = Array.from({ length: currentYear - 1970 + 2 }, (_, i) => currentYear + 1 - i); // Dropdown 1970 -> Current + 1

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-8 text-white/60 text-sm">
          <Link href="/" className="hover:text-violet-400 transition-colors">
            Trang chủ
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-white">Năm phát hành</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent mb-4">
              Năm phát hành
            </h1>
            <p className="text-white/60 max-w-2xl text-lg">
              Khám phá kho phim khổng lồ qua các năm. Từ những bom tấn mới nhất cho đến những tác phẩm kinh điển.
            </p>
          </div>

          {/* Quick Select Dropdown */}
          <div className="relative min-w-[200px]">
            <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">
              Chuyển nhanh đến năm
            </label>
            <div className="relative">
              <select
                onChange={(e) => {
                  if (e.target.value) router.push(`/nam/${e.target.value}`);
                }}
                className="w-full appearance-none bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500 focus:bg-white/[0.1] transition-all cursor-pointer"
                defaultValue=""
              >
                <option value="" disabled>Chọn năm...</option>
                {allYears.map((year) => (
                  <option key={year} value={year} className="bg-[#0a0a1a] text-white">
                    Năm {year}
                  </option>
                ))}
              </select>
              <Filter className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Years Grid */}
        <div className="grid grid-cols-2 xxs:grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {displayYears.map((year) => (
            <Link
              key={year}
              href={`/nam/${year}`}
              className="group relative overflow-hidden rounded-xl bg-white/[0.03] border border-white/[0.05] p-6 hover:bg-violet-600/20 hover:border-violet-500/50 transition-all duration-300"
            >
              <div className="flex flex-col items-center justify-center gap-3">
                <span className="p-3 rounded-full bg-white/5 group-hover:bg-violet-500 group-hover:scale-110 transition-all duration-300">
                  <Calendar className="w-6 h-6 text-white/40 group-hover:text-white" />
                </span>
                <span className="text-xl font-bold text-white/80 group-hover:text-white transition-colors">
                  {year}
                </span>
              </div>

              {/* Decorative Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/0 via-violet-500/0 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
