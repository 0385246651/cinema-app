import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className, showText = true }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn("flex items-center gap-3 group outline-none", className)}
    >
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl blur-lg opacity-50 group-hover:opacity-80 transition-opacity" />
        <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
      </div>
      {showText && (
        <div className="hidden sm:block">
          <span className="text-2xl font-black bg-gradient-to-r from-white via-violet-200 to-violet-400 bg-clip-text text-transparent">
            CinemaHub
          </span>
          <span className="block text-[10px] text-white/40 tracking-widest uppercase">Premium Movies</span>
        </div>
      )}
    </Link>
  );
}
