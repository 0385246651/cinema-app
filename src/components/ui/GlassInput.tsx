'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export function GlassInput({
  className,
  icon,
  ...props
}: GlassInputProps) {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
          {icon}
        </div>
      )}
      <input
        className={cn(
          'w-full py-3 px-4 text-white/90 placeholder:text-white/40',
          'bg-white/[0.05] backdrop-blur-xl',
          'border border-white/[0.12] rounded-xl',
          'transition-all duration-300',
          'focus:outline-none focus:bg-white/[0.08]',
          'focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20',
          icon && 'pl-12',
          className
        )}
        {...props}
      />
    </div>
  );
}

export function SearchInput({
  className,
  ...props
}: Omit<GlassInputProps, 'icon'>) {
  return (
    <GlassInput
      icon={<Search className="w-5 h-5" />}
      placeholder="Tìm kiếm phim..."
      className={className}
      {...props}
    />
  );
}
