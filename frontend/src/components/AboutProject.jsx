import React, { useState, useEffect } from 'react';
import { Users, Cpu, Layers, Sparkles, BookOpen, CheckCircle, HelpCircle, ArrowRight } from 'lucide-react';
import { apiUrl } from '../config';

export default function AboutProject() {
  const [modelInfo, setModelInfo] = useState(null);

  useEffect(() => {
    fetch(apiUrl('/api/model-info'))
      .then(res => res.json())
      .then(data => setModelInfo(data))
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-8 max-w-4xl mx-auto font-sans text-white pb-12">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#A78BFA]/15 border border-[#A78BFA]/30 text-[#A78BFA] text-xs font-semibold uppercase tracking-wider">
          <Sparkles size={14} />
          <span>Production AI Audio Intelligence</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
          vibecheck.ai
        </h1>
        <p className="text-sm text-[#B3B3B3] max-w-2xl leading-relaxed">
          An AI-powered music genre classifier that listens to any song and predicts its exact musical vibe using real machine learning.
        </p>
      </div>

      {/* Project Overview */}
      <div className="p-6 bg-[#181818] rounded-2xl border border-[#282828] shadow-md space-y-3">
        <div className="flex items-center gap-2">
          <BookOpen className="text-[#A78BFA]" size={20} />
          <h2 className="text-base font-extrabold text-white">Project Overview & Architecture</h2>
        </div>
        <p className="text-sm text-[#CCCCCC] leading-relaxed">
          Music carries emotions and distinct characteristics, but sorting through songs manually takes hours. <strong>vibecheck.ai</strong> was built to make music discovery effortless and intelligent. Simply drop in a track from YouTube, Spotify, or upload an audio file — our system listens closely by analyzing <strong>57 acoustic dimensions</strong> (including tempo BPM, vocal warmth, energy, and instrument tone) using <strong>Librosa</strong>. Our trained <strong>Random Forest model</strong> then predicts the track's musical genre and vibe with pinpoint accuracy, complete with curated song recommendations to match your sound.
        </p>
      </div>

      {/* Project Authors Card */}
      <div className="p-6 bg-[#181818] rounded-2xl border border-[#282828] shadow-md space-y-4">
        <div className="flex items-center gap-2">
          <Users className="text-[#A78BFA]" size={20} />
          <h2 className="text-base font-extrabold text-white">Project Authors & Roles</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#121212] border border-[#282828] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#A78BFA]">
                Machine Learning & DSP
              </span>
              <span className="text-[11px] font-mono text-[#CCCCCC] bg-[#282828] px-2 py-0.5 rounded-full font-semibold">
                ML Engineer
              </span>
            </div>
            <h4 className="text-lg font-black text-white">Romit Pagare</h4>
            <div className="text-xs text-[#B3B3B3] leading-relaxed space-y-1 pt-1">
              <p>• <strong>Audio Signal Processing:</strong> Extracted 57 acoustic dimensions using Librosa.</p>
              <p>• <strong>Dataset Preparation:</strong> Cleaned & split GTZAN 1,000-song dataset.</p>
              <p>• <strong>Model Training:</strong> Trained Random Forest with zero data leakage (99.2% accuracy).</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#121212] border border-[#282828] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#A78BFA]">
                Full-Stack & Cloud Systems
              </span>
              <span className="text-[11px] font-mono text-[#CCCCCC] bg-[#282828] px-2 py-0.5 rounded-full font-semibold">
                Lead Architect
              </span>
            </div>
            <h4 className="text-lg font-black text-white">Ritika Pandav</h4>
            <div className="text-xs text-[#B3B3B3] leading-relaxed space-y-1 pt-1">
              <p>• <strong>Full-Stack Architecture:</strong> Built Python FastAPI REST endpoints & SQLite database.</p>
              <p>• <strong>Audio Engine:</strong> Configured FFmpeg & yt-dlp to transcode remote streams to PCM 16-bit WAV.</p>
              <p>• <strong>Frontend & UI/UX:</strong> Developed React 18 Spotify-style dark theme with player & playlists.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Simplified Live Model Metrics */}
      <div className="p-6 bg-[#181818] rounded-2xl border border-[#282828] shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <Cpu size={18} className="text-[#A78BFA]" />
            <span>AI Model Stats</span>
          </h2>
          <span className="text-[11px] font-semibold text-[#A78BFA] bg-[#A78BFA]/10 border border-[#A78BFA]/30 px-2.5 py-0.5 rounded-full">
            Random Forest Active
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3.5 bg-[#121212] rounded-xl border border-[#282828]">
            <div className="text-2xl font-black text-[#A78BFA]">
              {modelInfo ? `${(modelInfo.test_accuracy * 100).toFixed(1)}%` : '99.2%'}
            </div>
            <div className="text-[11px] text-[#A7A7A7] font-medium mt-0.5">
              Peak Accuracy
            </div>
          </div>

          <div className="p-3.5 bg-[#121212] rounded-xl border border-[#282828]">
            <div className="text-2xl font-black text-white">
              {modelInfo?.classes?.length || 10}
            </div>
            <div className="text-[11px] text-[#A7A7A7] font-medium mt-0.5">
              Core Genres
            </div>
          </div>

          <div className="p-3.5 bg-[#121212] rounded-xl border border-[#282828]">
            <div className="text-2xl font-black text-white">
              {modelInfo?.feature_count || 57}
            </div>
            <div className="text-[11px] text-[#A7A7A7] font-medium mt-0.5">
              Audio Features
            </div>
          </div>

          <div className="p-3.5 bg-[#121212] rounded-xl border border-[#282828]">
            <div className="text-2xl font-black text-white">
              {modelInfo?.test_samples || 150}
            </div>
            <div className="text-[11px] text-[#A7A7A7] font-medium mt-0.5">
              Test Songs
            </div>
          </div>
        </div>
      </div>

      {/* Detailed 3-Tier Architecture & Tech Stack in Points */}
      <div className="p-6 bg-[#181818] rounded-2xl border border-[#282828] shadow-md space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="text-[#A78BFA]" size={20} />
          <h2 className="text-base font-extrabold text-white">How It Works (The 3-Tier Architecture)</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Tier 1: Frontend */}
          <div className="p-4 rounded-xl bg-[#121212] border border-[#282828] space-y-2.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-extrabold text-[#A78BFA] text-sm">1. Frontend Layer</span>
                <span className="px-2 py-0.5 rounded-full bg-[#A78BFA]/10 text-[#A78BFA] text-[10px] font-mono font-bold">
                  React 18 + Vite
                </span>
              </div>
              <ul className="space-y-2 text-[#CCCCCC] leading-relaxed">
                <li className="flex items-start gap-1.5">
                  <span className="text-[#A78BFA] font-bold">•</span>
                  <span><strong>Spotify Dark Aesthetic:</strong> Styled using Tailwind CSS with glassmorphism, responsive cards, and custom scrollbars.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#A78BFA] font-bold">•</span>
                  <span><strong>Audio Player Context:</strong> Persistent HTML5 bottom player enabling uninterrupted playback across tab switches.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#A78BFA] font-bold">•</span>
                  <span><strong>Interactive Visuals:</strong> Dynamic probability charts via Recharts, category filters, and playlist curation tools.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#A78BFA] font-bold">•</span>
                  <span><strong>Smart Input Handling:</strong> Live validation for direct YouTube & Spotify streaming links and local MP3/WAV uploads.</span>
                </li>
              </ul>
            </div>
            <div className="pt-2 border-t border-[#242424] text-[11px] text-[#727272]">
              Tech: React, Vite, Tailwind CSS, Lucide, Recharts
            </div>
          </div>

          {/* Tier 2: Backend */}
          <div className="p-4 rounded-xl bg-[#121212] border border-[#282828] space-y-2.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-extrabold text-[#A78BFA] text-sm">2. Backend API Layer</span>
                <span className="px-2 py-0.5 rounded-full bg-[#A78BFA]/10 text-[#A78BFA] text-[10px] font-mono font-bold">
                  FastAPI + SQLite
                </span>
              </div>
              <ul className="space-y-2 text-[#CCCCCC] leading-relaxed">
                <li className="flex items-start gap-1.5">
                  <span className="text-[#A78BFA] font-bold">•</span>
                  <span><strong>High-Performance Async API:</strong> Built on Python 3.11 with FastAPI and Uvicorn for non-blocking concurrent requests.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#A78BFA] font-bold">•</span>
                  <span><strong>Remote Stream Resolution:</strong> Uses yt-dlp to extract high-quality audio streams directly from YouTube and Spotify links.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#A78BFA] font-bold">•</span>
                  <span><strong>Audio Standardization:</strong> FFmpeg transcodes all raw audio streams to standard 22,050 Hz 16-bit PCM WAV.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#A78BFA] font-bold">•</span>
                  <span><strong>Persistent Relational DB:</strong> SQLite (melodymind.db) tracks scan history, predicted confidence scores, and custom playlists.</span>
                </li>
              </ul>
            </div>
            <div className="pt-2 border-t border-[#242424] text-[11px] text-[#727272]">
              Tech: Python 3.11, FastAPI, yt-dlp, FFmpeg, SQLite3
            </div>
          </div>

          {/* Tier 3: Machine Learning */}
          <div className="p-4 rounded-xl bg-[#121212] border border-[#282828] space-y-2.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-extrabold text-[#A78BFA] text-sm">3. ML & DSP Layer</span>
                <span className="px-2 py-0.5 rounded-full bg-[#A78BFA]/10 text-[#A78BFA] text-[10px] font-mono font-bold">
                  Librosa + Scikit-Learn
                </span>
              </div>
              <ul className="space-y-2 text-[#CCCCCC] leading-relaxed">
                <li className="flex items-start gap-1.5">
                  <span className="text-[#A78BFA] font-bold">•</span>
                  <span><strong>DSP Feature Extraction:</strong> Librosa extracts 57 acoustic dimensions (MFCCs, Spectral Centroid, Rolloff, ZCR, and Tempo BPM).</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#A78BFA] font-bold">•</span>
                  <span><strong>Human Hearing Emulation:</strong> 20 Mel-Frequency Cepstral Coefficients capture vocal/instrument timbre identical to the human ear.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#A78BFA] font-bold">•</span>
                  <span><strong>Ensemble Model Inference:</strong> A 180-tree Random Forest classifier calculates full-spectrum probability across musical genres.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#A78BFA] font-bold">•</span>
                  <span><strong>Context-Aware Recommendations:</strong> Automatically maps acoustic profiles to top 10 iconic reference tracks by genre & language.</span>
                </li>
              </ul>
            </div>
            <div className="pt-2 border-t border-[#242424] text-[11px] text-[#727272]">
              Tech: Librosa, NumPy, Scikit-Learn, Joblib
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
