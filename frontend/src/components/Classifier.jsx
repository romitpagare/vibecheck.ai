import React, { useState, useEffect, useRef } from 'react';
import { 
  Upload, Video, Play, Pause, Disc3, 
  Plus, Download, Check, AlertCircle, RefreshCw, Sparkles, Music, 
  Layers, Activity, Compass, ArrowRight, Radio, Headphones, CheckCircle2, BookmarkPlus
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { usePlayer } from '../PlayerContext';
import { GENRES_DATA } from '../genresData';
import { getTopTenSongsForGenre } from '../topGenreSongs';
import { apiUrl, resolveAudioUrl } from '../config';

export default function Classifier({ initialUrl = "" }) {
  const { playTrack, currentTrack, isPlaying, downloadTrack } = usePlayer();
  
  const [activeMode, setActiveMode] = useState('youtube'); // 'youtube' | 'upload'
  const [youtubeUrl, setYoutubeUrl] = useState(initialUrl || '');
  const [selectedFile, setSelectedFile] = useState(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState(null);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [predictionResult, setPredictionResult] = useState(null);

  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  const [sampleTracks, setSampleTracks] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (initialUrl) {
      setYoutubeUrl(initialUrl);
      setActiveMode('youtube');
    }

    fetchPlaylists();

    fetch(apiUrl('/api/sample-tracks'))
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setSampleTracks(data);
      })
      .catch(() => {});
  }, [initialUrl]);

  const fetchPlaylists = () => {
    fetch(apiUrl('/api/playlists'))
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPlaylists(data);
          if (data.length > 0 && !selectedPlaylistId) {
            setSelectedPlaylistId(data[0].id.toString());
          }
        }
      })
      .catch(() => {});
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const ext = file.name.split('.').pop().toLowerCase();
    if (ext !== 'mp3' && ext !== 'wav') {
      setErrorMsg("Unsupported file type. Please select an .mp3 or .wav audio file.");
      setSelectedFile(null);
      setAudioPreviewUrl(null);
      return;
    }

    setErrorMsg('');
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setAudioPreviewUrl(objectUrl);
  };

  const handleAnalyze = async () => {
    setErrorMsg('');
    setPredictionResult(null);
    setSaveSuccessMsg('');
    setIsAnalyzing(true);

    if (activeMode === 'youtube') {
      if (!youtubeUrl.trim()) {
        setErrorMsg("Please paste a YouTube video link or direct audio stream URL.");
        setIsAnalyzing(false);
        return;
      }

      try {
        const response = await fetch(apiUrl('/api/classify/url'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: youtubeUrl.trim() }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.detail || `Extraction failed (${response.status})`);
        }

        const data = await response.json();
        setPredictionResult(data);
        fetchPlaylists();
        fetchPlaylists();
        if (data.audio_url) {
          setAudioPreviewUrl(resolveAudioUrl(data.audio_url));
        }
      } catch (err) {
        setErrorMsg(err.message);
      } finally {
        setIsAnalyzing(false);
      }
    } else {
      if (!selectedFile) {
        setErrorMsg("Please choose an MP3 or WAV audio file first.");
        setIsAnalyzing(false);
        return;
      }

      const formData = new FormData();
      formData.append('file', selectedFile);

      try {
        const response = await fetch(apiUrl('/api/classify/upload'), {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.detail || `Server error (${response.status})`);
        }

        const data = await response.json();
        setPredictionResult(data);
        fetchPlaylists();
      } catch (err) {
        setErrorMsg(err.message);
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const handleSaveToPlaylist = async () => {
    if (!predictionResult || !predictionResult.song_id || !selectedPlaylistId) return;

    try {
      const response = await fetch(apiUrl('/api/playlists/add-song'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playlist_id: parseInt(selectedPlaylistId, 10),
          song_id: predictionResult.song_id,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Failed to add song to playlist.");
      }

      setSaveSuccessMsg("Track added to your playlist!");
      setTimeout(() => setSaveSuccessMsg(''), 4000);
      fetchPlaylists();
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const handleExportResult = () => {
    if (!predictionResult) return;
    const exportData = {
      engine: "vibecheck.ai",
      analyzed_song: predictionResult.title,
      filename: predictionResult.filename,
      primary_genre: predictionResult.predicted_genre,
      primary_confidence: `${predictionResult.confidence}%`,
      top_predictions: predictionResult.top_genres,
      all_confidences: predictionResult.all_confidences,
      extracted_acoustic_features: predictionResult.audio_features,
      timestamp: predictionResult.analyzed_at,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vibecheck_${predictionResult.predicted_genre}_${predictionResult.title.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const chartData = predictionResult?.top_genres?.map(item => ({
    name: item.genre.toUpperCase(),
    confidence: item.confidence,
  })) || [];

  const matchedGenreMeta = predictionResult 
    ? GENRES_DATA.find(g => g.id.toLowerCase() === predictionResult.predicted_genre.toLowerCase())
    : null;

  const isCurrentAudioPlaying = currentTrack && (
    (predictionResult && currentTrack.id === predictionResult.song_id) ||
    (audioPreviewUrl && currentTrack.audio_url === audioPreviewUrl)
  ) && isPlaying;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      
      {/* Title */}
      <div className="text-center space-y-2">
        <span className="inline-block px-3 py-1 rounded-full bg-[#A78BFA]/15 text-[#A78BFA] text-xs font-semibold tracking-wider uppercase">
          Neural Audio Scanner
        </span>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">
          What vibe is this song?
        </h1>
        <p className="text-sm text-[#B3B3B3]">
          Paste any link from YouTube, Spotify, Apple Music, etc. or upload an audio file to classify its exact genre and acoustic signature.
        </p>
      </div>

      {/* Main Big Card */}
      <div className="bg-[#181818] rounded-3xl border border-[#282828] p-6 md:p-8 shadow-sm space-y-6">
        
        {/* Toggle Mode: Big Rounded Buttons */}
        <div className="grid grid-cols-2 gap-3 p-1.5 bg-[#121212] rounded-2xl">
          <button
            onClick={() => { setActiveMode('youtube'); setErrorMsg(''); }}
            className={`py-3 px-4 rounded-xl text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeMode === 'youtube'
                ? 'bg-[#282828] text-white shadow-sm'
                : 'text-[#B3B3B3] hover:text-white'
            }`}
          >
            <Video size={18} className="text-[#A78BFA]" />
            <span>YouTube / Spotify / Apple Links</span>
          </button>
          <button
            onClick={() => { setActiveMode('upload'); setErrorMsg(''); }}
            className={`py-3 px-4 rounded-xl text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeMode === 'upload'
                ? 'bg-[#282828] text-white shadow-sm'
                : 'text-[#B3B3B3] hover:text-white'
            }`}
          >
            <Upload size={18} className="text-[#A78BFA]" />
            <span>Upload File</span>
          </button>
        </div>

        {/* Mode 1: Links Input (YouTube, Spotify, Apple, etc.) */}
        {activeMode === 'youtube' && (
          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Paste any YouTube / Spotify / Apple Music link..."
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                className="w-full pl-4 pr-12 py-4 rounded-2xl border border-[#282828] bg-[#121212] text-sm text-white placeholder-[#727272] focus:outline-none focus:ring-2 focus:ring-[#A78BFA]/50"
              />
              <Video className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A78BFA]" size={22} />
            </div>

            {/* Quick preset suggestions */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-[#727272]">Or try demo preset audio:</span>
              <div className="flex flex-wrap gap-2">
                {sampleTracks.map(sample => (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => {
                      setYoutubeUrl(resolveAudioUrl(sample.audio_url));
                      setAudioPreviewUrl(resolveAudioUrl(sample.audio_url));
                    }}
                    className="px-3 py-1.5 rounded-full text-xs font-medium border border-[#282828] bg-[#121212] text-[#B3B3B3] hover:border-[#A78BFA] hover:text-white transition-colors"
                  >
                    🎵 {sample.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mode 2: File Upload */}
        {activeMode === 'upload' && (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 dark:border-[#1E232F] hover:border-pink-500 rounded-3xl p-8 text-center cursor-pointer bg-gray-50 dark:bg-[#0A0C10] transition-colors"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".mp3,.wav,audio/mpeg,audio/wav"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="w-14 h-14 rounded-2xl bg-pink-50 dark:bg-pink-950/30 text-pink-500 mx-auto flex items-center justify-center mb-3">
              <Upload size={24} />
            </div>
            <p className="text-base font-bold text-gray-900 dark:text-white">
              {selectedFile ? selectedFile.name : "Tap to upload MP3 or WAV"}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {selectedFile 
                ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready`
                : "Supports high-quality MP3 & WAV audio files up to 50MB"}
            </p>
          </div>
        )}

        {/* Error message */}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 text-xs flex items-start gap-2.5">
            <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
            <div className="leading-relaxed">{errorMsg}</div>
          </div>
        )}

        {/* Audio Preview Box */}
        {audioPreviewUrl && (
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#0A0C10] border border-gray-200 dark:border-[#1E232F] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  playTrack({
                    title: selectedFile ? selectedFile.name : (youtubeUrl.split('/').pop() || "Audio Track"),
                    filename: selectedFile ? selectedFile.name : youtubeUrl,
                    audio_url: audioPreviewUrl,
                  });
                }}
                className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 text-white flex items-center justify-center shadow-md hover:scale-105 transition-transform"
              >
                {isCurrentAudioPlaying ? <Pause size={18} /> : <Play size={18} className="translate-x-0.5" />}
              </button>
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">
                  {selectedFile ? selectedFile.name : (youtubeUrl || "Extracted Audio Track")}
                </p>
                <p className="text-xs text-gray-400">
                  Listen to track before or after genre analysis
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
              Stream Ready
            </span>
          </div>
        )}

        {/* Big Action Button */}
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing || (activeMode === 'youtube' && !youtubeUrl.trim()) || (activeMode === 'upload' && !selectedFile)}
          className={`w-full py-4 rounded-2xl font-extrabold text-base flex items-center justify-center gap-2.5 transition-all shadow-md ${
            isAnalyzing || (activeMode === 'youtube' && !youtubeUrl.trim()) || (activeMode === 'upload' && !selectedFile)
              ? 'bg-gray-200 dark:bg-[#1E232F] text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white hover:opacity-95 hover:scale-[1.01]'
          }`}
        >
          {isAnalyzing ? (
            <>
              <RefreshCw size={20} className="animate-spin" />
              <span>Analyzing YouTube Audio & Spectral Waves...</span>
            </>
          ) : (
            <>
              <Sparkles size={20} />
              <span>Analyze Song Genre</span>
            </>
          )}
        </button>

      </div>

      {/* Prediction Output Card: Simple, Clean & Aesthetic */}
      {predictionResult && (
        <div className="bg-[#181818] rounded-2xl border border-[#282828] p-6 shadow-xl space-y-6 text-white font-sans animate-fadeIn">
          
          {/* Top row: Track info & Action buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#282828]">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#A78BFA]">
                Predicted Musical Vibe
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white capitalize leading-tight">
                {predictionResult.title}
              </h2>
              <div className="flex items-center gap-2 pt-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
                  <CheckCircle2 size={12} />
                  <span>Saved to All Analyzed Tracks</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#A78BFA]/15 border border-[#A78BFA]/30 text-[#A78BFA] text-[11px] font-bold">
                  <Music size={12} />
                  <span>Added to {predictionResult.predicted_genre?.toUpperCase()} Mix</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => playTrack(predictionResult)}
                className="px-4 py-2 rounded-full bg-[#A78BFA] text-black text-xs font-black hover:bg-[#C4B5FD] transition-transform hover:scale-105 flex items-center gap-1.5 shadow-md"
              >
                <Play size={14} className="fill-black translate-x-0.5" />
                <span>Play Song</span>
              </button>
              <button
                onClick={() => downloadTrack(predictionResult)}
                className="px-4 py-2 rounded-full bg-[#242424] hover:bg-[#303030] border border-[#3E3E3E] text-white text-xs font-bold transition-transform hover:scale-105 flex items-center gap-1.5 shadow-md"
                title="Download classified track as MP3"
              >
                <Download size={14} className="text-[#A78BFA]" />
                <span>Download MP3</span>
              </button>
              <button
                onClick={handleExportResult}
                className="px-3.5 py-2 rounded-full border border-[#3E3E3E] bg-[#121212] text-[#B3B3B3] text-xs font-bold hover:text-white hover:border-[#555] transition-colors flex items-center gap-1.5"
                title="Export JSON feature data"
              >
                <Download size={13} />
                <span>JSON</span>
              </button>
            </div>
          </div>

          {/* Primary Genre Callout */}
          <div className="p-6 rounded-2xl bg-[#121212] border border-[#282828] text-center space-y-1.5">
            <span className="text-xs uppercase font-bold tracking-wider text-[#A7A7A7]">
              Primary Genre
            </span>
            <div className="text-4xl sm:text-6xl font-black tracking-tight text-white capitalize">
              {predictionResult.predicted_genre}
            </div>
            <div className="text-xl font-bold text-[#A78BFA]">
              {predictionResult.confidence}% Confidence
            </div>
          </div>

          {/* Top 3 Prediction Breakdown with Descriptions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#A7A7A7]">
                Top 3 Prediction Breakdown & Descriptions
              </span>
              <span className="text-[10px] text-[#727272]">
                Ranked by Confidence
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {predictionResult.top_genres.map((item, idx) => {
                const genreMeta = GENRES_DATA.find(g => g.id.toLowerCase() === item.genre.toLowerCase());
                const isPrimary = idx === 0;

                return (
                  <div 
                    key={idx}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      isPrimary 
                        ? 'bg-[#A78BFA]/10 border-[#A78BFA]/40 text-white' 
                        : 'bg-[#121212] border-[#282828] text-[#B3B3B3]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        isPrimary ? 'bg-[#A78BFA] text-black font-extrabold' : 'bg-[#282828] text-[#A7A7A7]'
                      }`}>
                        #{idx + 1} Genre
                      </span>
                      <span className="text-sm font-bold font-mono text-white">
                        {item.confidence}%
                      </span>
                    </div>

                    <div className="text-base font-extrabold capitalize text-white mt-1">
                      {item.genre}
                    </div>

                    {/* Short easy description for each of the top 3 */}
                    <p className="text-xs text-[#A0A0A0] leading-relaxed mt-1.5 line-clamp-3">
                      {genreMeta?.description || "Acoustic signatures matching trained GTZAN neural manifold."}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Full Distribution: All Other Genres Breakdown */}
          {predictionResult.all_confidences && (
            <div className="p-4 rounded-xl bg-[#121212] border border-[#282828] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#A7A7A7]">
                  All Genre Probabilities (Full Spectrum)
                </span>
                <span className="text-[10px] text-[#727272]">
                  Total 100% Neural Distribution
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                {Object.entries(predictionResult.all_confidences)
                  .sort(([, a], [, b]) => b - a)
                  .map(([genreName, conf]) => {
                    const isTop = predictionResult.top_genres.some(t => t.genre.toLowerCase() === genreName.toLowerCase());
                    return (
                      <div 
                        key={genreName}
                        className={`p-2.5 rounded-lg border text-xs flex flex-col justify-between ${
                          isTop 
                            ? 'bg-[#181818] border-[#A78BFA]/30 text-white' 
                            : 'bg-[#141414] border-[#222222] text-[#888888]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="capitalize font-semibold truncate">{genreName}</span>
                          <span className={`font-mono font-bold ${isTop ? 'text-[#A78BFA]' : 'text-[#777777]'}`}>
                            {conf}%
                          </span>
                        </div>
                        {/* Mini progress bar */}
                        <div className="w-full bg-[#222222] h-1 rounded-full mt-2 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${isTop ? 'bg-[#A78BFA]' : 'bg-[#555555]'}`}
                            style={{ width: `${Math.min(100, conf * 2.5)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Acoustic Feature Stats */}
          {predictionResult.audio_features && (
            <div className="p-4 rounded-xl bg-[#121212] border border-[#282828] grid grid-cols-3 gap-4 text-center">
              <div>
                <span className="text-[11px] text-[#A7A7A7] font-medium">BPM Tempo</span>
                <p className="text-sm sm:text-base font-bold text-white mt-0.5">
                  {predictionResult.audio_features.tempo} BPM
                </p>
              </div>
              <div>
                <span className="text-[11px] text-[#A7A7A7] font-medium">Spectral Centroid</span>
                <p className="text-sm sm:text-base font-bold text-white mt-0.5">
                  {Math.round(predictionResult.audio_features.spectral_centroid_mean)} Hz
                </p>
              </div>
              <div>
                <span className="text-[11px] text-[#A7A7A7] font-medium">Zero Crossing</span>
                <p className="text-sm sm:text-base font-bold text-white mt-0.5">
                  {(predictionResult.audio_features.zero_crossing_rate_mean * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          )}

          {/* Spotify-Style Vibe Card & Top 10 Recommended Track List (Frequency & Language matched) */}
          {matchedGenreMeta && (() => {
            const recommendationData = getTopTenSongsForGenre(
              predictionResult.predicted_genre,
              predictionResult.title || '',
              predictionResult.artist || ''
            );
            const recommendedTracks = recommendationData.songs;
            const isIndianSuggest = recommendationData.isIndian;

            return (
              <div className="rounded-2xl bg-[#181818] border border-[#282828] overflow-hidden shadow-lg">
                
                {/* Spotify Hero Banner for the Genre */}
                <div className="p-5 bg-gradient-to-r from-[#241e33] to-[#181818] border-b border-[#282828] flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-purple-800 via-indigo-600 to-[#A78BFA] flex-shrink-0 flex items-center justify-center shadow-md">
                    <Music size={26} className="text-white" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#A78BFA]">
                        Spotify Vibe Guide
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-[#CCCCCC] font-semibold">
                        {matchedGenreMeta.category}
                      </span>
                      {isIndianSuggest && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#A78BFA]/20 text-[#C4B5FD] font-bold border border-[#A78BFA]/30">
                          Desi / Hindi Sound
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-black text-white">
                      What is {matchedGenreMeta.name}?
                    </h3>
                    <p className="text-xs text-[#B3B3B3] leading-relaxed max-w-xl">
                      {matchedGenreMeta.description}
                    </p>
                  </div>
                </div>

                {/* Top 10 Songs: Spotify Tracklist Style */}
                {recommendedTracks && recommendedTracks.length > 0 && (
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between pb-2 border-b border-[#242424] px-3 text-[11px] font-bold uppercase tracking-wider text-[#727272]">
                      <div className="flex items-center gap-4">
                        <span>#</span>
                        <span>Top 10 {isIndianSuggest ? 'Hindi / Desi' : 'Global'} Reference Tracks</span>
                      </div>
                      <span>Year</span>
                    </div>

                    <div className="space-y-1">
                      {recommendedTracks.map((track, i) => {
                        const recTrackObj = {
                          title: track.title,
                          filename: `${track.artist} - ${track.title}`,
                          predicted_genre: matchedGenreMeta.id || matchedGenreMeta.name,
                          audio_url: audioPreviewUrl || ""
                        };
                        const isCurrentRec = currentTrack && currentTrack.title === track.title;
                        const isPlayingRec = isCurrentRec && isPlaying;

                        return (
                          <div 
                            key={i} 
                            className={`group flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
                              isCurrentRec ? 'bg-[#282828] text-[#A78BFA]' : 'hover:bg-[#242424] text-white'
                            }`}
                            onClick={() => playTrack(recTrackObj)}
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
                              {/* Number / Hover Play Icon */}
                              <div className="w-5 text-center text-xs font-semibold text-[#727272] group-hover:text-white flex-shrink-0">
                                <span className="group-hover:hidden">{isPlayingRec ? '▶' : i + 1}</span>
                                <Play size={14} className="hidden group-hover:inline text-[#A78BFA] fill-[#A78BFA]" />
                              </div>

                              {/* Mini Album Cover placeholder */}
                              <div className="w-10 h-10 rounded-md bg-[#242424] group-hover:bg-[#333333] flex items-center justify-center flex-shrink-0 text-[#A78BFA] font-bold text-xs shadow-inner">
                                <Music size={16} />
                              </div>

                              {/* Track Details */}
                              <div className="min-w-0 truncate">
                                <p className={`text-sm font-bold transition-colors truncate ${isCurrentRec ? 'text-[#A78BFA]' : 'text-white group-hover:text-[#A78BFA]'}`}>
                                  {track.title}
                                </p>
                                <p className="text-xs text-[#A7A7A7] truncate">
                                  {track.artist}
                                </p>
                              </div>
                            </div>

                            {/* Year & Download MP3 Button */}
                            <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                              <span className="text-xs font-medium text-[#727272] font-mono">
                                {track.year}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  downloadTrack(recTrackObj);
                                }}
                                title="Download song in MP3 format"
                                className="p-1 rounded text-[#727272] hover:text-[#A78BFA] opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Download size={15} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>
            );
          })()}

          {/* Save to Playlist */}
          <div className="pt-3 border-t border-[#282828] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <label className="text-xs font-bold text-[#A7A7A7] whitespace-nowrap">
                Add to Playlist:
              </label>
              <select
                value={selectedPlaylistId}
                onChange={(e) => setSelectedPlaylistId(e.target.value)}
                className="px-3 py-2 rounded-full border border-[#3E3E3E] bg-[#121212] text-xs font-semibold text-white focus:outline-none focus:border-[#A78BFA] cursor-pointer"
              >
                {playlists.map(pl => (
                  <option key={pl.id} value={pl.id} className="bg-[#121212] text-white">
                    {pl.name} {pl.is_sample === 1 ? '(Preset)' : ''}
                  </option>
                ))}
              </select>
              <button
                onClick={handleSaveToPlaylist}
                className="px-4 py-2 rounded-full bg-[#A78BFA] text-black text-xs font-bold hover:bg-[#C4B5FD] transition-colors flex items-center gap-1 shadow-sm"
              >
                <Plus size={14} />
                <span>Save</span>
              </button>
            </div>

            {saveSuccessMsg && (
              <span className="text-xs text-[#A78BFA] font-bold flex items-center gap-1 bg-[#A78BFA]/10 border border-[#A78BFA]/30 px-3 py-1.5 rounded-full">
                <Check size={14} />
                {saveSuccessMsg}
              </span>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
