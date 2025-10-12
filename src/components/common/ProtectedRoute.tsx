// Componente HOC (Higher Order Component) para proteger rutas que requieren autenticación

import { Navigate, useLocation } from 'react-router-dom';
// TODO: Importar el hook de autenticación cuando esté disponible --> HECHO
import { useAuth } from '../../hooks/useAuth';

/**
 * Props del componente ProtectedRoute
 */
interface ProtectedRouteProps {
  children: React.ReactNode; // El componente hijo que queremos proteger
}

/**
 * ProtectedRoute - Componente para proteger rutas que requieren autenticación
 *
 * Funcionalidad:
 * - Verifica si el usuario está autenticado
 * - Si está autenticado, renderiza el componente hijo
 * - Si NO está autenticado, redirige a /login
 * - Guarda la ubicación actual para redirigir después del login
 *
 * Uso:
 * <ProtectedRoute>
 *   <Profile />
 * </ProtectedRoute>
 */
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation(); // Hook para obtener la ubicación actual

  // TODO: Descomentar cuando useAuth esté implementado--> hecho :)
  const { isAuthenticated, isLoading } = useAuth();

  // // MOCK temporal - CAMBIAR cuando useAuth esté listo
  // // Simula verificación de autenticación desde localStorage
  // const isAuthenticated = !!localStorage.getItem('token');
  // const isLoading = false; // En producción, esto vendría de useAuth

  // /**
  //  * Mientras se verifica la autenticación, mostrar un loading
  //  * Esto previene parpadeos de redirección
  //  */
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  /**
   * Si NO está autenticado, redirigir a login
   * Guardamos la ubicación actual en el state para redirigir después del login
   * Ejemplo: Usuario intenta ir a /profile → redirige a /login
   *          Después de login exitoso → redirige de vuelta a /profile
   */
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  /**
   * Si está autenticado, renderizar el componente hijo
   */
  return <>{children}</>;
};

export default ProtectedRoute;

/**
 * NOTAS DE IMPLEMENTACIÓN FUTURA:
 *
 * 1. Hook useAuth (src/hooks/useAuth.ts):
 *    El hook debe proporcionar:
 *    - isAuthenticated: boolean - Si el usuario está autenticado
 *    - isLoading: boolean - Si está verificando el token
 *    - user: User | null - Datos del usuario actual
 *    - login: (token, user) => void - Función para guardar sesión
 *    - logout: () => void - Función para cerrar sesión
 *
 * 2. Contexto de autenticación (src/context/AuthContext.tsx):
 *    Debe manejar el estado global de autenticación:
 *    - Verificar token al cargar la app
 *    - Validar token con el backend (GET /auth/verify)
 *    - Refrescar token automáticamente antes de que expire
 *    - Limpiar estado al hacer logout
 *
 * 3. Verificación de token:
 *    Al montar la app, verificar si hay token en localStorage:
 *    - Si hay token, validarlo con backend
 *    - Si es válido, cargar datos del usuario
 *    - Si es inválido, limpiar localStorage y marcar como no autenticado
 *
 * 4. Redirección inteligente después del login:
 *    En Login.tsx, después de login exitoso:
 *    const location = useLocation();
 *    const from = location.state?.from?.pathname || '/';
 *    navigate(from, { replace: true });
 *
 * 5. Refresh token:
 *    - Implementar lógica para refrescar token antes de que expire
 *    - Usar interceptor de axios para agregar token a todas las peticiones
 *    - Si una petición falla con 401, intentar refrescar token
 *
 * 6. Manejo de sesiones expiradas:
 *    - Si el token expira mientras el usuario navega, detectarlo
 *    - Mostrar modal/toast informando que la sesión expiró
 *    - Redirigir a login automáticamente
 */
