/**
 * CONFIGURACIÓN BASE DE AXIOS
 * 
 * Cliente HTTP configurado con:
 * - URL base desde variable de entorno
 * - Timeout de 10 segundos
 * - Headers por defecto para JSON
 */

import axios from 'axios';

// Crear instancia de axios con configuración base
const apiClient = axios.create({
  // URL del backend desde .env (puede ser 3000 o 3001 según el equipo)
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  
  // Timeout: cancelar petición si tarda más de 10 segundos
  timeout: 10000,
  
  // Headers por defecto para todas las peticiones
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;