import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatYear(year: number | undefined): string {
  return year?.toString() || 'N/A';
}

export function formatEpisode(current: string | undefined, total: string | undefined): string {
  if (!current) return 'N/A';
  if (total && total !== 'Đang cập nhật') {
    return `${current}/${total}`;
  }
  return current;
}

export function getImageUrl(url: string | undefined): string {
  if (!url) return '/placeholder-movie.png';
  if (url.startsWith('http')) return url;
  return `https://phimimg.com/${url}`;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

export function formatViewCount(views: number): string {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M`;
  }
  if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K`;
  }
  return views.toString();
}
