import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  // Mientras el contexto recupera la sesión del backend/localStorage
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
            Sincronizando Estudio...
          </p>
        </div>
      </div>
    );
  } 

  // Si después de cargar no hay usuario, mandamos al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si hay usuario (user1 o user2), permitimos el acceso a la sala
  return children;
};

export default ProtectedRoute;