//Este código:
// Crea un cliente de axios configurado
// Usa la URL del .env o una por defecto
// Timeout de 10 segundos
// Headers por defecto para JSON
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
