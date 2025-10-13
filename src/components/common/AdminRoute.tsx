// Componente HOC para proteger rutas que requieren rol de administrador

import { Navigate, useLocation } from 'react-router-dom';
// TODO: Importar el hook de autenticación cuando esté disponible
// import { useAuth } from '../../hooks/useAuth';

/**
 * Props del componente AdminRoute
 */
interface AdminRouteProps {
  children: React.ReactNode;
}

/**
 * AdminRoute - Protege rutas que solo pueden acceder administradores
 * 
 * Funcionalidad:
 * - Verifica autenticación (igual que ProtectedRoute)
 * - Verifica que el usuario tenga rol de administrador
 * - Redirige a home si no es admin
 * - Redirige a login si no está autenticado
 */
const AdminRoute = ({ children }: AdminRouteProps) => {
  const location = useLocation();

  // TODO: Descomentar cuando useAuth esté implementado
  // const { isAuthenticated, user, isLoading } = useAuth();

  // MOCK temporal - CAMBIAR cuando useAuth esté listo
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  
  const isAuthenticated = !!token;
  const isAdmin = user?.role === 'admin'; // Verificar rol de admin
  const isLoading = false;

  /**
   * Loading state
   */
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  /**
   * Si NO está autenticado, redirigir a login
   */
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  /**
   * Si está autenticado pero NO es admin, redirigir a home con mensaje
   */
  if (!isAdmin) {
    // TODO: Mostrar toast/notificación de "No tienes permisos"
    return <Navigate to="/" replace />;
  }

  /**
   * Si está autenticado Y es admin, renderizar el componente
   */
  return <>{children}</>;
};

export default AdminRoute;

/**
 * NOTAS DE IMPLEMENTACIÓN FUTURA:
 * 
 * 1. Roles y permisos:
 *    Backend debe devolver el rol del usuario en el token o en GET /auth/me
 *    Roles posibles: 'user', 'admin', 'moderator'
 * 
 * 2. Notificaciones:
 *    Cuando se bloquee acceso, mostrar toast/alert:
 *    "No tienes permisos para acceder a esta sección"
 * 
 * 3. Permisos granulares:
 *    En el futuro, podría verificar permisos específicos:
 *    - canCreatePost
 *    - canDeleteUser
 *    - canModerateComments
 * 
 * 4. Auditoría:
 *    Registrar intentos de acceso no autorizado para seguridad
 */