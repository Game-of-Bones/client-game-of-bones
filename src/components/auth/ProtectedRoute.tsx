import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * PROTECTED ROUTE - Game of Bones
 * 
 * Componente para proteger rutas que requieren autenticación usando el patrón de "layout route".
 * 
 * Funcionalidad:
 * - Muestra un estado de carga mientras se verifica la autenticación inicial para evitar parpadeos.
 * - Si el usuario está autenticado, renderiza el componente de la ruta solicitada (`<Outlet />`).
 * - Si no está autenticado, lo redirige a la página de login (`/login`), guardando la ruta
 *   original para poder volver a ella después de un inicio de sesión exitoso.
 * 
 * Uso en el router:
 * ```tsx
 * <Route element={<ProtectedRoute />}>
 *   <Route path="/profile" element={<Profile />} />
 * </Route>
 * ```
 */
const ProtectedRoute = () => {
  const location = useLocation();
  
  const { isAuthenticated, isLoading } = useAuth();

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
  return <Outlet />;
};

export default ProtectedRoute;