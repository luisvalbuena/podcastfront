import axios from 'axios';

const api = axios.create({
  // Vite expone las variables a través de import.meta.env
  baseURL: import.meta.env.VITE_API_URL,
  // IMPORTANTE: Eliminamos el objeto headers fijo de aquí para evitar conflictos
});

// Interceptor de solicitud: Manejo dinámico de Content-Type
api.interceptors.request.use(
  (config) => {
    // Si los datos NO son una instancia de FormData, forzamos JSON por defecto.
    // Si SON FormData (como en el editor), no seteamos nada para que el navegador
    // configure el Content-Type correcto con su 'boundary'.
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }

    // Ejemplo de cómo añadir un token en el futuro:
    // const token = localStorage.getItem('token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de respuesta: para centralizar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log detallado para depuración en la consola del redactor
    console.error('📡 API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;