import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * ProtectedRoute - Componente para proteger rutas
 *
 * Verifica el estado de autenticación del usuario usando el hook `useAuth`.
 * - Muestra un estado de carga mientras se verifica la autenticación inicial para evitar parpadeos.
 * - Si el usuario está autenticado, renderiza el componente de la ruta solicitada (`<Outlet />`).
 * - Si no está autenticado, lo redirige a la página de login (`/login`), guardando la ruta
 *   original para poder volver a ella después de un inicio de sesión exitoso.
 */
const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth(); // Unificamos el nombre a 'isLoading'
  const location = useLocation();

  console.log(`[ProtectedRoute Render] Path: ${location.pathname}, isAuthenticated: ${isAuthenticated}, isLoading: ${isLoading}`);

  // Muestra un mensaje de carga mientras se determina el estado de autenticación.
  // Esto previene un "parpadeo" donde se muestra brevemente la página de login antes de redirigir.
  if (isLoading) {
    console.log('[ProtectedRoute] isLoading es true. Mostrando pantalla de carga.');
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-secondary)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-coral)] mx-auto mb-4"></div>
          <p className="text-[var(--text-secondary)] text-lg">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  // Si después de la carga, el usuario está autenticado, permite el acceso.
  if (isAuthenticated) {
    console.log('[ProtectedRoute] isAuthenticated es true. Renderizando <Outlet />.');
    return <Outlet />;
  }

  // Si no está autenticado, redirige a login, guardando la ruta a la que se intentaba acceder.
  console.log(`[ProtectedRoute] No autenticado. Redirigiendo a /login desde ${location.pathname}.`);
  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;