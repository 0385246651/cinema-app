'use client';

import { ReactNode, useRef, useState, useCallback, useImperativeHandle, forwardRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface NativeCarouselHandle {
  scrollLeft: () => void;
  scrollRight: () => void;
}

interface NativeCarouselProps {
  children: ReactNode;
  className?: string;
  itemWidth?: string;
  gap?: string;
  onScrollStateChange?: (state: { canScrollLeft: boolean; canScrollRight: boolean }) => void;
}

export const NativeCarousel = forwardRef<NativeCarouselHandle, NativeCarouselProps>(({
  children,
  className = '',
  itemWidth,
  gap = '1rem',
  onScrollStateChange
}, ref) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollPosition = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

    // Check if values have changed to avoid unnecessary updates
    const newCanScrollLeft = scrollLeft > 0;
    const newCanScrollRight = scrollLeft < scrollWidth - clientWidth - 10;

    // Update local state if needed
    if (newCanScrollLeft !== canScrollLeft || newCanScrollRight !== canScrollRight) {
      setCanScrollLeft(newCanScrollLeft);
      setCanScrollRight(newCanScrollRight);

      // Notify parent
      onScrollStateChange?.({
        canScrollLeft: newCanScrollLeft,
        canScrollRight: newCanScrollRight
      });
    }
  }, [canScrollLeft, canScrollRight, onScrollStateChange]);

  const scrollLeftFn = useCallback(() => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    setTimeout(checkScrollPosition, 300); // Check after scroll animation
  }, [checkScrollPosition]);

  const scrollRightFn = useCallback(() => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    setTimeout(checkScrollPosition, 300); // Check after scroll animation
  }, [checkScrollPosition]);

  // Expose scroll methods to parent
  useImperativeHandle(ref, () => ({
    scrollLeft: scrollLeftFn,
    scrollRight: scrollRightFn
  }));

  // Initial check on mount
  useEffect(() => {
    checkScrollPosition();
    // Add resize listener
    window.addEventListener('resize', checkScrollPosition);
    return () => window.removeEventListener('resize', checkScrollPosition);
  }, [checkScrollPosition]);

  return (
    <div className={cn('relative group', className)}>
      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        onScroll={checkScrollPosition}
        className="flex items-start overflow-x-auto scrollbar-hide scroll-smooth"
        style={{
          gap,
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {Array.isArray(children) ? children.map((child, index) => (
          <div
            key={index}
            style={{
              width: itemWidth,
              scrollSnapAlign: 'start'
            }}
            className={cn("flex-shrink-0", !itemWidth && "w-[170px] md:w-[220px] xl:w-[260px]")}
          >
            {child}
          </div>
        )) : children}
      </div>

      {/* Inline controls fallback (only if no external control callback provided) */}
      {!onScrollStateChange && (
        <>
          {canScrollLeft && (
            <button
              onClick={scrollLeftFn}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={scrollRightFn}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </>
      )}
    </div>
  );
});

NativeCarousel.displayName = 'NativeCarousel';
