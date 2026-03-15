import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Tailwind 4 debe ir antes que otros plugins que procesen CSS
    tailwindcss(),
    nodePolyfills({
      // Mantenemos los pollyfills necesarios para Sozzly (Buffer, PeerJS, etc)
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      protocolImports: true,
    }),
  ],
  define: {
    // Definimos global como globalThis para compatibilidad con motores modernos
    'global': 'globalThis',
    // ELIMINADO: 'process.env': process.env (Riesgo de seguridad en Render)
    
    // Solo definimos NODE_ENV de forma segura
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  },
  optimizeDeps: {
    // Forzamos la pre-optimización para evitar recargas lentas en el estudio
    include: ['buffer', 'process', 'simple-peer']
  },
  build: {
    commonjsOptions: {
      // Necesario para manejar dependencias de streaming que mezclan require e import
      transformMixedEsModules: true,
    },
    // Aseguramos que el directorio de salida sea el que Render espera
    outDir: 'dist',
  },
})
