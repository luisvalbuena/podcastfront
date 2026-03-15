import React, { useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.js';

const Track = ({ url, color, label, onReady }) => {
  const containerRef = useRef();
  const waveSurferRef = useRef();

  useEffect(() => {
    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: color || '#4F46E5',
      progressColor: '#818CF8',
      cursorColor: '#FFFFFF',
      height: 100,
      responsive: true,
      normalize: true,
      hideScrollbar: false,
      plugins: [RegionsPlugin.create()]
    });

    ws.load(url);
    ws.on('ready', () => onReady(ws));
    waveSurferRef.current = ws;

    return () => ws.destroy();
  }, [url]);

  return (
    <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800 mb-4 shadow-inner">
      <div className="flex justify-between items-center mb-3">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-800 px-2 py-1 rounded">
          {label}
        </span>
      </div>
      <div ref={containerRef} className="cursor-crosshair" />
    </div>
  );
};

export default Track;