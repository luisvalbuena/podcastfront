import React from 'react';

const Controls = ({ isPlaying, onTogglePlay, onCut, onExport }) => {
  return (
    <div className="flex items-center justify-between bg-slate-900 p-4 rounded-2xl border border-slate-800 mb-6 shadow-xl">
      <div className="flex gap-2">
        <button 
          onClick={onCut}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg text-sm transition-colors border border-slate-700"
        >
          ✂️ <span>Recortar Selección</span>
        </button>
      </div>

      <button 
        onClick={onTogglePlay}
        className="w-14 h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl shadow-lg shadow-blue-900/40 transition-transform active:scale-90"
      >
        {isPlaying ? '⏸' : '▶️'}
      </button>

      <button 
        onClick={onExport}
        className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-emerald-900/20"
      >
        Exportar Podcast
      </button>
    </div>
  );
};

export default Controls;