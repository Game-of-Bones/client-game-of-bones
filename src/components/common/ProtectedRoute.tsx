import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

/**
 * Props del componente ProtectedRoute
 */
interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * PROTECTED ROUTE - Game of Bones
 * 
 * HOC (Higher Order Component) para proteger rutas que requieren autenticación.
 * 
 * Funcionalidad:
 * - Verifica si el usuario está autenticado
 * - Si está autenticado, renderiza el componente hijo
 * - Si NO está autenticado, redirige a /login
 * - Guarda la ubicación actual para redirigir después del login
 * 
 * Uso:
 * ```tsx
 * <ProtectedRoute>
 *   <Profile />
 * </ProtectedRoute>
 * ```
 */
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  
  // Obtener estado de autenticación del store de Zustand
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);

  /**
   * Mientras se verifica la autenticación, mostrar loading
   * Esto previene parpadeos de redirección
   */
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#5D4A3A]">
        <div className="text-center">
          <img 
            src="/gob_logo.png" 
            alt="Game of Bones Logo" 
            className="h-24 w-auto mx-auto mb-4 animate-pulse"
          />
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4A574] mx-auto mb-4"></div>
          <p className="text-[#E8D9B8] text-lg">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  /**
   * Si NO está autenticado, redirigir a login
   * Guardamos la ubicación actual para redirigir después del login
   * 
   * Ejemplo: 
   * - Usuario intenta ir a /profile → redirige a /login
   * - Después de login exitoso → redirige de vuelta a /profile
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