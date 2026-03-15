import React from 'react';

const StudioBackground = ({ children }) => {
  return (
    <div className="absolute inset-0 z-0">
      {/* Base con gradiente radial */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1e40af_0%,_#1e3a8a_40%,_#172554_100%)]"></div>
      
      {/* Textura de líneas de TV */}
      <div className="absolute inset-0 opacity-20 bg-[length:50px_50px] bg-[linear-gradient(45deg,_transparent_45%,_#60a5fa_45%,_#60a5fa_55%,_transparent_55%)]"></div>

      {/* Panel Central (Videowall) estilo DN */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[65%] flex items-center justify-center">
        <div className="relative w-[50%] h-full bg-blue-900/40 border-y-[6px] border-emerald-400/50 backdrop-blur-sm overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200" 
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
            alt="Fondo Dinámico"
          />
        </div>
      </div>
      {children}
    </div>
  );
};

export default StudioBackground;