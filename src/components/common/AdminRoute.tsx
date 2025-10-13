import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface AdminRouteProps {
  children: React.ReactNode;
}

/**
 * AdminRoute - Protege rutas que requieren rol de administrador
 * Redirige a /login si no está autenticado
 * Redirige a / (home) si no es admin
 */
const AdminRoute = ({ children }: AdminRouteProps) => {
  const location = useLocation();
  const { isAuthenticated, isLoading, user } = useAuth();

  // Mostrar loading mientras verifica autenticación
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

  // Si NO está autenticado, redirigir a login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si está autenticado pero NO es admin, redirigir a home
  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Si está autenticado Y es admin, renderizar el componente hijo
  return <>{children}</>;
};

export default AdminRoute;
