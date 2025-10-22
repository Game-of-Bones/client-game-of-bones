/**
 * SERVICIO DE AUTENTICACIÓN
 * 
 * Funciones para:
 * - Registro de usuarios
 * - Login
 * - Logout
 * - Obtener usuario actual
 * - Verificar rol de usuario
 */

import apiClient from './api/interceptors';

// ============================================
// TIPOS
// ============================================

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  role?: 'admin' | 'user'; // Opcional, por defecto será 'user'
}

interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'user';
  created_at: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

// ============================================
// FUNCIONES DEL SERVICIO
// ============================================

/**
 * Registrar un nuevo usuario
 * POST /api/auth/register
 */
export const register = async (data: RegisterData): Promise<{ user: User; token: string }> => {
  try {
    const response = await apiClient.post<AuthResponse>('/api/auth/register', data);
    
    // Guardar token en localStorage
    localStorage.setItem('token', response.data.data.token);
    
    // Guardar usuario en localStorage (útil para acceso rápido)
    localStorage.setItem('user', JSON.stringify(response.data.data.user));
    
    return response.data.data;
  } catch (error: any) {
    // Extraer mensaje de error del backend
    const message = error.response?.data?.message || 'Error al registrar usuario';
    throw new Error(message);
  }
};

/**
 * Iniciar sesión
 * POST /api/auth/login
 */
export const login = async (credentials: LoginCredentials): Promise<{ user: User; token: string }> => {
  try {
    const response = await apiClient.post<AuthResponse>('/api/auth/login', credentials);
    
    // Guardar token
    localStorage.setItem('token', response.data.data.token);
    
    // Guardar usuario
    localStorage.setItem('user', JSON.stringify(response.data.data.user));
    
    return response.data.data;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Error al iniciar sesión';
    throw new Error(message);
  }
};

/**
 * Cerrar sesión
 * Elimina token y datos de usuario del localStorage
 */
export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

/**
 * Obtener usuario actual desde localStorage
 * Útil para no hacer peticiones innecesarias
 */
export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr) as User;
  } catch {
    return null;
  }
};

/**
 * Verificar si el usuario actual es admin
 */
export const isAdmin = (): boolean => {
  const user = getCurrentUser();
  return user?.role === 'admin';
};

/**
 * Verificar si hay un usuario autenticado
 */
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

/**
 * Obtener el token actual
 */
export const getToken = (): string | null => {
  return localStorage.getItem('token');
};