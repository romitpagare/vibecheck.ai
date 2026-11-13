import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [queue, setQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(-1);

  const audioRef = useRef(new Audio());

  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = volume;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      if (isPlaying) {
        audio.play().catch(e => console.warn("Autoplay blocked or stream ended:", e));
      }
    };
    const handleEnded = () => {
      handleNext();
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);

  const playTrack = (track, newQueue = null, index = -1) => {
    const audio = audioRef.current;
    
    // Resolve audio URL
    let streamUrl = track.audio_url || track.file_url;
    if (streamUrl && streamUrl.startsWith('/')) {
      streamUrl = `http://localhost:8000${streamUrl}`;
    }

    if (newQueue) {
      setQueue(newQueue);
      setQueueIndex(index !== -1 ? index : 0);
    } else if (queue.length === 0) {
      setQueue([track]);
      setQueueIndex(0);
    }

    setCurrentTrack(track);
    audio.src = streamUrl;
    audio.load();
    audio.play().then(() => {
      setIsPlaying(true);
    }).catch(err => {
      console.warn("Playback error:", err);
      setIsPlaying(false);
    });
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!currentTrack) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(console.warn);
    }
  };

  const seek = (time) => {
    const audio = audioRef.current;
    audio.currentTime = time;
    setCurrentTime(time);
  };

  const changeVolume = (val) => {
    const newVol = Math.max(0, Math.min(1, val));
    setVolume(newVol);
    audioRef.current.volume = newVol;
  };

  const handleNext = () => {
    if (queue.length > 0 && queueIndex < queue.length - 1) {
      const nextIdx = queueIndex + 1;
      setQueueIndex(nextIdx);
      playTrack(queue[nextIdx], queue, nextIdx);
    } else if (queue.length > 0) {
      // Loop to beginning of playlist
      setQueueIndex(0);
      playTrack(queue[0], queue, 0);
    }
  };

  const handlePrev = () => {
    if (audioRef.current.currentTime > 3) {
      seek(0);
      return;
    }
    if (queue.length > 0 && queueIndex > 0) {
      const prevIdx = queueIndex - 1;
      setQueueIndex(prevIdx);
      playTrack(queue[prevIdx], queue, prevIdx);
    } else {
      seek(0);
    }
  };

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        volume,
        playTrack,
        togglePlay,
        seek,
        changeVolume,
        handleNext,
        handlePrev,
        queue,
        queueIndex
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  return useContext(PlayerContext);
}
