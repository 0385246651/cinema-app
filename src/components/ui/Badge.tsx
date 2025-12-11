import React from 'react';
import { cn } from '@/lib/utils';
import { Volume2 } from 'lucide-react';

interface BadgeProps {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'info' | 'vietsub' | 'thuyetminh';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
  animated?: boolean;
}

export function Badge({
  variant = 'default',
  size = 'sm',
  children,
  className,
  animated = false,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-semibold uppercase tracking-wider',
        'backdrop-blur-md rounded-md',
        
        // Size
        size === 'sm' && 'px-2 py-0.5 text-[10px]',
        size === 'md' && 'px-2.5 py-1 text-xs',
        
        // Variants
        variant === 'default' && [
          'bg-white/[0.1] text-white/90 border border-white/[0.15]',
        ],
        variant === 'primary' && [
          'bg-gradient-to-r from-violet-600 to-purple-600 text-white border border-violet-400/30',
        ],
        variant === 'success' && [
          'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
        ],
        variant === 'warning' && [
          'bg-amber-500/20 text-amber-400 border border-amber-500/30',
        ],
        variant === 'info' && [
          'bg-blue-500/20 text-blue-400 border border-blue-500/30',
        ],
        variant === 'vietsub' && [
          'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30',
        ],
        variant === 'thuyetminh' && [
          'bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white border-0',
          'shadow-lg shadow-orange-500/30',
          animated && 'animate-pulse',
        ],
        className
      )}
    >
      {children}
    </span>
  );
}

// Quality badge with automatic color
export function QualityBadge({ quality }: { quality: string | undefined }) {
  if (!quality) return null;
  
  const variant = 
    quality.includes('FHD') || quality.includes('4K') ? 'primary' :
    quality.includes('HD') ? 'success' :
    'warning';
  
  return <Badge variant={variant}>{quality}</Badge>;
}

// Episode badge
export function EpisodeBadge({ 
  current, 
  total 
}: { 
  current: string | undefined; 
  total?: string | undefined;
}) {
  if (!current) return null;
  
  const isComplete = total && !total.includes('cập nhật');
  const text = isComplete ? `${current}/${total}` : current;
  
  return (
    <Badge variant={isComplete ? 'success' : 'info'}>
      {text}
    </Badge>
  );
}

// Language badge with special styling for Thuyết Minh
export function LangBadge({ lang }: { lang: string | undefined }) {
  if (!lang) return null;
  
  const isThuyetMinh = lang.toLowerCase().includes('thuyết minh') || 
                        lang.toLowerCase().includes('thuyet minh') ||
                        lang.toLowerCase().includes('lồng tiếng') ||
                        lang.toLowerCase().includes('long tieng');
  
  if (isThuyetMinh) {
    return (
      <Badge variant="thuyetminh" animated className="gap-1">
        <Volume2 className="w-3 h-3" />
        {lang}
      </Badge>
    );
  }
  
  const isVietsub = lang.toLowerCase().includes('vietsub') || 
                    lang.toLowerCase().includes('phụ đề');
  
  return <Badge variant={isVietsub ? 'vietsub' : 'default'}>{lang}</Badge>;
}
