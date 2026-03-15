import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/UI/Layout';
import StudioBackground from '../components/Studio/StudioBackground';
import MediaBoard from '../components/Studio/MediaBoard'; 
import ParticipantWindow from '../components/Studio/ParticipantWindow';
import LowerThird from '../components/Studio/LowerThird';
import { useWebRTC } from '../hooks/useWebRTC';
import { useRecorder } from '../hooks/useRecorder';
import { useAuth } from '../context/AuthContext';
// Verifica que esta ruta sea correcta según tu proyecto
import { STUDIO_CONFIG } from '../config/studioConfig';
const Room = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { remoteStream, localStream } = useWebRTC("albatros-studio-v1");
  
  // Hook sin parámetros iniciales para evitar el error de "canvas no recibido"
  const { isRecording, startRecording, stopRecording } = useRecorder();
  
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const canvasRef = useRef(null);
  const bgImg = useRef(new Image());

  // Conexión de Streams a los elementos de video
  useEffect(() => {
    bgImg.current.crossOrigin = "anonymous";
    bgImg.current.src = 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?q=80&w=1920';
    
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  // Bucle de renderizado del Canvas (Se mantiene corriendo siempre)
useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: false });
  let frame;

  const draw = () => {
    // Solo una línea de ejecución delegada al config
    STUDIO_CONFIG.utils.renderStudio(
      ctx, 
      canvas, 
      { local: localVideoRef.current, remote: remoteVideoRef.current }, 
      bgImg.current, 
      isRecording
    );
    frame = requestAnimationFrame(draw);
  };

  draw();
  return () => cancelAnimationFrame(frame);
}, [isRecording]); // Se actualiza si cambia el estado de grabación

  const handleToggle = async () => {
    if (isRecording) {
      stopRecording();
      navigate('/edit');
    } else {
      const canvas = canvasRef.current;
      if (!canvas) return alert("Error: Canvas no listo");

      // Creamos el stream de video desde el canvas
      const canvasStream = canvas.captureStream(30);
      const finalStream = new MediaStream();
      
      // Agregamos el video del canvas
      canvasStream.getVideoTracks().forEach(track => finalStream.addTrack(track));
      
      // Agregamos los audios de los streams reales
      if (localStream) localStream.getAudioTracks().forEach(t => finalStream.addTrack(t));
      if (remoteStream) remoteStream.getAudioTracks().forEach(t => finalStream.addTrack(t));

      // Iniciamos grabación pasando el stream y el canvas explícitamente
      startRecording(finalStream, canvas);
    }
  };

  return (
    <Layout>
      <div className="relative w-full aspect-video bg-slate-950 border-[12px] border-slate-900 shadow-2xl overflow-hidden">
        {/* INTERFAZ UI: Aquí es donde ves la webcam */}
        <StudioBackground />
        <MediaBoard src={bgImg.current.src} />

        <div className="absolute inset-0 z-10 flex items-center justify-between px-16">
          <ParticipantWindow 
            videoRef={localVideoRef} 
            label="TÚ (REDACTOR)" 
            isLocal={true}
            isConnected={!!localStream} 
          />
          <ParticipantWindow 
            videoRef={remoteVideoRef} 
            label="INVITADO" 
            isLocal={false}
            isConnected={!!remoteStream} 
          />
        </div>

        <div className="absolute bottom-6 inset-x-0 z-30 flex justify-center">
          <LowerThird title={isRecording ? "🔴 GRABANDO" : "SITUACIÓN: LISTO"} />
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <button onClick={handleToggle} className="bg-red-600 text-white px-20 py-4 rounded-full font-black hover:bg-red-500 transition-all uppercase shadow-xl">
          {isRecording ? 'Detener' : 'Iniciar Grabación'}
        </button>
      </div>

      {/* ELEMENTOS TÉCNICOS OCULTOS */}
      {/* Usamos opacity-0 en lugar de hidden para que algunos navegadores no suspendan el renderizado */}
      <canvas ref={canvasRef} width={1920} height={1080} className="fixed pointer-events-none opacity-0" />
      <video ref={localVideoRef} autoPlay playsInline muted className="fixed pointer-events-none opacity-0" />
      <video ref={remoteVideoRef} autoPlay playsInline className="fixed pointer-events-none opacity-0" />
    </Layout>
  );
};

export default Room;