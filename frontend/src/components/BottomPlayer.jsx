import React, { useState } from 'react';
import { usePlayer } from '../PlayerContext';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music, Download, RotateCcw, RotateCw } from 'lucide-react';

export default function BottomPlayer() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    togglePlay,
    seek,
    skipTime,
    changeVolume,
    handleNext,
    handlePrev,
    downloadTrack
  } = usePlayer();

  const [isDragging, setIsDragging] = useState(false);
  const [dragTime, setDragTime] = useState(0);

  if (!currentTrack) return null;

  const formatTime = (secs) => {
    if (isNaN(secs) || secs < 0) return "0:00";
    const mins = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const effectiveDuration = (duration && !isNaN(duration) && duration > 0) 
    ? duration 
    : (currentTrack.duration || 30);

  const displayTime = isDragging ? dragTime : currentTime;

  const handleSliderStart = () => {
    setIsDragging(true);
    setDragTime(currentTime || 0);
  };

  const handleSliderInput = (e) => {
    setDragTime(parseFloat(e.target.value));
  };

  const handleSliderChange = (e) => {
    const val = parseFloat(e.target.value);
    setIsDragging(false);
    seek(val);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#181818]/95 backdrop-blur-md border-t border-[#282828] px-3 sm:px-6 py-2.5 sm:py-3.5 z-50 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-row items-center justify-between gap-3">
        
        {/* Track Metadata (Left) */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 flex-1 min-w-0 max-w-[55%] sm:max-w-none sm:w-1/4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-[#282828] flex items-center justify-center flex-shrink-0 text-white shadow-md">
            <Music size={18} className="text-[#A78BFA]" />
          </div>
          <div className="truncate min-w-0">
            <h4 className="text-xs sm:text-sm font-bold text-white truncate hover:underline cursor-pointer">
              {currentTrack.title || currentTrack.filename || "Untitled Track"}
            </h4>
            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-[#B3B3B3] truncate">
              {currentTrack.predicted_genre && (
                <span className="px-1.5 py-0.2 rounded bg-[#A78BFA]/20 text-[#A78BFA] font-extrabold uppercase tracking-wider text-[9px] sm:text-[10px]">
                  {currentTrack.predicted_genre}
                </span>
              )}
              <span className="truncate">{currentTrack.filename}</span>
            </div>
          </div>
        </div>

        {/* Center Controls & Scrubber */}
        <div className="flex flex-col items-center flex-shrink-0 sm:flex-1 sm:max-w-xl">
          <div className="flex items-center gap-2 sm:gap-4 mb-0.5 sm:mb-1.5">
            <button
              onClick={handlePrev}
              title="Previous"
              className="text-[#B3B3B3] hover:text-white transition-colors hidden sm:inline p-1"
            >
              <SkipBack size={17} />
            </button>
            <button
              onClick={() => skipTime(-10)}
              title="Rewind 10 seconds"
              className="text-[#B3B3B3] hover:text-[#A78BFA] transition-colors p-1 flex items-center gap-0.5"
            >
              <RotateCcw size={15} />
              <span className="text-[10px] font-mono font-bold hidden md:inline">-10s</span>
            </button>
            <button
              onClick={togglePlay}
              title={isPlaying ? "Pause" : "Play"}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white text-black hover:scale-105 transition-all flex items-center justify-center shadow-md"
            >
              {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="translate-x-0.5" />}
            </button>
            <button
              onClick={() => skipTime(10)}
              title="Forward 10 seconds"
              className="text-[#B3B3B3] hover:text-[#A78BFA] transition-colors p-1 flex items-center gap-0.5"
            >
              <RotateCw size={15} />
              <span className="text-[10px] font-mono font-bold hidden md:inline">+10s</span>
            </button>
            <button
              onClick={handleNext}
              title="Next"
              className="text-[#B3B3B3] hover:text-white transition-colors hidden sm:inline p-1"
            >
              <SkipForward size={17} />
            </button>
          </div>

          {/* Scrubber slider */}
          <div className="w-full hidden sm:flex items-center gap-3 text-xs text-[#B3B3B3] font-mono">
            <span className="w-9 text-right font-semibold text-white">{formatTime(displayTime)}</span>
            <div className="relative flex-1 flex items-center group">
              <input
                type="range"
                min="0"
                max={effectiveDuration}
                step="0.1"
                value={displayTime || 0}
                onMouseDown={handleSliderStart}
                onTouchStart={handleSliderStart}
                onInput={handleSliderInput}
                onChange={handleSliderChange}
                className="w-full h-1.5 bg-[#4D4D4D] group-hover:bg-[#5E5E5E] rounded-lg appearance-none cursor-pointer accent-[#A78BFA] transition-all"
              />
            </div>
            <span className="w-9">{formatTime(effectiveDuration)}</span>
          </div>
        </div>

        {/* Right Controls: Download & Volume */}
        <div className="flex items-center justify-end gap-2.5 sm:gap-3 sm:w-1/4">
          <button
            onClick={() => downloadTrack(currentTrack)}
            title="Download song in MP3 format"
            className="p-2 rounded-full bg-[#282828] hover:bg-[#A78BFA] text-[#CCCCCC] hover:text-black transition-all flex items-center gap-1.5 shadow-md group"
          >
            <Download size={16} className="group-hover:translate-y-0.5 transition-transform" />
            <span className="hidden lg:inline text-[11px] font-bold">Download MP3</span>
          </button>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => changeVolume(volume > 0 ? 0 : 0.8)}
              className="text-[#B3B3B3] hover:text-white transition-colors"
            >
              {volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.02"
              value={volume}
              onChange={(e) => changeVolume(parseFloat(e.target.value))}
              className="w-20 lg:w-24 h-1 bg-[#4D4D4D] rounded-lg appearance-none cursor-pointer accent-[#A78BFA]"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
