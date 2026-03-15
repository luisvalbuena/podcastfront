import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <nav className="border-b border-slate-800/60 bg-slate-900/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-black italic">A</span>
            </div>
            <span className="font-bold text-white uppercase tracking-tighter">
              Albatros <span className="text-blue-500 text-xs">Podcast</span>
            </span>
          </Link>
          
          <div className="flex gap-6 items-center">
            {user && (
              <span className="text-[10px] font-black text-slate-500 uppercase bg-slate-800 px-2 py-1 rounded">
                {user.name}
              </span>
            )}
            <button 
              onClick={logout}
              className="px-4 py-2 rounded-lg text-sm font-bold text-red-400 bg-red-500/5 hover:bg-red-500/20 border border-red-500/10 transition-all active:scale-90"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-6 py-10">
        {children}
      </main>
    </div>
  );
};

export default Layout;