import { create } from 'zustand';
import authService from '../services/authService';
import type { AuthState, AuthActions, LoginCredentials, RegisterData,
} from '../types/auth.types';

/**
 * Crea el store de Zustand para manejar el estado de autenticación.
 *
 * El store combina el estado (AuthState) y las acciones (AuthActions) en un solo lugar.
 * `set` es la función que nos da Zustand para actualizar el estado de forma inmutable.
 */
export const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  // --- ESTADO INICIAL ---
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true, // Inicia en true para la verificación inicial

  // --- ACCIONES ---

  /**
   * Verifica si hay un token válido en localStorage al cargar la app.
   */
  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ isLoading: false, isAuthenticated: false, user: null, token: null });
      return;
    }

    try {
      const user = await authService.verifyToken(); // El servicio mock verifica el token
      set({ user, token, isAuthenticated: true, isLoading: false });
    } catch (error) {
      console.error('Fallo en la verificación del token:', error);
      localStorage.removeItem('token');
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },

  /**
   * Inicia sesión, guarda el token y actualiza el estado.
   */
  login: async (credentials: LoginCredentials) => {
    const { user, token } = await authService.login(credentials);
    localStorage.setItem('token', token);
    set({ user, token, isAuthenticated: true, isLoading: false });
  },

  /**
   * Registra un nuevo usuario, guarda el token y actualiza el estado.
   */
  register: async (data: RegisterData) => {
    const { user, token } = await authService.register(data);
    localStorage.setItem('token', token);
    set({ user, token, isAuthenticated: true, isLoading: false });
  },

  /**
   * Cierra la sesión del usuario.
   * Esta es la implementación de la Tarea 1.
   */
  logout: () => {
    // 1. Llama al servicio para limpiar (que se encarga de localStorage.removeItem('token'))
    authService.logout(); 

    // 2. Actualiza el estado del store a sus valores iniciales de "no autenticado"
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false, // La carga ha terminado
    });
    console.log('Sesión cerrada correctamente desde el store de Zustand.');
  },
}));