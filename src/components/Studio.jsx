import React from 'react';
import { useRecorder } from '../../hooks/useRecorder';
import { useWebRTC } from '../../hooks/useWebRTC';

const Studio = ({ roomId }) => {
  const { isRecording, audioUrl, startRecording, stopRecording } = useRecorder();
  const { remoteStream } = useWebRTC(roomId);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {/* Usuario Local */}
        <div className="p-6 bg-slate-800 rounded-lg border-2 border-blue-500/50 text-center">
          <p className="text-blue-400 font-bold mb-2">Tú (Host)</p>
          <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
             {isRecording && <div className="h-full bg-blue-500 animate-pulse w-full" />}
          </div>
        </div>

        {/* Usuario Remoto */}
        <div className="p-6 bg-slate-800 rounded-lg border-2 border-emerald-500/50 text-center">
          <p className="text-emerald-400 font-bold mb-2">Invitado</p>
          {remoteStream ? (
            <>
              <audio autoPlay srcObject={remoteStream} className="hidden" />
              <div className="text-xs text-emerald-500 italic">Conectado y escuchando</div>
            </>
          ) : (
            <div className="text-xs text-slate-500 italic">Esperando al invitado...</div>
          )}
        </div>
      </div>

      {/* Controles de Grabación */}
      <div className="flex justify-center py-4">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`px-10 py-4 rounded-full font-bold transition-all ${
            isRecording 
              ? 'bg-slate-100 text-slate-900 hover:bg-white' 
              : 'bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-600/20'
          }`}
        >
          {isRecording ? '⏹ Finalizar Programa' : '🎙 Grabar Episodio'}
        </button>
      </div>
    </div>
  );
};

export default Studio;