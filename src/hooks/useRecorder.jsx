import { useState, useRef } from 'react';

export const useRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const animationFrameRef = useRef(null);

  // Función para dibujar imágenes/videos manteniendo proporción (evita estiramiento)
  const drawImageProp = (ctx, img, x, y, w, h) => {
    const imgW = img.videoWidth || img.width;
    const imgH = img.videoHeight || img.height;
    const r = Math.min(w / imgW, h / imgH);
    const nw = imgW * r, nh = imgH * r;
    const cx = (w - nw) / 2, cy = (h - nh) / 2;

    // Si quieres que llene todo el cuadro (tipo cover), usamos esta lógica:
    const ratio = Math.max(w / imgW, h / imgH);
    const centerShiftX = (w - imgW * ratio) / 2;
    const centerShiftY = (h - imgH * ratio) / 2;
    ctx.drawImage(img, 0, 0, imgW, imgH, x + centerShiftX, y + centerShiftY, imgW * ratio, imgH * ratio);
  };

  const composeCanvas = (ctx, canvas, localVideo, remoteVideo, visualSupport) => {
    const W = canvas.width;
    const H = canvas.height;

    // 1. FONDO PROFESIONAL (Gradiente y textura)
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, W, H);
    
    // Grid sutil de fondo
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.5)';
    ctx.lineWidth = 1;
    for (let i = 0; i < W; i += 40) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, H); ctx.stroke(); }
    for (let i = 0; i < H; i += 40) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(W, i); ctx.stroke(); }

    // 2. TABLÓN CENTRAL (Soporte Visual) - Proporción 16:9
    const sW = W * 0.50; 
    const sH = (sW * 9) / 16;
    const sX = (W - sW) / 2;
    const sY = 140;

    ctx.fillStyle = '#000';
    ctx.fillRect(sX - 5, sY - 5, sW + 10, sH + 10); // Marco negro
    if (visualSupport && visualSupport.complete) {
      drawImageProp(ctx, visualSupport, sX, sY, sW, sH);
    }
    ctx.strokeStyle = '#10b981'; ctx.lineWidth = 4;
    ctx.strokeRect(sX, sY, sW, sH);

    // 3. REDACTORES (Laterales) - Proporción 4:5 o similar para retrato profesional
    const pW = 340;
    const pH = 420;
    const pY = 160;

    // Redactor 1 (Local)
    if (localVideo && localVideo.readyState >= 2) {
      ctx.save();
      // Sombras para profundidad
      ctx.shadowBlur = 30; ctx.shadowColor = 'rgba(0,0,0,0.8)';
      // Espejo solo para el local
      ctx.translate(80 + pW, pY);
      ctx.scale(-1, 1);
      drawImageProp(ctx, localVideo, 0, 0, pW, pH);
      ctx.restore();
      
      ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 3;
      ctx.strokeRect(80, pY, pW, pH);
      
      // Etiqueta elegante
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(80, pY + pH - 40, 180, 40);
      ctx.fillStyle = 'white'; ctx.font = 'bold 16px Inter, Arial';
      ctx.fillText("HOST / REDACTOR", 95, pY + pH - 15);
    }

    // Redactor 2 (Remote)
    if (remoteVideo && remoteVideo.readyState >= 2) {
      ctx.save();
      ctx.shadowBlur = 30; ctx.shadowColor = 'rgba(0,0,0,0.8)';
      drawImageProp(ctx, remoteVideo, W - 80 - pW, pY, pW, pH);
      ctx.restore();
      
      ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 3;
      ctx.strokeRect(W - 80 - pW, pY, pW, pH);
    }

    // 4. LOWER THIRD (Estilo TV Moderna)
    const lY = H - 120;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
    ctx.beginPath();
    ctx.roundRect(W/2 - 300, lY, 600, 80, 10);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.stroke();

    // Detalle "dn"
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(W/2 - 280, lY + 15, 50, 50);
    ctx.fillStyle = 'white'; ctx.font = '900 24px Arial';
    ctx.fillText("dn", W/2 - 272, lY + 48);

    // Texto
    ctx.fillStyle = 'white'; ctx.font = '800 22px Arial';
    ctx.fillText("ALBATROS SESSION", W/2 - 210, lY + 35);
    ctx.fillStyle = '#94a3b8'; ctx.font = '500 14px Arial';
    ctx.fillText(isRecording ? "🔴 TRANSMITIENDO EN VIVO" : "ESTUDIO PREPARADO", W/2 - 210, lY + 60);

    if (isRecording) {
      animationFrameRef.current = requestAnimationFrame(() => 
        composeCanvas(ctx, canvas, localVideo, remoteVideo, visualSupport)
      );
    }
  };

const startRecording = (stream, canvasElt, localVideo, remoteVideo, visualSupport) => {
  // Verificación de seguridad
  if (!canvasElt) {
    console.error("useRecorder: No se recibió el elemento canvas");
    return;
  }

  const ctx = canvasElt.getContext('2d');
  if (!ctx) {
    console.error("useRecorder: No se pudo obtener el contexto 2D");
    return;
  }

  // Iniciamos el motor de dibujo profesional (el que arregla el estiramiento)
  composeCanvas(ctx, canvasElt, localVideo, remoteVideo, visualSupport);

  chunksRef.current = [];
  
  // CONFIGURACIÓN DE ALTA CALIDAD
  const options = {
    mimeType: 'video/webm;codecs=vp8,opus',
    videoBitsPerSecond: 8000000 // 8 Mbps para nitidez total
  };

  try {
    mediaRecorderRef.current = new MediaRecorder(stream, options);
    
    mediaRecorderRef.current.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
    };

    mediaRecorderRef.current.onstop = () => {
      cancelAnimationFrame(animationFrameRef.current);
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      sessionStorage.setItem('last_recording_url', url);
    };

    mediaRecorderRef.current.start(1000);
    setIsRecording(true);
  } catch (e) {
    console.error("Error al iniciar MediaRecorder:", e);
  }
};

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return { isRecording, startRecording, stopRecording };
};