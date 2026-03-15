import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import Peer from 'simple-peer';
import api from '../api/axios'; // Importamos tu instancia de axios

const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3001');

export const useWebRTC = (roomId) => {
  const [remoteStream, setRemoteStream] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  
  const peerRef = useRef();
  const localStreamRef = useRef();
  const mediaRecorderRef = useRef(null);
  const recordedChunks = useRef([]);
  const initialized = useRef(false);

  // --- LÓGICA DE GRABACIÓN Y SUBIDA ---
  const startRecording = (stream) => {
    try {
      recordedChunks.current = [];
      // Grabamos en webm (formato estándar de MediaRecorder)
      const recorder = new MediaRecorder(stream, { 
        mimeType: 'video/webm;codecs=vp8,opus' 
      });

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunks.current.push(e.data);
      };

      recorder.onstop = async () => {
        console.log("📦 Grabación finalizada. Preparando envío...");
        const blob = new Blob(recordedChunks.current, { type: 'video/webm' });
        await uploadToCloudinary(blob);
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      console.log("⏺️ Grabación iniciada en el estudio.");
    } catch (err) {
      console.error("❌ No se pudo iniciar la grabación:", err);
    }
  };

  const uploadToCloudinary = async (videoBlob) => {
    try {
      console.log("☁️ Subiendo sesión a Cloudinary via Backend...");
      const response = await api.post('/api/upload-session', videoBlob, {
        headers: { 'Content-Type': 'video/webm' }
      });
      console.log("✅ Sesión guardada con éxito:", response.data.url);
    } catch (err) {
      console.error("❌ Error al subir la sesión:", err);
    }
  };

  useEffect(() => {
    if (initialized.current) return;

    const sessionData = localStorage.getItem('albatros_session');
    if (!sessionData || !roomId) return;
    const { role: myRole } = JSON.parse(sessionData);

    const initConnection = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 640, height: 360 },
          audio: true 
        });
        
        localStreamRef.current = stream;
        setConnectionStatus('ready');
        initialized.current = true;

        socket.emit('join-room', { roomId, role: myRole });

        socket.on('user-joined', ({ role }) => {
          if (role !== myRole) {
            const peer = createPeer(true, stream, roomId, myRole);
            peerRef.current = peer;
          }
        });

        socket.on('signal-received', (data) => {
          if (!peerRef.current) {
            const peer = createPeer(false, stream, roomId, myRole);
            peerRef.current = peer;
          }
          peerRef.current.signal(data.signal);
        });

      } catch (err) {
        setConnectionStatus('error');
      }
    };

    const createPeer = (initiator, stream, room, role) => {
      const peer = new Peer({ initiator, trickle: false, stream });

      peer.on('signal', (signal) => {
        socket.emit('signal', { toRoom: room, signal, fromRole: role });
      });

      peer.on('stream', (remote) => {
        console.log("🎥 ¡CONEXIÓN ESTABLECIDA!");
        setRemoteStream(remote);
        setConnectionStatus('connected');
        
        // Iniciamos la grabación del stream remoto (lo que dice el otro redactor)
        startRecording(remote);
      });

      return peer;
    };

    initConnection();

    return () => {
      // Al desmontar (salir de la sala), detenemos la grabación para disparar la subida
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      
      socket.off('user-joined');
      socket.off('signal-received');
      initialized.current = false;
      if (peerRef.current) peerRef.current.destroy();
      if (localStreamRef.current) localStreamRef.current.getTracks().forEach(t => t.stop());
    };
  }, [roomId]);

  return { remoteStream, connectionStatus, localStream: localStreamRef.current };
};