'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';
import { cn } from '@/lib/utils';

// Reuse the simple hook from AnimatedSection or define here
function useInView(options = { threshold: 0.1, rootMargin: '0px' }) {
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

interface ScrollRevealProps {
  children: ReactNode;
  animation?: 'fadeUp' | 'fadeIn' | 'slideLeft' | 'slideRight' | 'scale' | 'stagger';
  delay?: number;
  duration?: number;
  className?: string;
  staggerChildren?: boolean;
  staggerDelay?: number;
}

export function ScrollReveal({
  children,
  animation = 'fadeUp',
  delay = 0,
  duration = 0.8,
  className = '',
  staggerChildren = false,
  staggerDelay = 0.1,
}: ScrollRevealProps) {
  const { ref, isInView } = useInView({ threshold: 0.1, rootMargin: '0px' });

  const getAnimationClass = () => {
    switch (animation) {
      case 'fadeUp':
        return isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8';
      case 'fadeIn':
        return isInView ? 'opacity-100' : 'opacity-0';
      case 'slideLeft':
        return isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8';
      case 'slideRight':
        return isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8';
      case 'scale':
        return isInView ? 'opacity-100 scale-100' : 'opacity-0 scale-95';
      default:
        return isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8';
    }
  };

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all ease-out transform will-change-transform",
        getAnimationClass(),
        className
      )}
      style={{
        transitionDuration: `${duration * 1000}ms`,
        transitionDelay: `${delay * 1000}ms`,
      }}
    >
      {staggerChildren && Array.isArray(children)
        ? children.map((child, i) => (
          <div
            key={i}
            className={cn(
              "transition-all ease-out transform",
              getAnimationClass()
            )}
            style={{
              transitionDuration: `${duration * 1000}ms`,
              transitionDelay: `${(delay + i * staggerDelay) * 1000}ms`,
            }}
          >
            {child}
          </div>
        ))
        : children}
    </div>
  );
}

// Animated Counter component
interface AnimatedCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export function AnimatedCounter({
  end,
  duration = 2,
  suffix = '',
  prefix = '',
  className = '',
}: AnimatedCounterProps) {
  const { ref, isInView } = useInView();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

      // Easing function (easeOutExpo)
      const easedProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      setCount(Math.floor(easedProgress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, end, duration]);

  // Use a span ref for the observer
  return <span ref={ref as any} className={className}>{prefix}{count}{suffix}</span>;
}

// Parallax component
interface ParallaxProps {
  children: ReactNode;
  speed?: number;
  className?: string;
}

export function Parallax({ children, speed = 0.5, className = '' }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const { top } = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Only calculate if in view or near view
      if (top < windowHeight && top > -ref.current.offsetHeight) {
        const distFromCenter = top - windowHeight / 2;
        setOffset(distFromCenter * speed * -0.1);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ transform: `translateY(${offset}px)`, transition: 'transform 0.1s linear' }}
    >
      {children}
    </div>
  );
}

// Magnetic Hover effect for buttons
interface MagneticProps {
  children: ReactNode;
  className?: string;
  strength?: number;
}

export function Magnetic({ children, className = '', strength = 0.3 }: MagneticProps) {
  const magnetRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const magnet = magnetRef.current;
    if (!magnet) return;

    const rect = magnet.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    setPosition({ x: x * strength, y: y * strength });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div
      ref={magnetRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: 'transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      }}
    >
      {children}
    </div>
  );
}
