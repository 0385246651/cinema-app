'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  containerClassName?: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none';
  aspectRatio?: string;
  showSkeleton?: boolean;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className = '',
  containerClassName = '',
  priority = false,
  quality = 85,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  objectFit = 'cover',
  aspectRatio,
  showSkeleton = true,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Fallback image
  const fallbackImage = '/no-poster.png';

  const objectFitClass = {
    cover: 'object-cover',
    contain: 'object-contain',
    fill: 'object-fill',
    none: 'object-none',
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        containerClassName
      )}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {/* Skeleton loader */}
      {showSkeleton && isLoading && (
        <div className="absolute inset-0 bg-gradient-to-r from-white/[0.05] via-white/[0.1] to-white/[0.05] animate-shimmer bg-[length:200%_100%]" />
      )}

      {/* Blur background while loading */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" />
      )}

      <Image
        src={hasError ? fallbackImage : src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        quality={quality}
        sizes={sizes}
        className={cn(
          objectFitClass[objectFit],
          'transition-all duration-500',
          isLoading ? 'opacity-0 scale-105' : 'opacity-100 scale-100',
          className
        )}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
        loading={priority ? undefined : 'lazy'}
        placeholder="empty"
      />
    </div>
  );
}

// Progressive Image with blur-up effect
interface ProgressiveImageProps extends OptimizedImageProps {
  lowResSrc?: string;
}

export function ProgressiveImage({
  src,
  lowResSrc,
  alt,
  ...props
}: ProgressiveImageProps) {
  const [isHighResLoaded, setIsHighResLoaded] = useState(false);

  return (
    <div className={cn('relative overflow-hidden', props.containerClassName)}>
      {/* Low-res placeholder */}
      {lowResSrc && !isHighResLoaded && (
        <Image
          src={lowResSrc}
          alt={alt}
          fill
          className="object-cover blur-lg scale-110"
          priority
        />
      )}

      {/* High-res image */}
      <OptimizedImage
        {...props}
        src={src}
        alt={alt}
        showSkeleton={!lowResSrc}
        className={cn(
          props.className,
          'transition-opacity duration-700',
          isHighResLoaded ? 'opacity-100' : 'opacity-0'
        )}
      />

      {/* Invisible high-res loader */}
      <Image
        src={src}
        alt=""
        fill
        className="invisible"
        onLoad={() => setIsHighResLoaded(true)}
      />
    </div>
  );
}

// Avatar Image with fallback
interface AvatarImageProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  fallbackInitial?: string;
}

export function AvatarImage({
  src,
  alt,
  size = 'md',
  className = '',
  fallbackInitial,
}: AvatarImageProps) {
  const [hasError, setHasError] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const initial = fallbackInitial || alt.charAt(0).toUpperCase();

  if (!src || hasError) {
    return (
      <div
        className={cn(
          'rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-white',
          sizeClasses[size],
          className
        )}
      >
        {initial}
      </div>
    );
  }

  return (
    <div className={cn('relative rounded-full overflow-hidden', sizeClasses[size], className)}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        onError={() => setHasError(true)}
      />
    </div>
  );
}
