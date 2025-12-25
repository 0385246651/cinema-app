'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect, ReactNode } from 'react';

// Defer loading of non-critical components until after main content
interface DeferredLoadProps {
  children: ReactNode;
  delay?: number;
  placeholder?: ReactNode;
}

export function DeferredLoad({ children, delay = 0, placeholder = null }: DeferredLoadProps) {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldLoad(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  if (!shouldLoad) return placeholder;
  return <>{children}</>;
}

// Lazy load component that loads on interaction
interface LazyOnInteractionProps {
  children: ReactNode;
  placeholder?: ReactNode;
}

export function LazyOnInteraction({ children, placeholder = null }: LazyOnInteractionProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const events = ['scroll', 'mousemove', 'touchstart', 'keydown'];
    const handleInteraction = () => {
      setIsVisible(true);
      events.forEach(event => window.removeEventListener(event, handleInteraction));
    };

    events.forEach(event => window.addEventListener(event, handleInteraction, { once: true }));
    return () => events.forEach(event => window.removeEventListener(event, handleInteraction));
  }, []);

  if (!isVisible) return placeholder;
  return <>{children}</>;
}

// Preload critical resources
export function PreloadImages({ urls }: { urls: string[] }) {
  useEffect(() => {
    urls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = url;
      document.head.appendChild(link);
    });
  }, [urls]);

  return null;
}

// Utility to lazy import heavy components
export function lazyWithPreload<T extends React.ComponentType<unknown>>(
  importFn: () => Promise<{ default: T }>
) {
  const LazyComponent = dynamic(importFn, {
    loading: () => (
      <div className="h-32 bg-white/5 rounded-lg animate-pulse" />
    ),
  });

  return LazyComponent;
}

// Resource hints for third-party scripts
export function ResourceHints() {
  return (
    <>
      {/* Preconnect to external domains for faster loading */}
      <link rel="preconnect" href="https://phimimg.com" />
      <link rel="preconnect" href="https://img.ophim.live" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://phimapi.com" />
      <link rel="dns-prefetch" href="https://www.googleapis.com" />
    </>
  );
}
