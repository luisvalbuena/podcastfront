import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios'; // Importamos la instancia configurada

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('albatros_session');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('albatros_session');
      }
    }
    setLoading(false);
  }, []);

  // Función de login optimizada con Axios
  const login = async (username, password) => {
    try {
      // Axios ya sabe que la URL base es la del .env
      // y no hace falta JSON.stringify ni headers manuales para JSON
      const response = await api.post('/api/login', { username, password });
      
      const userData = response.data;
      
      setUser(userData);
      localStorage.setItem('albatros_session', JSON.stringify(userData));
      
      return { success: true };
    } catch (err) {
      // Capturamos el error que viene del backend a través de Axios
      const errorMessage = err.response?.data?.error || 'Fallo en la comunicación con el estudio';
      console.error("Error de Login:", errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('albatros_session');
    // Redirección limpia al login
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);