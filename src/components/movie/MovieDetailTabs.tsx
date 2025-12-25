'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Film, Video, MessageSquare, ChevronDown } from 'lucide-react';
import { EpisodeList } from './EpisodeList';
import { MovieReviewsSection } from './MovieReviewsSection';
import type { Episode } from '@/types';

interface MovieDetailTabsProps {
  content: string;
  episodes: Episode[];
  movieSlug: string;
  movieName: string;
  moviePoster?: string;
}

type TabType = 'content' | 'episodes' | 'reviews';

export function MovieDetailTabs({
  content,
  episodes,
  movieSlug,
  movieName,
  moviePoster,
}: MovieDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('content');
  const [isExpanded, setIsExpanded] = useState(false);

  const tabs = [
    {
      id: 'content' as TabType,
      label: 'Nội dung',
      icon: Film,
    },
    {
      id: 'episodes' as TabType,
      label: 'Tập phim',
      icon: Video,
      count: episodes?.reduce((acc, server) => acc + server.server_data.length, 0) || 0,
      show: episodes && episodes.length > 0,
    },
    {
      id: 'reviews' as TabType,
      label: 'Bình luận',
      icon: MessageSquare,
    },
  ];

  return (
    <div className="space-y-6 pt-6 border-t border-white/10">
      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-white/10 overflow-x-auto pb-1 scrollbar-hide">
        {tabs
          .filter((tab) => tab.show !== false)
          .map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-6 py-3 border-b-2 transition-all whitespace-nowrap',
                activeTab === tab.id
                  ? 'border-violet-500 text-violet-400 font-medium bg-gradient-to-t from-violet-500/10 to-transparent'
                  : 'border-transparent text-white/50 hover:text-white hover:border-white/20'
              )}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span className="ml-1 px-2 py-0.5 bg-white/10 rounded-full text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[300px]">
        {/* Content Tab */}
        <div className={cn('space-y-4', activeTab !== 'content' && 'hidden')}>
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 md:p-8">
            <div
              className={cn(
                "prose prose-invert max-w-none text-white/80 leading-relaxed font-light transition-all duration-500 overflow-hidden relative",
                !isExpanded && "max-h-[300px]"
              )}
            >
              <div dangerouslySetInnerHTML={{ __html: content }} />

              {!isExpanded && (
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050510] to-transparent pointer-events-none" />
              )}
            </div>

            <div className="mt-4 flex justify-center">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-2 text-violet-400 hover:text-violet-300 transition-colors text-sm font-medium"
              >
                {isExpanded ? 'Thu gọn' : 'Xem thêm'}
                <ChevronDown className={cn("w-4 h-4 transition-transform duration-300", isExpanded && "rotate-180")} />
              </button>
            </div>
          </div>
        </div>

        {/* Episodes Tab */}
        {episodes && episodes.length > 0 && (
          <div className={cn('space-y-4', activeTab !== 'episodes' && 'hidden')}>
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 md:p-8">
              <EpisodeList episodes={episodes} movieSlug={movieSlug} />
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        <div className={cn('space-y-4', activeTab !== 'reviews' && 'hidden')}>
          <MovieReviewsSection movieSlug={movieSlug} movieName={movieName} moviePoster={moviePoster} />
        </div>
      </div>
    </div>
  );
}
