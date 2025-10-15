import { create } from 'zustand';
import authService from '../services/authService';
import type { LoginCredentials, RegisterData, User } from '../types/auth.types';

/**
 * ZUSTAND AUTH STORE - Game of Bones
 * 
 * Store global para manejar el estado de autenticación.
 */

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null; // ← AÑADIDO para manejar errores
}

interface AuthActions {
  checkAuth: () => Promise<void>;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  clearError: () => void; // ← AÑADIDO para limpiar errores
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  // ========================================
  // ESTADO INICIAL
  // ========================================
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null, // ← AÑADIDO

  // ========================================
  // ACCIONES
  // ========================================

  /**
   * CHECK AUTH - Verifica token al cargar la app
   */
  checkAuth: async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      set({ 
        isLoading: false, 
        isAuthenticated: false, 
        user: null, 
        token: null,
        error: null,
      });
      return;
    }

    try {
      const user = await authService.verifyToken();
      set({ 
        user, 
        token, 
        isAuthenticated: true, 
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Token inválido:', error);
      localStorage.removeItem('token');
      set({ 
        user: null, 
        token: null, 
        isAuthenticated: false, 
        isLoading: false,
        error: null,
      });
    }
  },

  /**
   * LOGIN - Autenticar usuario
   */
  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null }); // ← Limpiar errores previos
    
    try {
      const { user, token } = await authService.login(credentials);
      localStorage.setItem('token', token);
      
      set({ 
        user, 
        token, 
        isAuthenticated: true, 
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          'Error al iniciar sesión';
      
      set({ 
        isLoading: false,
        error: errorMessage,
      });
      
      throw error; // Re-lanzar para que el componente lo maneje
    }
  },

  /**
   * REGISTER - Registrar nuevo usuario
   */
  register: async (data: RegisterData) => {
    set({ isLoading: true, error: null }); // ← Limpiar errores previos
    
    try {
      const { user, token } = await authService.register(data);
      localStorage.setItem('token', token);
      
      set({ 
        user, 
        token, 
        isAuthenticated: true, 
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          'Error al registrar usuario';
      
      set({ 
        isLoading: false,
        error: errorMessage,
      });
      
      throw error; // Re-lanzar para que el componente lo maneje
    }
  },

  /**
   * LOGOUT - Cerrar sesión
   */
  logout: () => {
    authService.logout();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },

  /**
   * CLEAR ERROR - Limpiar mensajes de error
   */
  clearError: () => {
    set({ error: null });
  },
}));