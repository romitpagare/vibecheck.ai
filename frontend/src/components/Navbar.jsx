import React from 'react';
import { Home, Upload, ListMusic, Compass, History, Info } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'classifier', label: 'Analyze', icon: Upload },
    { id: 'playlists', label: 'Playlists', icon: ListMusic },
    { id: 'explorer', label: 'Genres', icon: Compass },
    { id: 'history', label: 'History', icon: History },
    { id: 'about', label: 'About', icon: Info },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#121212]/95 border-b border-[#282828] backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        
        {/* Vibecheck Custom Purple Aesthetic Brand */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2.5 cursor-pointer group select-none flex-shrink-0"
        >
          {/* Custom Futuristic Purple Vibe Sound Wave Orb */}
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-purple-700 via-violet-600 to-indigo-500 text-white flex items-center justify-center shadow-[0_0_24px_rgba(167,139,250,0.55)] group-hover:scale-105 group-hover:shadow-[0_0_28px_rgba(196,181,253,0.7)] transition-all">
            <svg 
              className="w-4 h-4 sm:w-5 sm:h-5" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <line x1="4" y1="12" x2="4" y2="12.01" strokeWidth="4" />
              <line x1="8" y1="8" x2="8" y2="16" />
              <line x1="12" y1="4" x2="12" y2="20" />
              <line x1="16" y1="7" x2="16" y2="17" />
              <line x1="20" y1="11" x2="20" y2="13" />
            </svg>
          </div>
          <div className="flex items-baseline gap-0.5">
            <span className="text-xl sm:text-2xl font-black tracking-tight text-white group-hover:text-[#A78BFA] transition-colors">
              vibecheck
            </span>
            <span className="text-xs sm:text-sm font-black text-[#A78BFA]">
              .ai
            </span>
          </div>
        </div>

        {/* Center/Right Nav Items: Spotify Style Pills with responsive scroll */}
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-1">
          <nav className="flex items-center gap-1 sm:gap-1.5 flex-nowrap">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-white text-black shadow-md'
                      : 'text-[#B3B3B3] hover:text-white hover:bg-[#282828]'
                  }`}
                >
                  <Icon size={14} className="sm:hidden" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

      </div>
    </header>
  );
}
