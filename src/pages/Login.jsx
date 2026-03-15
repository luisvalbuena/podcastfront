import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para feedback visual
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    
    const inputUser = form.username.trim();
    const inputPass = form.password.trim();

    if (!inputUser || !inputPass) {
      setErrorMsg("Completa todos los campos");
      return;
    }

    setIsSubmitting(true);
    
    // login() ahora usa axios.post con la VITE_API_URL
    const result = await login(inputUser, inputPass);

    if (result.success) {
      navigate('/room');
    } else {
      setErrorMsg(result.error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <Card 
        className="w-full max-w-md border-slate-800" 
        title="Acceso Albatros" 
        description="Control de Redacción"
      >
        <form onSubmit={handleLogin} className="space-y-4 mt-4">
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Usuario</label>
            <input 
              type="text"
              disabled={isSubmitting}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 mt-1 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all disabled:opacity-50"
              onChange={(e) => setForm({...form, username: e.target.value})}
              value={form.username}
              placeholder="Ej: redactor_1"
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Contraseña</label>
            <input 
              type="password" 
              disabled={isSubmitting}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 mt-1 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all disabled:opacity-50"
              onChange={(e) => setForm({...form, password: e.target.value})}
              value={form.password}
              placeholder="••••••••"
            />
          </div>
          
          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
              <p className="text-red-500 text-[10px] font-black uppercase tracking-wider text-center">
                {errorMsg}
              </p>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full lg" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Autenticando..." : "Entrar al Estudio"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Login;