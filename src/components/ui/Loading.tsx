'use client';

import { cn } from '@/lib/utils';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <div className={cn('relative', sizeClasses[size], className)}>
      <div className="absolute inset-0 rounded-full border-2 border-white/10" />
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-purple-500 animate-spin" />
    </div>
  );
}

// Fancy loading dots
export function LoadingDots({ className }: { className?: string }) {
  return (
    <div className={cn('loading-dots flex items-center justify-center', className)}>
      <span />
      <span />
      <span />
    </div>
  );
}

// Full page loading overlay
export function PageLoader({ message }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        {/* Animated Logo */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 animate-pulse" />
          <div className="absolute inset-2 rounded-full bg-black/80 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-white animate-spin-slow"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>

        {/* Loading text */}
        <div className="flex items-center gap-2 text-white/70">
          <span>{message || 'Đang tải'}</span>
          <LoadingDots />
        </div>
      </div>
    </div>
  );
}

// Skeleton wave effect
interface SkeletonWaveProps {
  className?: string;
  style?: React.CSSProperties;
}

export function SkeletonWave({ className, style }: SkeletonWaveProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden bg-white/5 rounded-lg',
        className
      )}
      style={style}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
    </div>
  );
}

// Content placeholder while loading
interface ContentPlaceholderProps {
  lines?: number;
  className?: string;
}

export function ContentPlaceholder({ lines = 3, className }: ContentPlaceholderProps) {
  const widths = ['85%', '70%', '90%', '60%', '75%'];

  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonWave
          key={i}
          className="h-4"
          style={{ width: widths[i % widths.length] }}
        />
      ))}
    </div>
  );
}

// Intersection loading indicator
export function IntersectionLoader({ isLoading }: { isLoading: boolean }) {
  if (!isLoading) return null;

  return (
    <div className="flex items-center justify-center py-8">
      <div className="flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-lg rounded-full border border-white/10">
        <Spinner size="sm" />
        <span className="text-sm text-white/70">Đang tải thêm...</span>
      </div>
    </div>
  );
}

// Refresh indicator for pull-to-refresh
interface RefreshIndicatorProps {
  isRefreshing: boolean;
  pullProgress?: number;
}

export function RefreshIndicator({ isRefreshing, pullProgress = 0 }: RefreshIndicatorProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center py-4 transition-all duration-300',
        isRefreshing ? 'opacity-100' : 'opacity-0'
      )}
      style={{ transform: `translateY(${pullProgress * 20}px)` }}
    >
      <div className="flex items-center gap-2 text-white/70 text-sm">
        <Spinner size="sm" />
        <span>{isRefreshing ? 'Đang làm mới...' : 'Kéo để làm mới'}</span>
      </div>
    </div>
  );
}
