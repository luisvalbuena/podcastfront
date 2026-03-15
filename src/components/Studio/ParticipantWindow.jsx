import React from 'react';

const ParticipantWindow = ({ videoRef, label, isLocal, isConnected }) => {
  return (
    <div className="w-[24%] aspect-[3/4] bg-black border-2 border-white/10 shadow-2xl overflow-hidden relative">
      {isConnected ? (
        <video 
          ref={videoRef} 
          autoPlay 
          muted={isLocal} 
          className={`w-full h-full object-cover ${isLocal ? 'scale-x-[-1]' : ''}`} 
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-slate-900">
          <span className="text-[10px] text-blue-400 font-bold animate-pulse italic uppercase">
            Conectando...
          </span>
        </div>
      )}
      
      {/* Etiqueta de identificación */}
      <div className={`absolute bottom-0 left-0 right-0 bg-blue-700 border-t-2 border-emerald-400 px-2 py-1 ${!isLocal ? 'text-right' : ''}`}>
        <span className="text-[10px] font-black text-white italic uppercase tracking-tighter">
          {label}
        </span>
      </div>
    </div>
  );
};

export default ParticipantWindow;