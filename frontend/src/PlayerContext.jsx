import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { resolveAudioUrl, apiUrl } from './config';

const PlayerContext = createContext(null);

const GENRE_SAMPLE_MAP = {
  classical: '/audio/samples/sample_classical_prelude.mp3',
  blues: '/audio/samples/sample_blues_groove.mp3',
  rock: '/audio/samples/sample_rock_rhythm.mp3',
  metal: '/audio/samples/sample_rock_rhythm.mp3',
  hiphop: '/audio/samples/sample_lofi_chill.mp3',
  disco: '/audio/samples/sample_lofi_chill.mp3',
  pop: '/audio/samples/sample_lofi_chill.mp3',
  reggae: '/audio/samples/sample_blues_groove.mp3',
  country: '/audio/samples/sample_blues_groove.mp3',
  jazz: '/audio/samples/sample_blues_groove.mp3',
  punjabi: '/audio/samples/sample_punjabi_beat.mp3',
  haryanvi: '/audio/samples/sample_punjabi_beat.mp3',
  bhojpuri: '/audio/samples/sample_punjabi_beat.mp3',
  bollywood: '/audio/samples/sample_punjabi_beat.mp3',
  ambient: '/audio/samples/sample_ambient_soundscape.mp3',
  lofi: '/audio/samples/sample_lofi_chill.mp3'
};

function getFallbackSample(genre) {
  if (!genre) return '/audio/samples/sample_lofi_chill.mp3';
  const clean = genre.toLowerCase().trim();
  return GENRE_SAMPLE_MAP[clean] || '/audio/samples/sample_lofi_chill.mp3';
}

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
    const handleError = () => {
      console.warn("Audio playback error, attempting fallback...");
      if (currentTrack) {
        const fallback = resolveAudioUrl(getFallbackSample(currentTrack.predicted_genre));
        if (audio.src !== fallback) {
          audio.src = fallback;
          audio.load();
          audio.play().catch(() => setIsPlaying(false));
        } else {
          setIsPlaying(false);
        }
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleError);
    };
  }, [currentTrack]);

  const playTrack = (track, newQueue = null, index = -1) => {
    if (!track) return;
    const audio = audioRef.current;
    
    if (newQueue) {
      setQueue(newQueue);
      setQueueIndex(index !== -1 ? index : 0);
    } else if (queue.length === 0) {
      setQueue([track]);
      setQueueIndex(0);
    }

    setCurrentTrack(track);

    // If real audio stream already attached
    if (track.audio_url || track.file_url) {
      const streamUrl = track.audio_url || track.file_url;
      const resolvedUrl = resolveAudioUrl(streamUrl);
      audio.src = resolvedUrl;
      audio.load();
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.warn("Playback error, falling back:", err);
        const fallbackUrl = resolveAudioUrl(getFallbackSample(track.predicted_genre));
        audio.src = fallbackUrl;
        audio.load();
        audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      });
      return;
    }

    // Reference track (from Genre Explorer or Recommendations without local audio yet):
    // 1. Play immediate genre rhythm so user hears instant audio
    const fallbackUrl = resolveAudioUrl(getFallbackSample(track.predicted_genre));
    audio.src = fallbackUrl;
    audio.load();
    audio.play().then(() => setIsPlaying(true)).catch(() => {});

    // 2. Resolve and download the real full track from backend on-demand
    const title = track.title || "";
    const artist = track.artist || "";
    const genre = track.predicted_genre || "";
    const params = new URLSearchParams({ title, artist, genre });

    fetch(apiUrl(`/api/track/resolve?${params.toString()}`))
      .then(res => res.json())
      .then(data => {
        if (data && data.audio_url) {
          const realUrl = resolveAudioUrl(data.audio_url);
          const upgradedTrack = {
            ...track,
            id: data.id || data.song_id,
            song_id: data.id || data.song_id,
            audio_url: data.audio_url,
            file_url: data.audio_url,
            duration: data.duration || 0
          };
          setCurrentTrack(upgradedTrack);
          const curTime = audio.currentTime;
          audio.src = realUrl;
          audio.load();
          if (curTime > 0) {
            audio.currentTime = curTime;
          }
          audio.play().then(() => setIsPlaying(true)).catch(() => {});
        }
      })
      .catch(err => console.warn("Track resolve error:", err));
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
    if (!audio) return;
    const maxDur = (audio.duration && !isNaN(audio.duration)) ? audio.duration : (duration || 0);
    const targetTime = Math.max(0, maxDur > 0 ? Math.min(maxDur, time) : time);
    try {
      audio.currentTime = targetTime;
      setCurrentTime(targetTime);
    } catch (err) {
      console.warn("Seek error:", err);
    }
  };

  const skipTime = (seconds) => {
    const audio = audioRef.current;
    if (!audio) return;
    const current = (!isNaN(audio.currentTime) && audio.currentTime > 0) ? audio.currentTime : (currentTime || 0);
    seek(current + seconds);
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

  const downloadTrack = (track) => {
    const target = track || currentTrack;
    if (!target) return;
    
    const songId = target.id || target.song_id;
    let downloadUrl = "";
    if (songId && !isNaN(Number(songId)) && Number(songId) > 0) {
      downloadUrl = apiUrl(`/api/download/song/${Number(songId)}`);
    } else if (target.audio_url || target.file_url) {
      const rawUrl = target.audio_url || target.file_url;
      const fname = rawUrl.split('/').pop().split('?')[0];
      const title = target.title || fname;
      downloadUrl = apiUrl(`/api/download/file?filename=${encodeURIComponent(fname)}&title=${encodeURIComponent(title)}`);
    } else if (target.filename) {
      const title = target.title || target.filename;
      downloadUrl = apiUrl(`/api/download/file?filename=${encodeURIComponent(target.filename)}&title=${encodeURIComponent(title)}`);
    } else {
      const fallbackFile = getFallbackSample(target.predicted_genre).split('/').pop();
      downloadUrl = apiUrl(`/api/download/file?filename=${fallbackFile}&title=${encodeURIComponent(target.title || "song")}`);
    }

    const a = document.createElement('a');
    a.href = downloadUrl;
    const safeTitle = (target.title || 'song').replace(/[\\/:*?"<>|]/g, '').trim() || 'track';
    a.setAttribute('download', `${safeTitle}.mp3`);
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      if (document.body.contains(a)) document.body.removeChild(a);
    }, 500);
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
        skipTime,
        changeVolume,
        handleNext,
        handlePrev,
        downloadTrack,
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

