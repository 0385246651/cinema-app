'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

// Simple hook to detect visibility
function useInView(options = { threshold: 0.1, rootMargin: '50px' }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated) {
        setIsInView(true);
        setHasAnimated(true);
      }
    }, options);

    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [options, hasAnimated]);

  return { ref, isInView };
}

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function AnimatedSection({ children, className = '', delay = 0 }: AnimatedSectionProps) {
  const { ref, isInView } = useInView({ threshold: 0.05, rootMargin: '100px' });

  return (
    <div
      ref={ref}
      className={cn(
        "transition-opacity duration-400 ease-out",
        isInView ? "opacity-100" : "opacity-0",
        className
      )}
      style={{
        transitionDelay: `${delay * 1000}ms`
      }}
    >
      {children}
    </div>
  );
}

// Animated Grid for staggered card animations
interface AnimatedGridProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function AnimatedGrid({ children, className = '', staggerDelay = 0.03 }: AnimatedGridProps) {
  const { ref, isInView } = useInView({ threshold: 0.05, rootMargin: '150px' });

  return (
    <div ref={ref} className={className}>
      {Array.isArray(children) ? children.map((child, index) => (
        <div
          key={index}
          className={cn(
            "transition-opacity duration-300 ease-out",
            isInView ? "opacity-100" : "opacity-0"
          )}
          style={{
            transitionDelay: `${index * staggerDelay * 1000}ms`
          }}
        >
          {child}
        </div>
      )) : (
        <div
          className={cn(
            "transition-opacity duration-300 ease-out",
            isInView ? "opacity-100" : "opacity-0"
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}

// Page transition wrapper
interface PageTransitionProps {
  children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className={cn(
        "transition-opacity duration-500 ease-out",
        mounted ? "opacity-100" : "opacity-0"
      )}
    >
      {children}
    </div>
  );
}
