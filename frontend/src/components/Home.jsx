import React, { useState, useEffect } from 'react';
import { 
  Upload, Video, Disc3, ListMusic, Compass, ArrowRight, 
  Play, Pause, Radio, Sparkles, Flame, Plus, ChevronRight, Music, Disc, Download, Heart
} from 'lucide-react';
import { usePlayer } from '../PlayerContext';
import { GENRES_DATA } from '../genresData';
import { GENRE_IMAGES, PLAYLIST_COVERS } from '../genreImages';
import { apiUrl, resolveAudioUrl } from '../config';

const ALBUM_COVERS = PLAYLIST_COVERS;

export default function Home({ setActiveTab, onPreloadUrl }) {
  const { playTrack, currentTrack, isPlaying, downloadTrack } = usePlayer();
  const [recentTracks, setRecentTracks] = useState([]);
  const [samplePlaylists, setSamplePlaylists] = useState([]);
  const [urlInput, setUrlInput] = useState('');
  const [selectedGenreTab, setSelectedGenreTab] = useState('All');

  useEffect(() => {
    fetch(apiUrl('/api/history?limit=6'))
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setRecentTracks(data);
      })
      .catch(() => {});

    fetch(apiUrl('/api/playlists'))
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setSamplePlaylists(data);
      })
      .catch(() => {});
  }, []);

  const handlePlayPlaylistCard = (e, playlistId) => {
    e.stopPropagation();
    fetch(apiUrl(`/api/playlists/${playlistId}/songs`))
      .then(res => res.json())
      .then(data => {
        if (data.songs && data.songs.length > 0) {
          playTrack(data.songs[0], data.songs, 0);
        } else {
          setActiveTab('playlists');
        }
      })
      .catch(() => setActiveTab('playlists'));
  };

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    onPreloadUrl(urlInput.trim());
    setActiveTab('classifier');
  };

  const cleanTrackTitle = (title) => {
    if (!title) return "Untitled Track";
    let cleaned = title.split('|')[0].trim();
    if (cleaned.length > 36) {
      cleaned = cleaned.substring(0, 36) + '...';
    }
    return cleaned;
  };

  const filteredGenres = GENRES_DATA.filter(g => {
    if (selectedGenreTab === 'All') return true;
    if (selectedGenreTab === 'Indian Music') return ["punjabi", "haryanvi", "bhojpuri", "bollywood", "indian_classical", "sufi_qawwali"].includes(g.id);
    if (selectedGenreTab === 'Core 10') return ["blues", "classical", "country", "disco", "hiphop", "jazz", "metal", "pop", "reggae", "rock"].includes(g.id);
    return !["blues", "classical", "country", "disco", "hiphop", "jazz", "metal", "pop", "reggae", "rock", "punjabi", "haryanvi", "bhojpuri", "bollywood", "indian_classical", "sufi_qawwali"].includes(g.id);
  });

  return (
    <div className="space-y-12 max-w-6xl mx-auto font-sans">
      
      {/* Spotify Hero Banner */}
      <section className="pt-2 pb-8 border-b border-[#282828]">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#A78BFA]/15 border border-[#A78BFA]/30 text-[#A78BFA] text-xs font-bold uppercase tracking-wider mb-3">
            <Radio size={14} className="animate-pulse" />
            <span>AI Music Intelligence</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-3">
            Vibe check your sound.
          </h1>
          <p className="text-sm md:text-base text-[#B3B3B3] leading-relaxed mb-6">
            Paste any link from Spotify, YouTube, or upload an audio file. vibecheck.ai extracts acoustic waveform dimensions via Librosa and classifies the exact genre with real machine learning models.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('classifier')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#A78BFA] hover:bg-[#C4B5FD] text-black font-extrabold text-sm transition-transform hover:scale-105 shadow-[0_0_20px_rgba(167,139,250,0.35)]"
            >
              <Upload size={18} />
              <span>Analyze Track</span>
            </button>
            <button
              onClick={() => setActiveTab('playlists')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#404040] hover:border-white bg-[#181818] text-white text-sm font-bold transition-colors"
            >
              <ListMusic size={18} className="text-[#A78BFA]" />
              <span>Browse Playlists</span>
            </button>
          </div>
        </div>

        {/* Quick URL Input Bar */}
        <div className="mt-8 pt-6 border-t border-[#202020] max-w-2xl">
          <form onSubmit={handleUrlSubmit} className="flex flex-col sm:flex-row items-stretch gap-2.5">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Paste any link from Spotify, YouTube, or audio URL..."
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="w-full px-4 py-3 rounded-full border border-[#333333] bg-[#181818] text-sm text-white placeholder-[#727272] focus:outline-none focus:border-[#A78BFA]"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-full bg-white text-black text-sm font-extrabold hover:bg-[#E5E5E5] transition-all flex items-center justify-center gap-2"
            >
              <span>Scan Vibe</span>
              <ArrowRight size={15} />
            </button>
          </form>
        </div>
      </section>

      {/* Featured Playlists Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Your Genre Mixes & Playlists
            </h2>
            <p className="text-xs text-[#B3B3B3] mt-0.5">
              Automatically separated into distinct genre mixes based on your audio analysis
            </p>
          </div>
          <button 
            onClick={() => setActiveTab('playlists')}
            className="text-xs font-bold text-[#B3B3B3] hover:text-white flex items-center gap-1 group transition-colors"
          >
            <span>Show all</span>
            <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {samplePlaylists.length === 0 ? (
          <div className="p-8 border border-dashed border-[#282828] rounded-2xl bg-[#181818] text-center space-y-2">
            <Music className="mx-auto text-[#727272]" size={36} />
            <p className="text-sm font-bold text-white">No playlists generated yet</p>
            <p className="text-xs text-[#B3B3B3] max-w-sm mx-auto">
              Analyze a song from YouTube or upload a file in the Classifier to auto-generate your genre playlists.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {samplePlaylists.map((pl, idx) => {
              const isMaster = pl.name === 'All Analyzed Tracks';
              const isGenreMix = pl.name.endsWith(' Mix');
              const playlistImg = PLAYLIST_COVERS[idx % PLAYLIST_COVERS.length];

              return (
                <div 
                  key={pl.id}
                  onClick={() => setActiveTab('playlists')}
                  className="p-4 bg-[#181818] hover:bg-[#222222] rounded-2xl cursor-pointer transition-all duration-300 group relative flex flex-col justify-between shadow-xl border border-[#262626] hover:border-[#333333] hover:-translate-y-1"
                >
                  <div 
                    className="w-full aspect-square rounded-xl flex items-center justify-center text-white relative shadow-lg overflow-hidden mb-4"
                    style={{ backgroundColor: pl.cover_color || '#282828' }}
                  >
                    {isMaster ? (
                      <div className="w-full h-full bg-gradient-to-br from-[#1DB954] via-[#107032] to-[#121212] flex items-center justify-center text-white">
                        <Heart size={64} fill="white" className="drop-shadow-lg" />
                      </div>
                    ) : isGenreMix ? (
                      <div className="w-full h-full flex flex-col items-center justify-center text-white bg-black/15">
                        <Music size={52} className="drop-shadow-md text-white/90" />
                        <span className="text-[10px] font-mono uppercase tracking-wider font-extrabold mt-2 text-white/80">
                          Genre Mix
                        </span>
                      </div>
                    ) : (
                      <>
                        <img 
                          src={playlistImg} 
                          alt={pl.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                      </>
                    )}

                    {/* Play button that appears cleanly on hover */}
                    <button 
                      onClick={(e) => handlePlayPlaylistCard(e, pl.id)}
                      title="Play Playlist"
                      className="absolute right-3 bottom-3 w-12 h-12 rounded-full bg-[#A78BFA] text-black flex items-center justify-center shadow-2xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:scale-110 z-10"
                    >
                      <Play size={20} fill="currentColor" className="translate-x-0.5" />
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-extrabold text-white truncate group-hover:text-[#A78BFA] transition-colors">
                        {pl.name}
                      </h3>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#A78BFA] bg-[#A78BFA]/10 px-2 py-0.5 rounded-full border border-[#A78BFA]/20 flex-shrink-0">
                        {isMaster ? 'Library' : (isGenreMix ? 'Genre' : 'Playlist')}
                      </span>
                    </div>
                    <p className="text-xs text-[#B3B3B3] line-clamp-2 leading-relaxed">
                      {pl.description || "Collection of classified songs."}
                    </p>
                    <div className="pt-2 flex items-center justify-between text-[11px] font-bold text-[#727272] border-t border-[#242424]">
                      <span>{isGenreMix ? 'Auto Mix' : 'Playlist'}</span>
                      <span>•</span>
                      <span className="text-[#CCCCCC] font-semibold">{pl.song_count || 1} track{pl.song_count === 1 ? '' : 's'}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Spotify Aesthetic Recently Scanned Songs Section */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Recently Analyzed</span>
            </h2>
            <p className="text-xs text-[#B3B3B3] mt-0.5">
              Tracks parsed through Librosa feature extraction & neural genre classifier
            </p>
          </div>
          <button 
            onClick={() => setActiveTab('history')}
            className="text-xs font-bold text-[#B3B3B3] hover:text-white flex items-center gap-1 group transition-colors"
          >
            <span>View all</span>
            <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {recentTracks.length === 0 ? (
          <div className="p-8 border border-dashed border-[#282828] rounded-2xl bg-[#181818] text-center">
            <Disc3 className="mx-auto text-[#727272] mb-2" size={32} />
            <p className="text-sm font-bold text-white">No tracks scanned yet</p>
            <p className="text-xs text-[#B3B3B3] mt-1">
              Upload a song or paste a YouTube URL in the Classifier to start building history.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {recentTracks.map((item, idx) => {
              const isCurrent = currentTrack && currentTrack.id === item.song_id;
              const isPlayingThis = isCurrent && isPlaying;
              const imageUrl = ALBUM_COVERS[idx % ALBUM_COVERS.length];

              return (
                <div 
                  key={item.id}
                  onClick={() => playTrack(item)}
                  className="p-3 bg-[#181818] hover:bg-[#242424] rounded-2xl transition-all duration-200 group cursor-pointer flex flex-col justify-between shadow-lg relative"
                >
                  <div className="w-full aspect-square rounded-xl relative shadow-md overflow-hidden mb-3 bg-[#282828]">
                    <img 
                      src={imageUrl} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-md border border-white/10">
                        {item.predicted_genre}
                      </span>
                      <span className="text-[11px] font-mono font-black text-[#A78BFA] bg-black/60 px-1.5 py-0.5 rounded-full backdrop-blur-md border border-white/10">
                        {Math.round(item.confidence)}%
                      </span>
                    </div>

                    <div className="absolute right-2.5 bottom-2.5 flex items-center gap-1.5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadTrack(item);
                        }}
                        title="Download song in MP3 format"
                        className="w-8 h-8 rounded-full bg-[#181818]/90 text-white hover:text-[#A78BFA] hover:bg-black flex items-center justify-center shadow-lg hover:scale-105 transition-all"
                      >
                        <Download size={14} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          playTrack(item);
                        }}
                        className="w-10 h-10 rounded-full bg-[#A78BFA] text-black flex items-center justify-center shadow-2xl hover:scale-105 transition-all"
                        title={isPlayingThis ? "Pause" : "Play"}
                      >
                        {isPlayingThis ? (
                          <Pause size={16} fill="currentColor" />
                        ) : (
                          <Play size={16} fill="currentColor" className="translate-x-0.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <h4 
                      className={`text-sm font-bold truncate leading-snug ${isPlayingThis ? 'text-[#A78BFA]' : 'text-white group-hover:text-[#A78BFA]'} transition-colors`}
                      title={item.title}
                    >
                      {cleanTrackTitle(item.title)}
                    </h4>
                    <div className="flex items-center justify-between text-xs text-[#727272]">
                      <span className="capitalize">{item.predicted_genre} vibe</span>
                      <span className="text-[10px] font-mono">
                        {new Date(item.analyzed_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Expanded Spotify Search/Genre Matrix Cards */}
      <section className="pt-6 border-t border-[#282828] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Disc size={22} className="text-[#A78BFA]" />
              <span>Explore All Music Genres</span>
            </h2>
            <p className="text-xs text-[#B3B3B3] mt-0.5">
              10 GTZAN neural classes + 10 modern scalable genres (20 Total Sound Manifolds)
            </p>
          </div>

          {/* Genre Category Filters */}
          <div className="flex flex-wrap gap-2">
            {['All', 'Indian Music', 'Core 10', 'Modern Expansions'].map(tab => (
              <button
                key={tab}
                onClick={() => setSelectedGenreTab(tab)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  selectedGenreTab === tab
                    ? 'bg-white text-black shadow-md'
                    : 'bg-[#181818] text-[#B3B3B3] hover:text-white border border-[#282828]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Spotify "Search / Browse All" Colorful Image Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredGenres.map((g) => {
            const genreImg = GENRE_IMAGES[g.id] || GENRE_IMAGES.pop;
            return (
              <div
                key={g.id}
                onClick={() => setActiveTab('explorer')}
                className="h-36 rounded-2xl p-4 cursor-pointer hover:scale-[1.04] transition-all duration-300 relative overflow-hidden shadow-xl flex flex-col justify-between group border border-white/5 hover:border-white/20"
              >
                {/* Background Genre Photo */}
                <img 
                  src={genreImg} 
                  alt={g.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-115 transition-transform duration-700"
                  loading="lazy"
                />
                
                {/* Gradient tint over photo */}
                <div className={`absolute inset-0 bg-gradient-to-br ${g.gradient || 'from-black/80 to-black/60'} opacity-85 group-hover:opacity-75 transition-opacity`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30" />

                <div className="space-y-1 pr-4 z-10 relative">
                  <span className="text-base sm:text-lg font-black text-white leading-tight tracking-tight block drop-shadow-md">
                    {g.name.split('/')[0]}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/90 bg-black/40 px-2 py-0.5 rounded-full inline-block backdrop-blur-md border border-white/10">
                    {g.category.split('&')[0]}
                  </span>
                </div>

                {/* Decorative mini record icon slanted in bottom right */}
                <Disc 
                  size={46} 
                  className="absolute -right-2 -bottom-2 text-white/30 group-hover:rotate-45 group-hover:scale-125 transition-all duration-500 pointer-events-none z-10" 
                />
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
