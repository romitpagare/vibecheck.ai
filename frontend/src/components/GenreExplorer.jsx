import React, { useState } from 'react';
import { GENRES_DATA } from '../genresData';
import { GENRE_IMAGES } from '../genreImages';
import { 
  ChevronDown, ChevronUp, Music, Disc, Sparkles, 
  ExternalLink, Play, Radio, Volume2, CheckCircle2 
} from 'lucide-react';

export default function GenreExplorer() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedGenreId, setExpandedGenreId] = useState(null);

  const categories = ['All', 'Indian Music', 'Core 10 GTZAN', 'Modern Global'];

  const coreList = ["blues", "classical", "country", "disco", "hiphop", "jazz", "metal", "pop", "reggae", "rock"];
  const indianList = ["punjabi", "haryanvi", "bhojpuri", "bollywood", "indian_classical", "sufi_qawwali"];

  const filteredGenres = GENRES_DATA.filter(g => {
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Indian Music') return indianList.includes(g.id);
    if (selectedCategory === 'Core 10 GTZAN') return coreList.includes(g.id);
    return !coreList.includes(g.id) && !indianList.includes(g.id);
  });

  const toggleExpand = (id) => {
    setExpandedGenreId(expandedGenreId === id ? null : id);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto font-sans">
      
      {/* Spotify Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#282828] pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#A78BFA] font-mono">
            Sound Catalog & Coordinate Matrix
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white mt-1">
            Genre Explorer
          </h1>
          <p className="text-sm text-[#B3B3B3] mt-1 max-w-xl">
            Tap any genre to reveal its acoustic signature, waveform characteristics, and landmark reference songs.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 self-start sm:self-end">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-white text-black shadow-md'
                  : 'bg-[#181818] border border-[#282828] text-[#B3B3B3] hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Aesthetic Accordion Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredGenres.map(genre => {
          const isExpanded = expandedGenreId === genre.id;
          const isCore = coreList.includes(genre.id);

          return (
            <div
              key={genre.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden shadow-lg ${
                isExpanded 
                  ? 'bg-[#1E1E1E] border-[#A78BFA] shadow-[0_0_20px_rgba(167,139,250,0.15)]' 
                  : 'bg-[#181818] border-[#282828] hover:border-[#383838]'
              }`}
            >
              {/* Header Box (Click to Expand) */}
              <div 
                onClick={() => toggleExpand(genre.id)}
                className="p-5 cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  {/* Colorful Genre Badge Photo */}
                  <div className="w-14 h-14 rounded-xl relative overflow-hidden flex-shrink-0 shadow-md group-hover:scale-105 transition-transform bg-[#282828]">
                    <img 
                      src={GENRE_IMAGES[genre.id] || GENRE_IMAGES.pop} 
                      alt={genre.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/35 group-hover:bg-black/15 transition-colors" />
                    <Disc size={20} className="absolute inset-0 m-auto text-white drop-shadow-md opacity-90" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white group-hover:text-[#A78BFA] transition-colors truncate">
                        {genre.name}
                      </h3>
                      {isCore ? (
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#A78BFA]/20 text-[#A78BFA] border border-[#A78BFA]/30">
                          GTZAN
                        </span>
                      ) : (
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          Expansion
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-[#B3B3B3] block mt-0.5">
                      {genre.category}
                    </span>
                  </div>
                </div>

                {/* Dropdown Chevron */}
                <div className={`p-2 rounded-full bg-[#242424] text-[#B3B3B3] group-hover:text-white transition-transform ${isExpanded ? 'rotate-180 text-white bg-[#A78BFA]/20' : ''}`}>
                  <ChevronDown size={18} />
                </div>
              </div>

              {/* Collapsed Brief Preview */}
              {!isExpanded && (
                <div className="px-5 pb-4 text-xs text-[#8E8E8E] line-clamp-2 leading-relaxed">
                  {genre.description}
                </div>
              )}

              {/* Expanded Rich Details */}
              {isExpanded && (
                <div className="px-5 pb-6 pt-2 border-t border-[#282828] space-y-5 animate-in fade-in duration-200">
                  
                  {/* Detailed Description */}
                  <p className="text-xs md:text-sm text-[#E0E0E0] leading-relaxed">
                    {genre.description}
                  </p>

                  {/* Acoustic Characteristics */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#A78BFA] flex items-center gap-1.5">
                      <Sparkles size={14} />
                      <span>Acoustic Waveform Signature</span>
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {genre.characteristics.map((char, i) => (
                        <div key={i} className="p-2.5 rounded-xl bg-[#121212] border border-[#282828] text-xs text-[#B3B3B3] flex items-start gap-2">
                          <CheckCircle2 size={14} className="text-[#A78BFA] flex-shrink-0 mt-0.5" />
                          <span>{char}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Landmark Reference Songs Examples */}
                  {genre.exampleTracks && (
                    <div className="space-y-2 pt-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                        <Music size={14} className="text-[#A78BFA]" />
                        <span>Iconic Reference Songs</span>
                      </span>

                      <div className="space-y-1.5">
                        {genre.exampleTracks.map((trk, i) => (
                          <div 
                            key={i} 
                            className="p-3 rounded-xl bg-[#141414] hover:bg-[#202020] border border-[#282828] flex items-center justify-between transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-5 text-center text-xs font-mono text-[#727272]">
                                {i + 1}
                              </span>
                              <div>
                                <h4 className="text-sm font-bold text-white leading-tight">
                                  {trk.title}
                                </h4>
                                <p className="text-xs text-[#B3B3B3]">
                                  {trk.artist}
                                </p>
                              </div>
                            </div>

                            <span className="text-xs font-mono text-[#727272]">
                              {trk.year}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
