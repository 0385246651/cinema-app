'use client';

import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  value: number;
  onChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showValue?: boolean;
}

export function StarRating({
  value,
  onChange,
  readonly = false,
  size = 'md',
  showValue = false,
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState(0);

  const sizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const handleClick = (rating: number) => {
    if (!readonly && onChange) {
      onChange(rating);
    }
  };

  const displayValue = hoverValue || value;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleClick(star)}
          onMouseEnter={() => !readonly && setHoverValue(star)}
          onMouseLeave={() => !readonly && setHoverValue(0)}
          disabled={readonly}
          className={cn(
            'transition-all duration-150',
            !readonly && 'hover:scale-110 cursor-pointer',
            readonly && 'cursor-default'
          )}
        >
          <Star
            className={cn(
              sizes[size],
              'transition-colors',
              star <= displayValue
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-white/20'
            )}
          />
        </button>
      ))}
      {showValue && (
        <span className="ml-2 text-sm text-white/60">
          {value > 0 ? value.toFixed(1) : '—'}
        </span>
      )}
    </div>
  );
}
