import React from 'react';

const MediaBoard = ({ type = 'image', url, title }) => {
  return (
    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[65%] flex items-center justify-center">
      {/* El marco del tablón con el estilo de la foto */}
      <div className="relative w-[50%] h-full bg-blue-900/40 border-y-[6px] border-emerald-400/50 backdrop-blur-sm shadow-[0_0_50px_rgba(0,0,0,0.3)] overflow-hidden">
        
        {/* Renderizado condicional: Imagen o Vídeo */}
        {type === 'image' ? (
          <img 
            src={url} 
            className="w-full h-full object-cover opacity-60 mix-blend-overlay animate-fade-in"
            alt={title}
          />
        ) : (
          <video 
            src={url} 
            autoPlay 
            loop 
            muted 
            className="w-full h-full object-cover opacity-50 mix-blend-screen"
          />
        )}

        {/* Efecto de resplandor interno del tablón */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(52,211,153,0.1)_0%,_transparent_75%)] pointer-events-none"></div>
        
        {/* Etiqueta opcional del tablón */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-white/10 px-3 py-0.5 rounded-full border border-white/5 backdrop-blur-md">
          <span className="text-[8px] text-emerald-400 font-mono tracking-widest uppercase">Visual Support</span>
        </div>
      </div>
    </div>
  );
};

export default MediaBoard;