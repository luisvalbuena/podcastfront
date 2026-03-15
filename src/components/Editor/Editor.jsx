import React, { useState, useRef } from 'react';
import Track from './Track';
import Controls from './Controls';

const Editor = ({ tracks = [] }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const waveSurfers = useRef([]);

  const handleTrackReady = (wsInstance) => {
    waveSurfers.current.push(wsInstance);
  };

  const togglePlay = () => {
    waveSurfers.current.forEach(ws => ws.playPause());
    setIsPlaying(!isPlaying);
  };

  const handleCut = () => {
    console.log("Aplicando corte en las regiones seleccionadas...");
    // Aquí se implementaría la lógica de FFmpeg.wasm para procesar el archivo
  };

  const handleExport = () => {
    alert("Iniciando renderizado del programa Albatros...");
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <Controls 
        isPlaying={isPlaying} 
        onTogglePlay={togglePlay} 
        onCut={handleCut}
        onExport={handleExport}
      />
      
      <div className="space-y-4">
        {tracks.length > 0 ? (
          tracks.map(track => (
            <Track 
              key={track.id} 
              url={track.url} 
              label={track.name} 
              color={track.color}
              onReady={handleTrackReady}
            />
          ))
        ) : (
          <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-3xl">
            <p className="text-slate-600 font-medium">No hay grabaciones listas para editar</p>
            <p className="text-slate-700 text-sm">Termina una sesión en el estudio para ver las pistas aquí</p>
          </div>
        )}
      </div>

      {/* Regla de tiempo global */}
      <div className="mt-4 px-4 flex justify-between text-[10px] font-mono text-slate-600">
        <span>00:00:00</span>
        <span>LÍNEA DE TIEMPO MULTI-PISTA</span>
        <span>FIN DEL PROGRAMA</span>
      </div>
    </div>
  );
};

export default Editor;