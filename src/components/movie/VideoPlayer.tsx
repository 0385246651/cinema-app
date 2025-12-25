'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Hls from 'hls.js';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  SkipBack,
  SkipForward,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { saveWatchProgress, getWatchProgress, incrementViewCount } from '@/services/movieService';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  movieSlug?: string;
  movieName?: string;
  moviePoster?: string;
  episodeSlug?: string;
  episodeName?: string;
  serverIndex?: number;
  onPrev?: () => void;
  onNext?: () => void;
  onEnded?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

export function VideoPlayer({
  src,
  poster,
  title,
  movieSlug,
  movieName,
  moviePoster,
  episodeSlug,
  episodeName,
  serverIndex = 0,
  onPrev,
  onNext,
  onEnded,
  hasPrev,
  hasNext,
}: VideoPlayerProps) {
  const { user } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const saveProgressRef = useRef<NodeJS.Timeout | null>(null);
  const hasCountedViewRef = useRef(false);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [resumeTime, setResumeTime] = useState<number | null>(null);

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load saved progress when component mounts
  useEffect(() => {
    const loadSavedProgress = async () => {
      if (!user || !movieSlug) return;

      const savedProgress = await getWatchProgress(user.uid, movieSlug, episodeSlug);
      if (savedProgress && savedProgress.currentTime > 10 && savedProgress.progress < 95) {
        setResumeTime(savedProgress.currentTime);
      }
    };

    loadSavedProgress();
    hasCountedViewRef.current = false;
  }, [user, movieSlug, episodeSlug]);

  // Save progress function
  const saveProgress = useCallback(async () => {
    const video = videoRef.current;
    if (!user || !movieSlug || !video || !duration) return;

    await saveWatchProgress(user.uid, {
      movieSlug,
      movieName: movieName || title || 'Unknown',
      moviePoster: moviePoster || poster || '',
      episodeSlug,
      episodeName,
      currentTime: video.currentTime,
      duration,
      progress: (video.currentTime / duration) * 100,
      completed: (video.currentTime / duration) * 100 >= 90,
      serverIndex,
    });
  }, [user, movieSlug, movieName, moviePoster, episodeSlug, episodeName, duration, title, poster, serverIndex]);

  // Auto-save progress every 10 seconds while playing
  useEffect(() => {
    if (isPlaying && user && movieSlug) {
      saveProgressRef.current = setInterval(saveProgress, 10000);
    }

    return () => {
      if (saveProgressRef.current) {
        clearInterval(saveProgressRef.current);
      }
    };
  }, [isPlaying, user, movieSlug, saveProgress]);

  // Save progress on pause/close
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveProgress();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      saveProgress(); // Save when component unmounts
    };
  }, [saveProgress]);

  // Count view after 30 seconds of watching
  useEffect(() => {
    if (!isPlaying || hasCountedViewRef.current || !movieSlug) return;

    const timer = setTimeout(() => {
      if (!hasCountedViewRef.current) {
        incrementViewCount(movieSlug);
        hasCountedViewRef.current = true;
      }
    }, 30000);

    return () => clearTimeout(timer);
  }, [isPlaying, movieSlug]);

  // Initialize HLS
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    // Only set loading if not already loading to avoid cascading updates
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    setError(null);

    // Cleanup previous instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
    }

    if (src.includes('.m3u8')) {
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
        });

        hls.loadSource(src);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setIsLoading(false);
        });

        hls.on(Hls.Events.ERROR, (_, data) => {
          if (data.fatal) {
            setError('Không thể tải video. Vui lòng thử lại sau.');
            setIsLoading(false);
          }
        });

        hlsRef.current = hls;
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Safari native HLS support
        video.src = src;
        video.addEventListener('loadedmetadata', () => setIsLoading(false));
      }
    } else {
      // Regular video
      video.src = src;
      video.addEventListener('loadedmetadata', () => setIsLoading(false));
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [src]);

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      // Fix NaN error: only set progress if duration is valid
      if (video.duration && !isNaN(video.duration) && video.duration > 0) {
        setProgress((video.currentTime / video.duration) * 100);
      }
    };

    const handleDurationChange = () => {
      if (video.duration && !isNaN(video.duration)) {
        setDuration(video.duration);
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleWaiting = () => {
      setIsLoading(true);
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      // Fallback: if waiting takes too long, drop spinner to avoid feeling frozen.
      loadingTimeoutRef.current = setTimeout(() => setIsLoading(false), 8000);
    };
    const handleCanPlay = () => setIsLoading(false);
    const handleLoadedData = () => setIsLoading(false);
    const handlePlaying = () => setIsLoading(false);
    const handleEnded = () => {
      if (onEnded) {
        onEnded();
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('ended', handleEnded);
    };
  }, [onEnded]);

  // Auto-hide controls
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  // Player controls
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = parseFloat(e.target.value);
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = (parseFloat(e.target.value) / 100) * duration;
    video.currentTime = newTime;
    setProgress(parseFloat(e.target.value));
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const skip = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = Math.max(0, Math.min(video.currentTime + seconds, duration));
  };

  // Format time
  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return '0:00';

    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (error) {
    return (
      <div className="relative aspect-video bg-black/50 rounded-2xl flex items-center justify-center">
        <div className="text-center p-4">
          <p className="text-white/70 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative aspect-video bg-black rounded-2xl overflow-hidden group"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Video */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        poster={poster}
        playsInline
        onClick={togglePlay}
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-black/80 via-black/60 to-black/80 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3 px-4 py-3 rounded-full bg-white/5 border border-white/10 shadow-xl max-w-[90%]">
            <Loader2 className="w-6 h-6 md:w-10 md:h-10 animate-spin text-violet-400" />
            <div className="leading-tight text-center md:text-left">
              <p className="text-white font-medium text-xs md:text-sm">Đang tải video...</p>
              <p className="text-white/60 text-[10px] md:text-xs hidden sm:block">Nếu lâu bất thường, thử đổi server hoặc tải lại trang.</p>
            </div>
          </div>
        </div>
      )}

      {/* Resume Dialog */}
      {resumeTime !== null && !isPlaying && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-20">
          <div className="glass-card p-6 rounded-2xl text-center max-w-sm mx-4">
            <p className="text-white/90 mb-4">
              Bạn đã xem đến <span className="text-violet-400 font-semibold">{formatTime(resumeTime)}</span>
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  setResumeTime(null);
                  videoRef.current?.play();
                }}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm"
              >
                Xem từ đầu
              </button>
              <button
                onClick={() => {
                  if (videoRef.current && resumeTime) {
                    videoRef.current.currentTime = resumeTime;
                    videoRef.current.play();
                  }
                  setResumeTime(null);
                }}
                className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 transition-colors text-sm font-medium"
              >
                Tiếp tục xem
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Play Button Overlay */}
      {!isPlaying && !isLoading && resumeTime === null && (
        <div
          className="absolute inset-0 flex items-center justify-center cursor-pointer"
          onClick={togglePlay}
        >
          <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-violet-600/80 backdrop-blur-sm flex items-center justify-center hover:bg-violet-600 transition-colors shadow-lg shadow-violet-500/30">
            <Play className="w-6 h-6 md:w-8 md:h-8 text-white fill-white ml-0.5 md:ml-1" />
          </div>
        </div>
      )}

      {/* Controls */}
      <div
        className={cn(
          'absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-12 md:pt-20 pb-2 md:pb-4 px-2 md:px-4 transition-opacity duration-300',
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
      >
        {/* Progress Bar */}
        <div className="mb-2 md:mb-4">
          <input
            type="range"
            min="0"
            max="100"
            value={isNaN(progress) ? 0 : progress}
            onChange={handleSeek}
            className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-violet-500 [&::-webkit-slider-thumb]:shadow-lg"
            style={{
              background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${isNaN(progress) ? 0 : progress}%, rgba(255,255,255,0.2) ${isNaN(progress) ? 0 : progress}%, rgba(255,255,255,0.2) 100%)`,
            }}
          />
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 md:gap-4">
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="p-1.5 md:p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 md:w-6 md:h-6" />
              ) : (
                <Play className="w-4 h-4 md:w-6 md:h-6 fill-white" />
              )}
            </button>

            {/* Skip Buttons */}
            <button
              onClick={() => skip(-10)}
              className="p-1.5 md:p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <SkipBack className="w-3.5 h-3.5 md:w-5 md:h-5" />
            </button>
            <button
              onClick={() => skip(10)}
              className="p-1.5 md:p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <SkipForward className="w-3.5 h-3.5 md:w-5 md:h-5" />
            </button>

            {/* Volume */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-20 h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
              />
            </div>

            {/* Time */}
            <span className="text-[10px] md:text-sm text-white/70 ml-1">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Prev/Next Episode */}
            {hasPrev && onPrev && (
              <button
                onClick={onPrev}
                className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-sm transition-colors"
              >
                <SkipBack className="w-4 h-4" />
                Trước
              </button>
            )}
            {hasNext && onNext && (
              <button
                onClick={onNext}
                className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-sm transition-colors"
              >
                Sau
                <SkipForward className="w-4 h-4" />
              </button>
            )}

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              {isFullscreen ? (
                <Minimize className="w-5 h-5" />
              ) : (
                <Maximize className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Title (in fullscreen) */}
      {isFullscreen && title && showControls && (
        <div className="absolute top-0 inset-x-0 p-4 bg-gradient-to-b from-black/80 to-transparent">
          <h3 className="text-lg font-medium">{title}</h3>
        </div>
      )}
    </div>
  );
}

// Embed player fallback
export function EmbedPlayer({ src }: { src: string }) {
  return (
    <div className="relative aspect-video bg-black rounded-2xl overflow-hidden">
      <iframe
        src={src}
        className="absolute inset-0 w-full h-full"
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />
    </div>
  );
}
