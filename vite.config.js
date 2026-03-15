import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Mantenemos el plugin para inyectar las utilidades básicas de Node
    nodePolyfills({
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      protocolImports: true,
    }),
  ],
  // Ajustamos el define para que no bloquee nuestro parche manual en main.jsx
  define: {
    // Esto evita que librerías externas rompan si buscan process.env
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  },
  // Opcional: Si simple-peer da problemas con el optimizador de dependencias
  optimizeDeps: {
    include: ['buffer', 'process']
  }
})