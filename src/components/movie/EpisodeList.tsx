'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { GlassCard } from '@/components/ui';
import { Play, Server, ChevronDown } from 'lucide-react';
import type { Episode, EpisodeData } from '@/types';

interface EpisodeListProps {
  episodes: Episode[];
  currentSlug?: string;
  movieSlug: string;
}

export function EpisodeList({ episodes, currentSlug, movieSlug }: EpisodeListProps) {
  const [activeServer, setActiveServer] = useState(0);

  if (!episodes || episodes.length === 0) {
    return (
      <GlassCard className="p-6">
        <p className="text-white/50 text-center">Chưa có tập phim nào</p>
      </GlassCard>
    );
  }

  const currentServer = episodes[activeServer];

  return (
    <GlassCard className="p-4 md:p-6" hover={false}>
      {/* Server Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-4 pb-4 border-b border-white/[0.1]">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.05] flex-shrink-0">
          <Server className="w-4 h-4 text-white/50" />
        </div>
        {episodes.map((server, index) => (
          <button
            key={server.server_name}
            onClick={() => setActiveServer(index)}
            className={cn(
              'flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all',
              activeServer === index
                ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white'
                : 'bg-white/[0.05] text-white/70 hover:bg-white/[0.1] hover:text-white'
            )}
          >
            {server.server_name}
          </button>
        ))}
      </div>

      {/* Episode Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
        {currentServer?.server_data.map((ep) => (
          <EpisodeButton
            key={ep.slug}
            episode={ep}
            movieSlug={movieSlug}
            isActive={ep.slug === currentSlug}
          />
        ))}
      </div>
    </GlassCard>
  );
}

interface EpisodeButtonProps {
  episode: EpisodeData;
  movieSlug: string;
  isActive?: boolean;
}

function EpisodeButton({ episode, movieSlug, isActive }: EpisodeButtonProps) {
  return (
    <a
      href={`/xem-phim/${movieSlug}/${episode.slug}`}
      className={cn(
        'flex items-center justify-center py-2 px-3 rounded-lg text-sm font-medium transition-all',
        isActive
          ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-600/30'
          : 'bg-white/[0.05] text-white/70 hover:bg-white/[0.1] hover:text-white border border-white/[0.08] hover:border-white/[0.15]'
      )}
    >
      {episode.name.replace('Tập ', '')}
    </a>
  );
}

// Compact version for watch page sidebar
export function EpisodeListCompact({
  episodes,
  currentSlug,
  movieSlug,
}: EpisodeListProps) {
  const [activeServer, setActiveServer] = useState(0);
  const [expanded, setExpanded] = useState(false);

  if (!episodes || episodes.length === 0) return null;

  const currentServer = episodes[activeServer];
  const displayEpisodes = expanded
    ? currentServer?.server_data
    : currentServer?.server_data.slice(0, 20);

  return (
    <div className="space-y-3">
      {/* Server Select */}
      <select
        value={activeServer}
        onChange={(e) => setActiveServer(Number(e.target.value))}
        className="w-full p-2 bg-white/[0.05] border border-white/[0.1] rounded-lg text-sm text-white/90 focus:outline-none focus:border-violet-500/50"
      >
        {episodes.map((server, index) => (
          <option key={server.server_name} value={index} className="bg-[#0a0a1a]">
            {server.server_name}
          </option>
        ))}
      </select>

      {/* Episode Grid */}
      <div className="grid grid-cols-5 gap-1.5">
        {displayEpisodes?.map((ep) => (
          <a
            key={ep.slug}
            href={`/xem-phim/${movieSlug}/${ep.slug}`}
            className={cn(
              'py-1.5 text-center text-xs font-medium rounded transition-all',
              ep.slug === currentSlug
                ? 'bg-violet-600 text-white'
                : 'bg-white/[0.05] text-white/60 hover:bg-white/[0.1] hover:text-white'
            )}
          >
            {ep.name.replace('Tập ', '')}
          </a>
        ))}
      </div>

      {/* Show More */}
      {currentServer?.server_data.length > 20 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full py-2 text-xs text-white/50 hover:text-white flex items-center justify-center gap-1 transition-colors"
        >
          {expanded ? 'Thu gọn' : `Xem thêm (${currentServer.server_data.length - 20} tập)`}
          <ChevronDown className={cn('w-3 h-3 transition-transform', expanded && 'rotate-180')} />
        </button>
      )}
    </div>
  );
}
