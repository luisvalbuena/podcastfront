import React from 'react';

const LowerThird = ({ title, subtitle }) => {
  return (
    // Reducimos el bottom de 10 a 6 y el padding lateral
    <div className="absolute bottom-6 left-0 right-0 px-6 animate-fade-in-up">
      <div className="flex flex-col shadow-xl max-w-3xl mx-auto"> 
        {/* max-w-3xl limita el ancho para que no cruce toda la pantalla */}
        
        {/* Subtítulo: fuente más pequeña (xs) y padding reducido */}
        <div className="bg-white text-slate-900 px-3 py-0.5 self-start font-black text-[10px] uppercase tracking-tighter italic">
          {subtitle}
        </div>
        
        {/* Título principal: bajamos a text-xl y reducimos el padding vertical */}
        <div className="bg-blue-700 text-white px-4 py-2 flex items-center gap-3 border-l-4 border-emerald-400">
          <div className="bg-white text-blue-700 font-black px-1.5 py-0.5 text-base italic">dn</div>
          <h2 className="text-xl font-black uppercase italic tracking-tighter leading-tight">
            {title}
          </h2>
        </div>
        
        {/* Hashtag: más discreto */}
        <div className="bg-slate-900/90 backdrop-blur-sm self-end px-3 py-0.5 text-blue-400 font-mono text-[9px]">
          #AlbatrosLive <span className="text-white ml-2">22:27</span>
        </div>
      </div>
    </div>
  );
};

export default LowerThird;