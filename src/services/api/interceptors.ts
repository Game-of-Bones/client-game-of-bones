/**
 * INTERCEPTORES DE AXIOS
 * 
 * Añaden funcionalidad automática a todas las peticiones:
 * 1. REQUEST: Añade el token JWT a los headers automáticamente
 * 2. RESPONSE: Maneja errores 401 (no autenticado) y 403 (sin permisos)
 */

import apiClient from './axiosConfig';

// ============================================
// INTERCEPTOR DE REQUEST
// ============================================
// Se ejecuta ANTES de cada petición
apiClient.interceptors.request.use(
  (config) => {
    // Obtener el token del localStorage
    const token = localStorage.getItem('token');
    
    // Si existe token, añadirlo al header Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    // Si hay error en la request (antes de enviarla)
    return Promise.reject(error);
  }
);

// ============================================
// INTERCEPTOR DE RESPONSE
// ============================================
// Se ejecuta DESPUÉS de recibir cada respuesta
apiClient.interceptors.response.use(
  // Si la respuesta es exitosa (status 200-299), devolverla tal cual
  (response) => response,
  
  // Si hay error en la respuesta
  (error) => {
    // Error 401: Token inválido o expirado
    if (error.response?.status === 401) {
      // Eliminar token del localStorage
      localStorage.removeItem('token');
      
      // Redirigir al login (solo si no estamos ya en /login)
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    // Error 403: Sin permisos (usuario autenticado pero sin acceso)
    if (error.response?.status === 403) {
      console.error('❌ No tienes permisos para esta acción');
      // Aquí podrías mostrar un toast/notificación al usuario
    }

    // Rechazar la promesa con el error
    return Promise.reject(error);
  }
);

export default apiClient;