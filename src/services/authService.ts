import type { LoginCredentials, RegisterData, User } from '../types/auth.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * SERVICIO DE AUTENTICACIÓN - Game of Bones
 * Conectado al backend
 */
class AuthService {
  /**
   * Iniciar sesión
   */
  async login(
    credentials: LoginCredentials
  ): Promise<{ user: User; token: string }> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al iniciar sesión');
    }

    const result = await response.json();

    // Backend devuelve: { success, message, data: { user, token } }
    const { user, token } = result.data;

    // Guardar en localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    return { user, token };
  }

  /**
   * Registrar nuevo usuario
   */
  async register(
    data: RegisterData
  ): Promise<{ user: User; token: string }> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al registrarse');
    }

    const result = await response.json();

    // Backend devuelve: { success, message, data: { user, token } }
    const { user, token } = result.data;

    // Guardar en localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    return { user, token };
  }

  /**
   * Verificar token actual
   * Lee el usuario guardado en localStorage
   */
  async verifyToken(): Promise<User> {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
      throw new Error('No hay sesión activa');
    }

    try {
      const user = JSON.parse(userStr);

      // Opcional: Verificar el token con el backend
      // const response = await fetch(`${API_URL}/auth/verify`, {
      //   headers: { 'Authorization': `Bearer ${token}` }
      // });
      // if (!response.ok) throw new Error('Token inválido');

      return user;
    } catch (error) {
      this.logout();
      throw new Error('Sesión inválida');
    }
  }

  /**
   * Cerrar sesión
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  /**
   * Obtener usuario actual
   */
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  /**
   * Verificar si está autenticado
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}

export default new AuthService();
