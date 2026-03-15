import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/UI/Layout';
import api from '../api/axios'; 

const Edit = () => {
  const [videoUrl, setVideoUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cutPoints, setCutPoints] = useState({ start: 0, end: 0 });
  const videoRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const recordedUrl = sessionStorage.getItem('last_recording_url');
    if (recordedUrl) {
      setVideoUrl(recordedUrl);
    }
  }, []);

  // --- FUNCIÓN PARA DESCARTAR Y VOLVER ---
  const handleDiscard = () => {
    const confirmed = window.confirm("¿Estás seguro de que quieres descartar este video? Se perderá permanentemente.");
    
    if (confirmed) {
      // 1. Liberar memoria del navegador
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
      // 2. Limpiar el almacenamiento temporal
      sessionStorage.removeItem('last_recording_url');
      // 3. Volver al estudio
      navigate('/room');
    }
  };

  const setPoint = (type) => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      setCutPoints(prev => ({ ...prev, [type]: currentTime }));
    }
  };

// Dentro de handleExportVideo
const handleExportVideo = async () => {
  if (!videoUrl) return alert("No hay video para exportar");
  
  setIsProcessing(true);
  try {
    // 1. Obtener el blob y verificarlo
    const responseBlob = await fetch(videoUrl);
    const blob = await responseBlob.blob();

    if (blob.size === 0) {
      throw new Error("El archivo de video está vacío (0 bytes)");
    }

    // 2. Construir el FormData
    const formData = new FormData();
    // Asegúrate de que el nombre sea 'video' en minúsculas
    formData.append('video', blob, `clip_${Date.now()}.webm`);
    
    // Metadatos adicionales
    formData.append('startTime', cutPoints.start.toString());
    formData.append('endTime', cutPoints.end.toString());

    console.log("🚀 Enviando archivo al servidor...", {
      name: 'video',
      size: blob.size,
      type: blob.type
    });

    // 3. Petición (Sin headers manuales)
    const response = await api.post('/api/upload-session', formData);
    
    alert("¡Exportación completada con éxito!");
    navigate('/room');

  } catch (error) {
    console.error("❌ Error en la exportación:", error);
    const serverMsg = error.response?.data?.error || error.message;
    alert(`Error del sistema: ${serverMsg}`);
  } finally {
    setIsProcessing(false);
  }
};

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6">
        <header className="flex justify-between items-end mb-8 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Video Editor</h1>
            <p className="text-blue-500 text-[10px] font-black uppercase tracking-[0.3em]">Corte y Confección Albatros</p>
          </div>
          
          <div className="flex gap-4">
            {/* BOTÓN DE DESCARTAR */}
            <button 
              onClick={handleDiscard}
              disabled={isProcessing}
              className="px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-widest text-slate-500 hover:text-red-500 transition-all disabled:opacity-30"
            >
              Descartar Cambios
            </button>

            <button 
              onClick={handleExportVideo}
              disabled={isProcessing}
              className="bg-white text-black px-10 py-4 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all shadow-xl disabled:opacity-50"
            >
              {isProcessing ? 'Procesando Video...' : 'Exportar Video Final'}
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-8">
          <div className="bg-black rounded-[40px] overflow-hidden border-[12px] border-slate-900 shadow-2xl relative group">
            <video 
              ref={videoRef}
              src={videoUrl} 
              className="w-full aspect-video object-contain"
              controls
            />
            
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => setPoint('start')}
                className="bg-slate-900/90 text-white px-6 py-3 rounded-full border border-blue-500/50 text-[10px] font-bold uppercase backdrop-blur-md"
              >
                ✂️ Inicio: {cutPoints.start.toFixed(2)}s
              </button>
              <button 
                onClick={() => setPoint('end')}
                className="bg-slate-900/90 text-white px-6 py-3 rounded-full border border-red-500/50 text-[10px] font-bold uppercase backdrop-blur-md"
              >
                ✂️ Fin: {cutPoints.end.toFixed(2)}s
              </button>
            </div>
          </div>

          <div className="bg-slate-900/40 p-8 rounded-[40px] border border-slate-800">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white font-black text-xs uppercase tracking-widest">Secuencia Master</h3>
              <div className="text-[10px] text-slate-500 font-mono">
                {cutPoints.start.toFixed(2)}s --- {cutPoints.end.toFixed(2)}s
              </div>
            </div>
            
            <div className="relative h-20 bg-slate-800 rounded-2xl overflow-hidden border border-white/5">
              <div 
                className="absolute inset-y-0 bg-blue-600/30 border-x-2 border-blue-500"
                style={{
                  left: `${(cutPoints.start / (videoRef.current?.duration || 1)) * 100}%`,
                  right: `${100 - (cutPoints.end / (videoRef.current?.duration || 1)) * 100}%`
                }}
              />
              <div className="flex items-center justify-center h-full text-[10px] font-black text-slate-500 uppercase tracking-widest pointer-events-none">
                Timeline de Video
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Edit;