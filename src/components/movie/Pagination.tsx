'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, X, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputPage, setInputPage] = useState('');

  // Reset input when modal opens
  useEffect(() => {
    if (isModalOpen) setInputPage('');
  }, [isModalOpen]);

  if (totalPages <= 1) return null;

  const getUrl = (page: number) => {
    if (baseUrl.includes('?')) {
      return `${baseUrl}&page=${page}`;
    }
    return `${baseUrl}?page=${page}`;
  };

  const handleJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(inputPage);
    if (pageNum >= 1 && pageNum <= totalPages) {
      router.push(getUrl(pageNum));
      setIsModalOpen(false);
      setInputPage('');
    }
  };

  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const showPages = 7;
    const halfShow = Math.floor(showPages / 2); // 3

    let startPage = Math.max(1, currentPage - halfShow);
    let endPage = Math.min(totalPages, currentPage + halfShow);

    if (currentPage <= halfShow) {
      endPage = Math.min(totalPages, showPages);
    } else if (currentPage >= totalPages - halfShow) {
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

  return (
    <>
      {/* ================= MOBILE & TABLET UI (< lg) ================= */}
      <div className="lg:hidden w-full px-4 mt-8 pb-8">
        <div className="flex items-center justify-between bg-white/[0.03] backdrop-blur-xl border border-white/10 p-2 rounded-2xl shadow-xl max-w-md mx-auto">
          {/* Prev Button */}
          <Link
            href={currentPage > 1 ? getUrl(currentPage - 1) : '#'}
            prefetch={currentPage > 1}
            scroll={true}
            className={cn(
              'w-12 h-12 flex items-center justify-center rounded-xl transition-all active:scale-95',
              currentPage > 1
                ? 'bg-white/5 text-white hover:bg-violet-600'
                : 'opacity-30 cursor-not-allowed pointer-events-none'
            )}
          >
            <ChevronLeft className="w-6 h-6" />
          </Link>

          {/* Current Page Indicator (Trigger Modal) */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex-1 mx-2 h-12 flex flex-col items-center justify-center bg-transparent rounded-xl active:bg-white/5 transition-colors group"
          >
            <span className="text-xs text-white/40 font-medium uppercase tracking-widest leading-none mb-1">Trang</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-white group-hover:text-violet-400 transition-colors">{currentPage}</span>
              <span className="text-sm text-white/30">/ {totalPages}</span>
            </div>
          </button>

          {/* Next Button */}
          <Link
            href={currentPage < totalPages ? getUrl(currentPage + 1) : '#'}
            prefetch={currentPage < totalPages}
            scroll={true}
            className={cn(
              'w-12 h-12 flex items-center justify-center rounded-xl transition-all active:scale-95',
              currentPage < totalPages
                ? 'bg-white/5 text-white hover:bg-violet-600'
                : 'opacity-30 cursor-not-allowed pointer-events-none'
            )}
          >
            <ChevronRight className="w-6 h-6" />
          </Link>
        </div>
      </div>

      {/* Slide-in / Popup Modal for Mobile Jump */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="bg-[#12121a] border border-white/10 w-full max-w-xs p-6 rounded-3xl shadow-2xl relative z-10 animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-white/40 hover:text-white bg-white/5 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-1">Chuyển trang</h3>
              <p className="text-sm text-white/40">Nhập số trang bạn muốn đến</p>
            </div>

            <form onSubmit={handleJumpSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={inputPage}
                  onChange={(e) => setInputPage(e.target.value)}
                  placeholder={`1 - ${totalPages}`}
                  className="w-full h-14 bg-white/5 border border-white/10 focus:border-violet-500 rounded-2xl text-center text-2xl font-bold text-white focus:outline-none focus:ring-4 focus:ring-violet-500/20 transition-all placeholder:text-white/10 no-spinner"
                  autoFocus
                  min={1}
                  max={totalPages}
                />
              </div>
              <button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-violet-600/30 active:scale-95 transition-all text-base flex items-center justify-center gap-2"
              >
                Đi tới trang
                <ChevronRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      )}


      {/* ================= DESKTOP UI (>= lg) ================= */}
      <div className="hidden lg:flex items-center justify-center gap-2 mt-10 pb-10">
        <Link
          href={currentPage > 1 ? getUrl(currentPage - 1) : '#'}
          prefetch={currentPage > 1}
          scroll={true}
          className={cn(
            'w-10 h-10 flex items-center justify-center rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-violet-600 hover:border-violet-500 hover:text-white transition-all',
            currentPage <= 1 && 'opacity-50 cursor-not-allowed pointer-events-none'
          )}
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>

        <div className="flex items-center gap-2 px-2">
          {getPageNumbers().map((page, index) =>
            page === 'ellipsis' ? (
              <span key={`ellipsis-${index}`} className="w-10 text-center text-white/20 select-none">...</span>
            ) : (
              <Link
                key={page}
                href={getUrl(page as number)}
                prefetch={true}
                scroll={true}
                className={cn(
                  'w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all relative overflow-hidden',
                  page === currentPage
                    ? 'bg-gradient-to-tr from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-600/40 scale-110 z-10 pointer-events-none'
                    : 'bg-white/[0.03] text-white/60 hover:text-white hover:bg-white/[0.1]'
                )}
              >
                {page}
              </Link>
            )
          )}
        </div>

        <Link
          href={currentPage < totalPages ? getUrl(currentPage + 1) : '#'}
          prefetch={currentPage < totalPages}
          scroll={true}
          className={cn(
            'w-10 h-10 flex items-center justify-center rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-violet-600 hover:border-violet-500 hover:text-white transition-all',
            currentPage >= totalPages && 'opacity-50 cursor-not-allowed pointer-events-none'
          )}
        >
          <ChevronRight className="w-5 h-5" />
        </Link>

        {/* Quick Jump Desktop - Compact */}
        <div className="ml-4 flex items-center">
          <form onSubmit={handleJumpSubmit} className="relative group flex items-center bg-white/[0.03] border border-white/10 rounded-xl focus-within:border-violet-500/50 focus-within:bg-white/[0.05] transition-all overflow-hidden hover:border-white/20">
            <input
              type="number"
              min={1}
              max={totalPages}
              placeholder={`Trang...`}
              value={inputPage}
              onChange={(e) => setInputPage(e.target.value)}
              className="w-20 h-10 bg-transparent border-none px-3 text-sm font-medium text-white focus:ring-0 focus:outline-none placeholder:text-white/30 no-spinner"
            />
            <button
              type="submit"
              disabled={!inputPage}
              className="h-10 px-3 hover:bg-violet-600/20 text-white/50 hover:text-violet-400 transition-colors border-l border-white/5 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white/50"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
