'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function GlassButton({
  variant = 'default',
  size = 'md',
  className,
  children,
  ...props
}: GlassButtonProps) {
  return (
    <button
      className={cn(
        // Base styles
        'inline-flex items-center justify-center gap-2',
        'font-medium transition-all duration-300 ease-out',
        'focus:outline-none focus:ring-2 focus:ring-violet-500/50',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'active:scale-[0.98]',

        // Size variants
        size === 'sm' && 'px-3 py-1.5 text-sm rounded-lg',
        size === 'md' && 'px-5 py-2.5 text-sm rounded-xl',
        size === 'lg' && 'px-6 py-3 text-base rounded-xl',

        // Style variants
        variant === 'default' && [
          'bg-white/[0.08] backdrop-blur-xl',
          'border border-white/[0.15]',
          'text-white/90',
          'hover:bg-white/[0.15] hover:border-white/[0.25]',
          'hover:scale-[1.02]',
        ],
        variant === 'primary' && [
          'bg-gradient-to-r from-violet-600 to-purple-600',
          'border border-violet-400/30',
          'text-white',
          'shadow-[0_0_20px_rgba(139,92,246,0.4)]',
          'hover:shadow-[0_0_30px_rgba(139,92,246,0.6)]',
          'hover:scale-[1.02]',
        ],
        variant === 'ghost' && [
          'bg-transparent',
          'text-white/80',
          'hover:bg-white/[0.08]',
          'hover:text-white',
        ],
        variant === 'outline' && [
          'bg-transparent',
          'border border-white/[0.2]',
          'text-white/90',
          'hover:bg-white/[0.08]',
          'hover:border-white/[0.3]',
        ],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
