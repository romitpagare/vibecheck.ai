import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Classifier from './components/Classifier';
import Playlists from './components/Playlists';
import GenreExplorer from './components/GenreExplorer';
import History from './components/History';
import AboutProject from './components/AboutProject';
import BottomPlayer from './components/BottomPlayer';
import { PlayerProvider } from './PlayerContext';
import { ThemeProvider } from './ThemeContext';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [preloadedUrl, setPreloadedUrl] = useState('');

  const handlePreloadUrl = (url) => {
    setPreloadedUrl(url);
    setActiveTab('classifier');
  };

  return (
    <ThemeProvider>
      <PlayerProvider>
        <div className="min-h-screen bg-[#121212] text-white flex flex-col font-sans pb-28 selection:bg-[#A78BFA]/30 selection:text-[#A78BFA]">
          {/* Main Navigation Bar */}
          <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Main Content Area */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8">
            {activeTab === 'home' && (
              <Home 
                setActiveTab={setActiveTab} 
                onPreloadUrl={handlePreloadUrl} 
              />
            )}
            {activeTab === 'classifier' && (
              <Classifier initialUrl={preloadedUrl} />
            )}
            {activeTab === 'playlists' && (
              <Playlists />
            )}
            {activeTab === 'explorer' && (
              <GenreExplorer />
            )}
            {activeTab === 'history' && (
              <History />
            )}
            {activeTab === 'about' && (
              <AboutProject />
            )}
          </main>

          {/* Persistent Bottom Audio Player Bar */}
          <BottomPlayer />
        </div>
      </PlayerProvider>
    </ThemeProvider>
  );
}
