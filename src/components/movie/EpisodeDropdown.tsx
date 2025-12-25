'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, Server, Check } from 'lucide-react';
import type { Episode, EpisodeData } from '@/types';

interface EpisodeDropdownProps {
  episodes: Episode[];
  currentSlug?: string;
  movieSlug: string;
  onEpisodeSelect?: (episode: EpisodeData) => void;
}

export function EpisodeDropdown({ episodes, currentSlug, movieSlug, onEpisodeSelect }: EpisodeDropdownProps) {
  const [activeServer, setActiveServer] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentServer = episodes[activeServer];
  const allEpisodes = currentServer?.server_data || [];
  const currentEpisode = allEpisodes.find(ep => ep.slug === currentSlug);
  const currentIndex = allEpisodes.findIndex(ep => ep.slug === currentSlug);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!episodes || episodes.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {/* Server Selection - Horizontal Buttons */}
      {episodes.length > 1 && (
        <div className="flex items-center gap-2 flex-wrap">
          <Server className="w-4 h-4 text-white/50 flex-shrink-0" />
          <div className="flex flex-wrap gap-2">
            {episodes.map((server, index) => (
              <button
                key={server.server_name}
                onClick={() => setActiveServer(index)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
                  activeServer === index
                    ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/30"
                    : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10"
                )}
              >
                {server.server_name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Episode Dropdown */}
      <div ref={dropdownRef} className="relative z-10">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-full p-2.5 md:p-3 bg-white/[0.05] border border-white/[0.1] rounded-xl flex items-center justify-between gap-2 transition-all",
            isOpen && "border-violet-500/50 bg-violet-500/10"
          )}
        >
          <div className="flex items-center gap-2 md:gap-3">
            <span className="px-1.5 md:px-2 py-0.5 md:py-1 bg-violet-500/20 text-violet-300 rounded-lg text-[10px] md:text-xs font-bold">
              {currentIndex + 1}/{allEpisodes.length}
            </span>
            <span className="text-white font-medium text-sm md:text-base">
              {currentEpisode?.name || 'Chọn tập phim'}
            </span>
          </div>
          <ChevronDown className={cn(
            "w-4 h-4 md:w-5 md:h-5 text-white/50 transition-transform duration-200",
            isOpen && "rotate-180"
          )} />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-[100] w-full mt-2 py-2 bg-[#0a0a1a] border border-white/[0.1] rounded-xl shadow-2xl shadow-black/80 max-h-[300px] overflow-y-auto custom-scrollbar">
            {allEpisodes.map((ep, index) => {
              const isActive = ep.slug === currentSlug;
              return (
                <a
                  key={ep.slug}
                  href={`/xem-phim/${movieSlug}/${ep.slug}`}
                  onClick={(e) => {
                    if (onEpisodeSelect) {
                      e.preventDefault();
                      onEpisodeSelect(ep);
                      setIsOpen(false);
                    }
                  }}
                  className={cn(
                    "flex items-center justify-between px-4 py-2.5 transition-colors",
                    isActive
                      ? "bg-violet-500/20 text-violet-300"
                      : "text-white/70 hover:bg-white/[0.05] hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 flex items-center justify-center bg-white/[0.05] rounded-lg text-xs font-bold">
                      {index + 1}
                    </span>
                    <span className="font-medium">{ep.name}</span>
                  </div>
                  {isActive && <Check className="w-4 h-4 text-violet-400" />}
                </a>
              );
            })}
          </div>
        )}
      </div>

      {/* Episode Navigation Info */}
      <div className="flex items-center justify-between text-[10px] md:text-xs text-white/50">
        <span>Tổng: {allEpisodes.length} tập</span>
        {currentIndex < allEpisodes.length - 1 && (
          <span>Tập tiếp: {allEpisodes[currentIndex + 1]?.name}</span>
        )}
      </div>
    </div>
  );
}

// Get next episode helper
export function getNextEpisode(episodes: Episode[], currentSlug: string): EpisodeData | null {
  for (const server of episodes) {
    const currentIndex = server.server_data.findIndex(ep => ep.slug === currentSlug);
    if (currentIndex !== -1 && currentIndex < server.server_data.length - 1) {
      return server.server_data[currentIndex + 1];
    }
  }
  return null;
}

// Get previous episode helper
export function getPreviousEpisode(episodes: Episode[], currentSlug: string): EpisodeData | null {
  for (const server of episodes) {
    const currentIndex = server.server_data.findIndex(ep => ep.slug === currentSlug);
    if (currentIndex > 0) {
      return server.server_data[currentIndex - 1];
    }
  }
  return null;
}
