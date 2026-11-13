import React, { useState, useEffect } from 'react';
import { 
  Play, Pause, Plus, Trash2, Music, Filter, 
  Check, MoreHorizontal, Shuffle, Heart, Disc3
} from 'lucide-react';
import { usePlayer } from '../PlayerContext';
import { GENRES_DATA } from '../genresData';
import { PLAYLIST_COVERS } from '../genreImages';
import { apiUrl, resolveAudioUrl } from '../config';

export default function Playlists() {
  const { playTrack, currentTrack, isPlaying } = usePlayer();
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [playlistSongs, setPlaylistSongs] = useState([]);
  const [loadingSongs, setLoadingSongs] = useState(false);

  // Modals & form state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newColor, setNewColor] = useState('#A78BFA');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Smart same-genre generator modal
  const [showGenreModal, setShowGenreModal] = useState(false);
  const [targetGenre, setTargetGenre] = useState('classical');
  const [isGenerating, setIsGenerating] = useState(false);

  const spotifyPalettes = [
    { color: '#A78BFA', name: 'Spotify Green' },
    { color: '#509BF5', name: 'Electric Blue' },
    { color: '#BA5D07', name: 'Orange Chill' },
    { color: '#E91429', name: 'Warm Red' },
    { color: '#8D67AB', name: 'Deep Purple' },
    { color: '#E8115B', name: 'Neon Coral' },
  ];

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = () => {
    fetch(apiUrl('/api/playlists'))
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPlaylists(data);
          if (!selectedPlaylist && data.length > 0) {
            selectPlaylist(data[0]);
          } else if (selectedPlaylist) {
            const updated = data.find(p => p.id === selectedPlaylist.id);
            if (updated) setSelectedPlaylist(updated);
          }
        }
      })
      .catch(() => {});
  };

  const selectPlaylist = (pl) => {
    setSelectedPlaylist(pl);
    setLoadingSongs(true);
    fetch(apiUrl(`/api/playlists/${pl.id}/songs`))
      .then(res => res.json())
      .then(data => {
        setPlaylistSongs(data.songs || []);
      })
      .catch(() => setPlaylistSongs([]))
      .finally(() => setLoadingSongs(false));
  };

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const res = await fetch(apiUrl('/api/playlists'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newTitle.trim(),
          description: newDescription.trim(),
          cover_color: newColor,
        }),
      });

      if (!res.ok) throw new Error("Could not create playlist");
      const created = await res.json();
      setNewTitle('');
      setNewDescription('');
      setShowCreateModal(false);
      fetchPlaylists();
      selectPlaylist(created);
      setFeedbackMsg("Playlist created.");
      setTimeout(() => setFeedbackMsg(''), 3000);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleGenerateGenrePlaylist = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const historyRes = await fetch(apiUrl('/api/history?limit=200'));
      const allHistory = await historyRes.json();
      
      const matching = allHistory.filter(s => 
        s.predicted_genre && s.predicted_genre.toLowerCase() === targetGenre.toLowerCase() && s.song_id
      );

      const plTitle = `${targetGenre.charAt(0).toUpperCase() + targetGenre.slice(1)} Mix`;
      const plDesc = `Your personal ${targetGenre.toUpperCase()} genre mix, powered by vibecheck.ai neural classification.`;

      const createRes = await fetch(apiUrl('/api/playlists'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: plTitle,
          description: plDesc,
          cover_color: newColor,
        }),
      });

      if (!createRes.ok) throw new Error("Failed to create playlist");
      const createdPl = await createRes.json();

      const uniqueSongIds = Array.from(new Set(matching.map(s => s.song_id)));
      for (const sId of uniqueSongIds) {
        await fetch(apiUrl('/api/playlists/add-song'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            playlist_id: createdPl.id,
            song_id: sId,
          }),
        });
      }

      setShowGenreModal(false);
      fetchPlaylists();
      selectPlaylist(createdPl);
      setFeedbackMsg(`Created '${plTitle}' with ${uniqueSongIds.length} tracks!`);
      setTimeout(() => setFeedbackMsg(''), 4000);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeletePlaylist = async (plId, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this playlist from your library?")) return;

    try {
      const res = await fetch(apiUrl(`/api/playlists/${plId}`), {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error("Could not delete playlist");
      fetchPlaylists();
      if (selectedPlaylist && selectedPlaylist.id === plId) {
        setSelectedPlaylist(null);
        setPlaylistSongs([]);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRemoveSong = async (plSongId, e) => {
    e.stopPropagation();
    if (!selectedPlaylist) return;
    try {
      const res = await fetch(apiUrl(`/api/playlists/${selectedPlaylist.id}/songs/${plSongId}`), {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error("Could not remove song");
      selectPlaylist(selectedPlaylist);
      fetchPlaylists();
    } catch (err) {
      alert(err.message);
    }
  };

  const handlePlayAll = () => {
    if (playlistSongs.length > 0) {
      playTrack(playlistSongs[0], playlistSongs, 0);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-sans">
      
      {/* Top Spotify Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Playlists
          </h1>
          <p className="text-sm text-[#B3B3B3] mt-1">
            Browse and organize songs curated by genre and vibe.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start">
          <button
            onClick={() => setShowGenreModal(true)}
            className="px-5 py-2.5 rounded-full bg-[#A78BFA] hover:bg-[#C4B5FD] text-black font-extrabold text-xs transition-transform hover:scale-105 flex items-center gap-2 shadow-[0_0_15px_rgba(167,139,250,0.3)]"
          >
            <Filter size={15} />
            <span>Mix by Genre</span>
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-2.5 rounded-full border border-[#404040] hover:border-white text-white font-extrabold text-xs transition-colors flex items-center gap-2"
          >
            <Plus size={15} />
            <span>New Playlist</span>
          </button>
        </div>
      </div>

      {feedbackMsg && (
        <div className="px-4 py-3 rounded-xl bg-[#A78BFA]/15 border border-[#A78BFA]/30 text-[#A78BFA] text-xs font-bold flex items-center gap-2">
          <Check size={16} />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Spotify Grid Layout: Playlists Sidebar (Left) + Detailed Tracklist (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Spotify Playlists Vertical Navigation */}
        <div className="lg:col-span-4 bg-[#181818] rounded-2xl border border-[#282828] p-3 space-y-1">
          <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-[#B3B3B3]">
            Your Library ({playlists.length})
          </div>

          <div className="space-y-1 max-h-[620px] overflow-y-auto pr-1">
            {playlists.map((pl, idx) => {
              const isSelected = selectedPlaylist && selectedPlaylist.id === pl.id;
              const thumbImg = PLAYLIST_COVERS[idx % PLAYLIST_COVERS.length];
              return (
                <div
                  key={pl.id}
                  onClick={() => selectPlaylist(pl)}
                  className={`p-2.5 rounded-xl cursor-pointer transition-all flex items-center justify-between group ${
                    isSelected
                      ? 'bg-[#282828] text-white'
                      : 'hover:bg-[#202020] text-[#B3B3B3] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-lg overflow-hidden flex-shrink-0 shadow-md relative bg-[#282828]">
                      <img 
                        src={thumbImg} 
                        alt={pl.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/25" />
                    </div>
                    <div className="min-w-0">
                      <h4 className={`text-sm font-bold truncate ${isSelected ? 'text-white' : 'group-hover:text-white'}`}>
                        {pl.name}
                      </h4>
                      <p className="text-xs text-[#727272] truncate mt-0.5">
                        Playlist • {pl.song_count || 0} song{pl.song_count === 1 ? '' : 's'}
                      </p>
                    </div>
                  </div>

                  {pl.is_sample !== 1 && (
                    <button
                      onClick={(e) => handleDeletePlaylist(pl.id, e)}
                      title="Delete playlist"
                      className="text-[#727272] hover:text-red-400 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Full Spotify Playlist View with Hero Banner & Clean Table */}
        <div className="lg:col-span-8 bg-[#181818] rounded-2xl border border-[#282828] overflow-hidden shadow-2xl">
          {selectedPlaylist ? (
            <div>
              {/* Spotify Hero Banner */}
              <div 
                className="p-6 md:p-8 flex flex-col sm:flex-row items-center sm:items-end gap-6 relative"
                style={{
                  background: `linear-gradient(180deg, ${selectedPlaylist.cover_color || '#A78BFA'}33 0%, #181818 100%)`
                }}
              >
                {/* Album Cover Art */}
                <div className="w-36 h-36 md:w-44 md:h-44 rounded-xl flex items-center justify-center text-white font-black text-5xl shadow-2xl flex-shrink-0 relative group overflow-hidden bg-[#282828] border border-white/10">
                  <img 
                    src={PLAYLIST_COVERS[(selectedPlaylist.id || 0) % PLAYLIST_COVERS.length]} 
                    alt={selectedPlaylist.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors" />

                  {playlistSongs.length > 0 && (
                    <button
                      onClick={handlePlayAll}
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Play all tracks"
                    >
                      <div className="w-14 h-14 rounded-full bg-[#A78BFA] text-black flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                        <Play size={24} fill="currentColor" className="translate-x-0.5" />
                      </div>
                    </button>
                  )}
                </div>

                {/* Playlist Info */}
                <div className="flex-1 text-center sm:text-left space-y-2">
                  <span className="text-xs font-black uppercase tracking-wider text-white">
                    Public Playlist
                  </span>
                  <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight leading-tight">
                    {selectedPlaylist.name}
                  </h2>
                  <p className="text-xs md:text-sm text-[#B3B3B3] line-clamp-2">
                    {selectedPlaylist.description || "Curated tracks classified under this playlist."}
                  </p>
                  
                  <div className="flex items-center justify-center sm:justify-start gap-3 pt-2 text-xs font-bold text-[#B3B3B3]">
                    <span className="text-white font-extrabold">vibecheck.ai</span>
                    <span>•</span>
                    <span>{playlistSongs.length} song{playlistSongs.length === 1 ? '' : 's'}</span>
                  </div>
                </div>
              </div>

              {/* Action Bar (Big Green Play Button) */}
              <div className="px-6 md:px-8 py-4 flex items-center gap-6 border-b border-[#282828]">
                {playlistSongs.length > 0 && (
                  <button
                    onClick={handlePlayAll}
                    className="w-14 h-14 rounded-full bg-[#A78BFA] hover:bg-[#C4B5FD] text-black flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
                    title="Play all"
                  >
                    <Play size={24} fill="currentColor" className="translate-x-0.5" />
                  </button>
                )}

                <span className="text-sm font-bold text-white">
                  {playlistSongs.length > 0 ? "Play Playlist" : "No Tracks Yet"}
                </span>
              </div>

              {/* Clean Spotify Tracklist Table */}
              <div className="p-4 md:p-6">
                {loadingSongs ? (
                  <div className="py-16 text-center text-xs text-[#B3B3B3] font-mono">
                    Loading playlist tracks...
                  </div>
                ) : playlistSongs.length === 0 ? (
                  <div className="py-20 text-center space-y-3">
                    <Music className="mx-auto text-[#404040]" size={40} />
                    <p className="text-base font-bold text-white">This playlist has no songs yet</p>
                    <p className="text-xs text-[#B3B3B3] max-w-sm mx-auto">
                      Analyze a YouTube link or audio file in the Classifier, then click "Save to Playlist".
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {/* Header Row */}
                    <div className="grid grid-cols-12 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#B3B3B3] border-b border-[#282828]">
                      <div className="col-span-1 text-center font-mono">#</div>
                      <div className="col-span-8 md:col-span-7">Title</div>
                      <div className="hidden md:block col-span-3">Genre</div>
                      <div className="col-span-3 md:col-span-1 text-right"></div>
                    </div>

                    {/* Song Rows */}
                    {playlistSongs.map((song, idx) => {
                      const isCurrent = currentTrack && currentTrack.id === song.id;
                      const isPlayingThis = isCurrent && isPlaying;

                      return (
                        <div
                          key={song.playlist_song_id}
                          onClick={() => playTrack(song, playlistSongs, idx)}
                          className={`grid grid-cols-12 items-center px-4 py-3 rounded-xl cursor-pointer group transition-colors ${
                            isCurrent
                              ? 'bg-[#282828] text-[#A78BFA]'
                              : 'hover:bg-[#222222] text-white'
                          }`}
                        >
                          {/* Track # or Play Button */}
                          <div className="col-span-1 text-center font-mono text-xs text-[#B3B3B3]">
                            <span className="group-hover:hidden">
                              {isPlayingThis ? '▶' : idx + 1}
                            </span>
                            <Play size={14} fill="currentColor" className="hidden group-hover:inline-block text-white mx-auto" />
                          </div>

                          {/* Song Title & Filename Only */}
                          <div className="col-span-8 md:col-span-7 min-w-0 pr-3">
                            <h4 className={`text-sm font-bold truncate ${isCurrent ? 'text-[#A78BFA]' : 'text-white'}`}>
                              {song.title}
                            </h4>
                            <p className="text-xs text-[#727272] truncate">
                              {song.filename}
                            </p>
                          </div>

                          {/* Genre Tag Pill */}
                          <div className="hidden md:flex col-span-3 items-center">
                            {song.predicted_genre ? (
                              <span className="px-3 py-1 rounded-full bg-[#A78BFA]/15 text-[#A78BFA] text-xs font-extrabold uppercase tracking-wider">
                                {song.predicted_genre}
                              </span>
                            ) : (
                              <span className="text-xs text-[#727272]">Audio Track</span>
                            )}
                          </div>

                          {/* Action (Remove from playlist) */}
                          <div className="col-span-3 md:col-span-1 flex items-center justify-end">
                            <button
                              onClick={(e) => handleRemoveSong(song.playlist_song_id, e)}
                              title="Remove from playlist"
                              className="p-1.5 text-[#727272] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="py-24 text-center text-sm text-[#B3B3B3]">
              Select a playlist from the left.
            </div>
          )}
        </div>

      </div>

      {/* Modal 1: Mix by Genre */}
      {showGenreModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#181818] rounded-2xl border border-[#282828] max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2">
              <Filter className="text-[#A78BFA]" size={22} />
              <h3 className="text-lg font-bold text-white">Create Genre Mix Playlist</h3>
            </div>
            <p className="text-xs text-[#B3B3B3] leading-relaxed">
              Select any musical genre. vibecheck.ai will scan your library and automatically gather all matching tracks into a clean Spotify-style playlist.
            </p>

            <form onSubmit={handleGenerateGenrePlaylist} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-white mb-1.5">
                  Target Genre
                </label>
                <select
                  value={targetGenre}
                  onChange={(e) => setTargetGenre(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#333333] bg-[#121212] text-sm text-white capitalize focus:outline-none focus:border-[#A78BFA]"
                >
                  {GENRES_DATA.slice(0, 10).map(g => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-2">
                  Cover Accent Color
                </label>
                <div className="flex gap-3">
                  {spotifyPalettes.map(cov => (
                    <button
                      key={cov.color}
                      type="button"
                      onClick={() => setNewColor(cov.color)}
                      className={`w-8 h-8 rounded-full transition-transform ${newColor === cov.color ? 'scale-110 ring-2 ring-offset-2 ring-white' : ''}`}
                      style={{ backgroundColor: cov.color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#282828]">
                <button
                  type="button"
                  onClick={() => setShowGenreModal(false)}
                  className="px-4 py-2 rounded-full border border-[#404040] text-xs font-bold text-[#B3B3B3] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="px-5 py-2 rounded-full bg-[#A78BFA] hover:bg-[#C4B5FD] text-black text-xs font-extrabold transition-all"
                >
                  {isGenerating ? "Assembling..." : "Create Mix"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Create Custom Playlist */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#181818] rounded-2xl border border-[#282828] max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Create Custom Playlist</h3>
            <form onSubmit={handleCreatePlaylist} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-white mb-1">
                  Playlist Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. My Favorites or Chill Afternoon"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#333333] bg-[#121212] text-sm text-white focus:outline-none focus:border-[#A78BFA]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1">
                  Description
                </label>
                <textarea
                  rows="2"
                  placeholder="Notes about this playlist..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#333333] bg-[#121212] text-sm text-white focus:outline-none focus:border-[#A78BFA]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-2">
                  Cover Accent Color
                </label>
                <div className="flex gap-3">
                  {spotifyPalettes.map(cov => (
                    <button
                      key={cov.color}
                      type="button"
                      onClick={() => setNewColor(cov.color)}
                      className={`w-8 h-8 rounded-full transition-transform ${newColor === cov.color ? 'scale-110 ring-2 ring-offset-2 ring-white' : ''}`}
                      style={{ backgroundColor: cov.color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#282828]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-full border border-[#404040] text-xs font-bold text-[#B3B3B3] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#A78BFA] hover:bg-[#C4B5FD] text-black text-xs font-extrabold transition-all"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
