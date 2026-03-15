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
      // Mantenemos los pollyfills necesarios para Sozzly
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      protocolImports: true,
    }),
  ],
  define: {
    // Definimos global como globalThis para que OXC no dependa de inyecciones de esbuild
    'global': 'globalThis',
    // Aseguramos la definición de process.env para compatibilidad con librerías legacy
    'process.env': process.env,
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  },
  optimizeDeps: {
    // Forzamos la pre-optimización de estas dependencias para evitar recargas lentas
    include: ['buffer', 'process', 'simple-peer']
  },
  build: {
    commonjsOptions: {
      // Necesario para manejar dependencias que mezclan require e import
      transformMixedEsModules: true,
    },
    // Opcional: Si el warning en Render sigue siendo muy molesto, 
    // podrías considerar desactivar temporalmente el motor oxc, 
    // pero no es recomendable por rendimiento.
  },
})
