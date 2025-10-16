import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; // Ajusta la ruta según donde esté el archivo

/**
 * ProtectedRoute - Componente para proteger rutas (Layout Route)
 * * Verifica el estado de autenticación del usuario usando el hook `useAuth`.
 * - Muestra un estado de carga mientras se verifica la autenticación inicial.
 * - Si el usuario está autenticado, renderiza el componente hijo (<Outlet />).
 * - Si no está autenticado, redirige a /login, guardando la ruta original.
 */
const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Muestra un mensaje de carga mientras se determina el estado de autenticación.
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-secondary)]">
        <div className="text-center">
          {/* Puedes usar el diseño de carga de la primera versión si lo prefieres */}
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-coral)] mx-auto mb-4"></div>
          <p className="text-[var(--text-secondary)] text-lg">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  // Si está autenticado, permite el acceso.
  if (isAuthenticated) {
    return <Outlet />;
  }

  // Si no está autenticado, redirige a /login, guardando la ruta original.
  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;