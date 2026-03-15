import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Buffer } from 'buffer' // Necesitas instalarlo: npm install buffer
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext';

// --- PARCHE DE COMPATIBILIDAD PARA SIMPLE-PEER ---
window.global = window;
window.Buffer = Buffer;
window.process = {
  env: { DEBUG: undefined },
  nextTick: (fn, ...args) => setTimeout(() => fn(...args), 0),
};
// -------------------------------------------------

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)