import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import Peer from 'simple-peer';

// Conexión al socket usando la variable de entorno
const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3001');

export const useWebRTC = (roomId) => {
  const [remoteStream, setRemoteStream] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  
  const peerRef = useRef();
  const localStreamRef = useRef();
  const initialized = useRef(false);

  useEffect(() => {
    // Evitamos doble ejecución en React Strict Mode
    if (initialized.current || !roomId) return;
    initialized.current = true;

    const sessionData = localStorage.getItem('albatros_session');
    if (!sessionData) return;
    const { role: myRole } = JSON.parse(sessionData);

    const initConnection = async () => {
      try {
        // 1. Capturamos cámara y audio
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 640, height: 360 },
          audio: true 
        });
        
        localStreamRef.current = stream;
        setConnectionStatus('ready');

        // 2. Nos unimos a la sala
        socket.emit('join-room', { roomId, role: myRole });

        // 3. Escuchamos cuando entra el otro redactor
        socket.on('user-joined', ({ role }) => {
          if (role !== myRole) {
            console.log(`👤 El ${role} se ha unido. Iniciando llamada...`);
            const peer = createPeer(true, stream, roomId, myRole);
            peerRef.current = peer;
          }
        });

        // 4. Recibimos la señal de respuesta/oferta
        socket.on('signal-received', (data) => {
          console.log("📡 Recibiendo señal del compañero...");
          if (!peerRef.current) {
            const peer = createPeer(false, stream, roomId, myRole);
            peerRef.current = peer;
          }
          peerRef.current.signal(data.signal);
        });

      } catch (err) {
        console.error("❌ Error de acceso a medios:", err);
        setConnectionStatus('error');
      }
    };

    const createPeer = (initiator, stream, room, role) => {
      // Configuramos STUN servers básicos para que la señal atraviese firewalls
      const peer = new Peer({ 
        initiator, 
        trickle: false, 
        stream,
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' }
          ]
        }
      });

      peer.on('signal', (signal) => {
        socket.emit('signal', { toRoom: room, signal, fromRole: role });
      });

      peer.on('stream', (remote) => {
        console.log("🎥 ¡Éxito! Stream remoto recibido.");
        setRemoteStream(remote);
        setConnectionStatus('connected');
      });

      peer.on('error', (err) => {
        console.error("❌ Error en el Peer:", err);
        setConnectionStatus('error');
      });

      return peer;
    };

    initConnection();

    // Limpieza al salir de la sala
    return () => {
      socket.off('user-joined');
      socket.off('signal-received');
      if (peerRef.current) peerRef.current.destroy();
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(t => t.stop());
      }
      initialized.current = false;
    };
  }, [roomId]);

  return { 
    remoteStream, 
    connectionStatus, 
    localStream: localStreamRef.current 
  };
};
