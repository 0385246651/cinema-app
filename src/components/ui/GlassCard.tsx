'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
  glow?: boolean;
}

export function GlassCard({
  children,
  className,
  hover = true,
  glow = false,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl',
        'bg-white/[0.08] backdrop-blur-xl',
        'border border-white/[0.15]',
        'shadow-[0_8px_32px_rgba(0,0,0,0.37)]',
        'transition-all duration-300 ease-out',
        hover && [
          'hover:bg-white/[0.12]',
          'hover:border-white/[0.25]',
          'hover:-translate-y-1',
          'hover:shadow-[0_12px_40px_rgba(0,0,0,0.45)]',
        ],
        glow && 'hover:shadow-[0_0_40px_rgba(139,92,246,0.3)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// Glass card with inner glow effect
export function GlassCardGlow({
  children,
  className,
  ...props
}: GlassCardProps) {
  return (
    <div className="relative group">
      {/* Glow effect */}
      <div
        className={cn(
          'absolute -inset-[1px] rounded-2xl opacity-0 blur-sm transition-opacity duration-500',
          'bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500',
          'group-hover:opacity-50'
        )}
      />
      <GlassCard className={cn('relative', className)} {...props}>
        {children}
      </GlassCard>
    </div>
  );
}
