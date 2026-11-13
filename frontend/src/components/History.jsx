import React, { useState, useEffect } from 'react';
import { History as HistoryIcon, Play, Trash2, Zap } from 'lucide-react';
import { usePlayer } from '../PlayerContext';
import { apiUrl, resolveAudioUrl } from '../config';

export default function History() {
  const { playTrack } = usePlayer();
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = () => {
    setLoading(true);
    fetch(apiUrl('/api/history?limit=100'))
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setHistoryItems(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(apiUrl(`/api/history/${id}`), {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error("Could not delete history item");
      setHistoryItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            Prediction Audit Log
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Historical audio inferences and confidence distributions stored in SQLite.
          </p>
        </div>
        <div className="text-xs font-mono text-[#00F0FF] font-bold">
          {historyItems.length} scanned tracks logged
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white dark:bg-[#12151C] rounded-xl border border-gray-200 dark:border-[#1E232F] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-gray-400 font-mono">
            Loading inference records...
          </div>
        ) : historyItems.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <HistoryIcon className="mx-auto text-gray-400" size={28} />
            <p className="text-sm font-bold text-gray-900 dark:text-white">No history records found</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Run tracks through the Classifier to generate persistent logs.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-gray-200 dark:border-[#1E232F] bg-gray-50 dark:bg-[#0A0C10] text-gray-500 dark:text-gray-400 uppercase font-mono font-bold text-[11px]">
                  <th className="py-3 px-4">Track Title</th>
                  <th className="py-3 px-4">Filename</th>
                  <th className="py-3 px-4">Predicted Genre</th>
                  <th className="py-3 px-4">Confidence</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-[#1A202C]">
                {historyItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-[#161B26] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-gray-900 dark:text-white">
                      {item.title}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-gray-500 dark:text-gray-400">
                      {item.filename}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2 py-0.5 rounded bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/30 font-bold uppercase tracking-wider text-[10px] font-mono">
                        {item.predicted_genre}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#FFE600]">
                      {item.confidence}%
                    </td>
                    <td className="py-3.5 px-4 text-gray-400 font-mono text-[11px]">
                      {new Date(item.analyzed_at).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {item.audio_url && (
                          <button
                            onClick={() => playTrack(item)}
                            title="Play audio"
                            className="p-1.5 rounded-full bg-gray-100 dark:bg-[#1A202C] hover:bg-[#00F0FF] hover:text-black transition-colors text-gray-800 dark:text-gray-200"
                          >
                            <Play size={13} className="translate-x-0.5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(item.id)}
                          title="Remove record"
                          className="p-1.5 rounded-full hover:bg-[#FF007F]/20 text-gray-400 hover:text-[#FF007F] transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
