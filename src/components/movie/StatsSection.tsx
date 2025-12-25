import { Film, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatedGrid } from '@/components/ui/AnimatedSection';

interface StatsSectionProps {
  totalMovies: number;
  totalMoviesLabel?: string;
  updatedToday: number;
  updatedTodayLabel?: string;
}

export function StatsSection({
  totalMovies,
  totalMoviesLabel = "Tổng số lượng phim",
  updatedToday,
  updatedTodayLabel = "Cập nhật hôm nay",
}: StatsSectionProps) {
  return (
    <div className="container mx-auto px-4 -mt-6 relative z-20">
      <AnimatedGrid className="grid grid-cols-2 gap-2 md:gap-3 max-w-md md:max-w-xl mx-auto" staggerDelay={0.2}>
        {/* Updated Today */}
        <div
          className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-lg md:rounded-xl p-2 md:p-3 flex items-center justify-center gap-2 md:gap-3 group hover:bg-white/[0.05] transition-colors"
        >
          <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 flex-shrink-0">
            <Clock className="w-3 h-3 md:w-4 md:h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-white/50 text-[10px] md:text-xs uppercase tracking-wide truncate">
              {updatedTodayLabel}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-base md:text-xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                {updatedToday}
              </span>
              <span className="text-[10px] md:text-xs text-white/40">Phim</span>
            </div>
          </div>
        </div>

        {/* Total Movies */}
        <div
          className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-lg md:rounded-xl p-2 md:p-3 flex items-center justify-center gap-2 md:gap-3 group hover:bg-white/[0.05] transition-colors"
        >
          <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 flex-shrink-0">
            <Film className="w-3 h-3 md:w-4 md:h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-white/50 text-[10px] md:text-xs uppercase tracking-wide truncate">
              {totalMoviesLabel}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-base md:text-xl font-bold bg-gradient-to-r from-violet-400 to-purple-500 bg-clip-text text-transparent">
                {totalMovies.toLocaleString()}
              </span>
              <span className="text-[10px] md:text-xs text-white/40">Phim</span>
            </div>
          </div>
        </div>
      </AnimatedGrid>
    </div>
  );
}
