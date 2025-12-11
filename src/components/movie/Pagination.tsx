'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const showPages = 5;
    const halfShow = Math.floor(showPages / 2);

    let startPage = Math.max(1, currentPage - halfShow);
    let endPage = Math.min(totalPages, currentPage + halfShow);

    if (currentPage - halfShow <= 0) {
      endPage = Math.min(totalPages, showPages);
    }
    if (currentPage + halfShow >= totalPages) {
      startPage = Math.max(1, totalPages - showPages + 1);
    }

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) pages.push('ellipsis');
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push('ellipsis');
      pages.push(totalPages);
    }

    return pages;
  };

  const getUrl = (page: number) => {
    if (baseUrl.includes('?')) {
      return `${baseUrl}&page=${page}`;
    }
    return `${baseUrl}?page=${page}`;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {/* Prev */}
      <Link
        href={currentPage > 1 ? getUrl(currentPage - 1) : '#'}
        className={cn(
          'p-2 rounded-lg transition-all',
          currentPage > 1
            ? 'bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] hover:border-white/[0.2]'
            : 'opacity-50 cursor-not-allowed bg-white/[0.02]'
        )}
        aria-disabled={currentPage <= 1}
      >
        <ChevronLeft className="w-5 h-5" />
      </Link>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, index) =>
          page === 'ellipsis' ? (
            <span key={`ellipsis-${index}`} className="px-2 text-white/40">
              ...
            </span>
          ) : (
            <Link
              key={page}
              href={getUrl(page)}
              className={cn(
                'min-w-[40px] h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all',
                page === currentPage
                  ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-600/30'
                  : 'bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] hover:border-white/[0.2] text-white/70 hover:text-white'
              )}
            >
              {page}
            </Link>
          )
        )}
      </div>

      {/* Next */}
      <Link
        href={currentPage < totalPages ? getUrl(currentPage + 1) : '#'}
        className={cn(
          'p-2 rounded-lg transition-all',
          currentPage < totalPages
            ? 'bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] hover:border-white/[0.2]'
            : 'opacity-50 cursor-not-allowed bg-white/[0.02]'
        )}
        aria-disabled={currentPage >= totalPages}
      >
        <ChevronRight className="w-5 h-5" />
      </Link>
    </div>
  );
}
