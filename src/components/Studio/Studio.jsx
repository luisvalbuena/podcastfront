import React from 'react';
import { useWebRTC } from '../../hooks/useWebRTC';
import { useRecorder } from '../../hooks/useRecorder';
import StatusBadge from './StatusBadge';

const Studio = ({ roomId }) => {
  // Inicializamos la conexión en tiempo real
  const { remoteStream, connectionStatus } = useWebRTC(roomId);
  
  // Inicializamos el grabador local
  const { isRecording, audioUrl, startRecording, stopRecording } = useRecorder();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
      {/* Cabecera del Estudio */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Estudio en Vivo</h2>
          <div className="flex gap-2 mt-1">
            <StatusBadge type={connectionStatus} />
            {isRecording && <StatusBadge type="recording" />}
          </div>
        </div>
        
        {/* Botón Principal de Acción */}
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`px-8 py-4 rounded-2xl font-black transition-all transform active:scale-95 ${
            isRecording 
            ? 'bg-white text-slate-950 hover:bg-slate-200' 
            : 'bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-600/30'
          }`}
        >
          {isRecording ? 'FINALIZAR GRABACIÓN' : 'GRABAR EPISODIO'}
        </button>
      </div>

      {/* Grid de Participantes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Host (Tú) */}
        <div className="relative p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-xl">🎙️</div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Redactor (Tú)</p>
              <p className="text-white font-semibold">Anfitrión del Podcast</p>
            </div>
          </div>
          {/* Visualizador de volumen simplificado */}
          <div className="mt-6 h-1 w-full bg-slate-700 rounded-full overflow-hidden">
            {isRecording && <div className="h-full bg-blue-400 animate-pulse w-3/4" />}
          </div>
        </div>

        {/* Invitado (Remoto) */}
        <div className={`relative p-6 rounded-2xl border transition-all ${
          remoteStream ? 'bg-slate-800/50 border-emerald-500/30' : 'bg-slate-900 border-slate-800'
        }`}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
              remoteStream ? 'bg-emerald-500' : 'bg-slate-800 text-slate-600'
            }`}>
              {remoteStream ? '🎧' : '👤'}
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Invitado</p>
              <p className={`${remoteStream ? 'text-white' : 'text-slate-600'} font-semibold`}>
                {remoteStream ? 'Conectado' : 'Esperando conexión...'}
              </p>
            </div>
          </div>
          {/* Audio elemento oculto para escuchar al invitado */}
          {remoteStream && <audio autoPlay srcObject={remoteStream} className="hidden" />}
        </div>
      </div>

      {/* Notificación de archivo listo */}
      {audioUrl && !isRecording && (
        <div className="mt-8 p-4 bg-blue-600/10 border border-blue-500/20 rounded-xl flex justify-between items-center">
          <span className="text-blue-400 text-sm">✓ Grabación local procesada con éxito</span>
          <a href={audioUrl} download="grabacion-albatros.webm" className="text-white text-xs font-bold underline">
            Descargar Backup
          </a>
        </div>
      )}
    </div>
  );
};

export default Studio;