import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

/**
 * ADMIN ROUTE - Game of Bones
 * 
 * HOC para proteger rutas que requieren rol de administrador.
 * 
 * Funcionalidad:
 * - Verifica que el usuario esté autenticado Y sea admin
 * - Si es admin, renderiza las rutas hijas con <Outlet />
 * - Si NO es admin, redirige a la página principal
 * 
 * Uso en React Router v6:
 * ```tsx
 * {
 *   path: 'admin',
 *   element: <AdminRoute />,
 *   children: [
 *     { path: 'users', element: <UserManagement /> }
 *   ]
 * }
 * ```
 */
const AdminRoute = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  /**
   * Si no está autenticado o no es admin, redirigir a home
   */
  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  /**
   * Si es admin, renderizar las rutas hijas
   * <Outlet /> renderiza las rutas children definidas en el router
   */
  return <Outlet />;
};

export default AdminRoute;