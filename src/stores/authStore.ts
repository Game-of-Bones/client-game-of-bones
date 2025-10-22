import { create } from 'zustand';
import { login, register, logout, getCurrentUser } from '../services';
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
  error: string | null;
}

interface AuthActions {
  checkAuth: () => void;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  // ========================================
  // ESTADO INICIAL
  // ========================================
  user: getCurrentUser(), // ← Obtener usuario del localStorage al iniciar
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,

  // ========================================
  // ACCIONES
  // ========================================

  /**
   * CHECK AUTH - Verifica token al cargar la app
   * En tu caso, getCurrentUser() ya maneja esto desde localStorage
   */
  checkAuth: () => {
    const token = localStorage.getItem('token');
    const user = getCurrentUser();
    
    set({ 
      user,
      token,
      isAuthenticated: !!token && !!user,
      isLoading: false,
      error: null,
    });
  },

  /**
   * LOGIN - Autenticar usuario
   */
  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });
    
    try {
      // El service ya guarda en localStorage
      const { user, token } = await login(credentials);
      
      set({ 
        user, 
        token, 
        isAuthenticated: true, 
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      const errorMessage = error?.message || 'Error al iniciar sesión';
      
      set({ 
        isLoading: false,
        error: errorMessage,
      });
      
      throw error;
    }
  },

  /**
   * REGISTER - Registrar nuevo usuario
   */
  register: async (data: RegisterData) => {
    set({ isLoading: true, error: null });
    
    try {
      // El service ya guarda en localStorage
      const { user, token } = await register(data);
      
      set({ 
        user, 
        token, 
        isAuthenticated: true, 
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      const errorMessage = error?.message || 'Error al registrar usuario';
      
      set({ 
        isLoading: false,
        error: errorMessage,
      });
      
      throw error;
    }
  },

  /**
   * LOGOUT - Cerrar sesión
   */
  logout: () => {
    // Limpiar localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Llamar a logout del service (puede hacer redirección adicional)
    logout();
    
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