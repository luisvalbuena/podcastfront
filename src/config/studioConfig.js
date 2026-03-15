export const STUDIO_CONFIG = {
  video: {
    brightness: 1.05,
    contrast: 1.20,
    saturate: 1.20,
  },
  colors: {
    bgStudio: '#0f172a',
    accentHost: '#1d4ed8', 
    borderEmerald: '#34d399', 
    borderWindow: 'rgba(255, 255, 255, 0.1)',
  },
  layout: {
    participant: { w: 540, h: 720 }, 
    mediaBoard: { w: 1200, h: 680, y: 100 },
    lowerThird: { height: 140, yOffset: 60 }
  },
  utils: {
    // --- LÓGICA DE ANIMACIÓN ---
    // Usamos el tiempo actual para crear oscilaciones y desplazamientos
    getAnimValues: () => {
      const now = Date.now();
      return {
        // Oscila entre 0 y 1 cada segundo para el parpadeo
        blink: Math.abs(Math.sin(now / 500)),
        // Desplazamiento continuo para el texto superior
        scroll: (now / 20) % 1200 
      };
    },

    drawCustomBackground: (ctx, W, H) => {
      const grad = ctx.createLinearGradient(0, 0, W, H);
      grad.addColorStop(0, '#1e293b');
      grad.addColorStop(1, '#0f172a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
    },

    drawImageCover: (ctx, img, x, y, w, h, isLocal = false) => {
      if (!img || img.readyState < 2) return false;
      const imgW = img.videoWidth || img.width;
      const imgH = img.videoHeight || img.height;
      const ratio = Math.max(w / imgW, h / imgH);
      const cx = (w - imgW * ratio) / 2;
      const cy = (h - imgH * ratio) / 2;
      ctx.save();
      ctx.beginPath();
      ctx.rect(x, y, w, h);
      ctx.clip();
      if (isLocal) {
        ctx.translate(x + w, y);
        ctx.scale(-1, 1);
        ctx.drawImage(img, 0, 0, imgW, imgH, 0 + cx, cy, imgW * ratio, imgH * ratio);
      } else {
        ctx.drawImage(img, 0, 0, imgW, imgH, x + cx, y + cy, imgW * ratio, imgH * ratio);
      }
      ctx.restore();
      return true;
    },

    renderStudio: (ctx, canvas, videos, mediaImg, isRecording) => {
      const { width: W, height: H } = canvas;
      const cfg = STUDIO_CONFIG;
      const anim = cfg.utils.getAnimValues();
      const mb = cfg.layout.mediaBoard;
      const mbX = (W - mb.w) / 2;

      // 1. FONDO
      cfg.utils.drawCustomBackground(ctx, W, H);

      // 2. TABLÓN
      ctx.fillStyle = "#000";
      ctx.fillRect(mbX, mb.y, mb.w, mb.h);
      if (mediaImg?.complete) {
        cfg.utils.drawImageCover(ctx, mediaImg, mbX, mb.y, mb.w, mb.h);
      }

      // 3. VENTANAS (Simétricas a altura 80px)
      const renderParticipant = (v, x, label, isLocal) => {
        const p = cfg.layout.participant;
        const yPos = 80;
        ctx.save();
        ctx.shadowBlur = 40; ctx.shadowColor = "rgba(0,0,0,0.5)";
        ctx.fillStyle = "#000";
        ctx.fillRect(x, yPos, p.w, p.h);
        cfg.utils.drawImageCover(ctx, v, x, yPos, p.w, p.h, isLocal);
        ctx.strokeStyle = cfg.colors.borderWindow;
        ctx.lineWidth = 2;
        ctx.strokeRect(x, yPos, p.w, p.h);
        ctx.restore();

        const labelH = 50;
        const labelY = yPos + p.h - labelH;
        ctx.fillStyle = cfg.colors.accentHost;
        ctx.fillRect(x, labelY, p.w, labelH);
        ctx.fillStyle = cfg.colors.borderEmerald;
        ctx.fillRect(x, labelY, p.w, 3);
        ctx.fillStyle = "white";
        ctx.font = "italic 900 22px Arial";
        if (!isLocal) {
          ctx.textAlign = "right";
          ctx.fillText(label, x + p.w - 20, labelY + 35);
          ctx.textAlign = "left";
        } else {
          ctx.fillText(label, x + 20, labelY + 35);
        }
      };
      renderParticipant(videos.local, 40, "REDACTOR 1", true);
      renderParticipant(videos.remote, W - 580, "REDACTOR 2", false);

      // 4. LOWER THIRD ANIMADO
      const lt = cfg.layout.lowerThird;
      const ly = H - lt.height - lt.yOffset;
      const startX = 60;

      // --- BARRA SUPERIOR CON SCROLL ---
      ctx.save();
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.moveTo(startX + 40, ly - 35); ctx.lineTo(startX + 800, ly - 35);
      ctx.lineTo(startX + 780, ly); ctx.lineTo(startX + 40, ly);
      ctx.fill();
      ctx.clip(); // Cortamos el texto para que solo se vea dentro de la barra
      
      ctx.fillStyle = "black";
      ctx.font = "900 20px Arial";
      const newsText = "PARA MEDIR LA CRISPACIÓN EN LAS REDES SOCIALES • ÚLTIMA HORA: EL ESTUDIO ESTÁ EN DIRECTO • ";
      // Dibujamos el texto dos veces para el efecto infinito
      ctx.fillText(newsText, (startX + 60) - anim.scroll, ly - 10);
      ctx.fillText(newsText, (startX + 60) - anim.scroll + ctx.measureText(newsText).width, ly - 10);
      ctx.restore();

      // --- BARRA AZUL PRINCIPAL ---
      ctx.fillStyle = cfg.colors.accentHost;
      ctx.fillRect(startX, ly, W - (startX * 2), 85);

      // Logo dn
      ctx.fillStyle = "white";
      ctx.fillRect(startX, ly, 115, 85);
      ctx.fillStyle = "#E63946"; ctx.font = "900 45px Arial";
      ctx.fillText("dn", startX + 32, ly + 62);

      // Titular
      ctx.fillStyle = "white"; ctx.font = "900 52px Arial";
      ctx.fillText("SÁNCHEZ CREA UN 'ODIÓMETRO'", startX + 140, ly + 62);

      // --- BARRA INFERIOR CON REC BLINK ---
      ctx.fillStyle = "rgba(79, 209, 197, 1)";
      ctx.fillRect(W - 450, ly + 85, 390, 45);
      
      ctx.fillStyle = "#001D3D";
      ctx.font = "900 24px Arial";
      ctx.fillText("#ElAnalisisDN", W - 430, ly + 118);

      // Reloj y Punto REC parpadeante
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      ctx.fillText(time, W - 200, ly + 118);

      if (isRecording) {
        ctx.save();
        ctx.globalAlpha = anim.blink; // Aplicamos el parpadeo
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(W - 225, ly + 110, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
  }
};