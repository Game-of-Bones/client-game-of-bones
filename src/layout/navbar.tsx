/**
 * Navbar - Componente de navegación principal
 * 
 * Características:
 * - Navegación responsive
 * - Theme toggle integrado
 * - Enlaces con estados hover
 * - Logo con link a home
 * 
 * TODO:
 * - Implementar lógica de autenticación para mostrar/ocultar enlaces
 * - Agregar menú móvil (hamburger)
 * - Destacar la ruta activa
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ui/ThemeToggles';
import { useAuth } from '../hooks/useAuth';
import ConfirmationModal from '../components/ui/ConfirmationModal';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Esta función se llama al confirmar el cierre de sesión en el modal
  const confirmLogout = () => {
    logout();
    navigate('/login');
    setIsLogoutModalOpen(false); // Cierra el modal
  };

  // Esta función solo abre el modal
  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  return (
    <nav className="bg-primary-800 border-b border-primary-700 sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo/Título principal */}
          <Link 
            to="/" 
            className="text-xl font-serif font-bold text-primary-50 hover:text-accent-coral transition-colors"
          >
            Game of Bones 🦴
          </Link>

          {/* Enlaces de navegación */}
          <div className="flex items-center space-x-1">
            
            {/* Rutas Públicas */}
            <NavLink to="/">Home</NavLink>
            <NavLink to="/posts">Posts</NavLink>

            {/* Separador visual */}
            <div className="h-6 w-px bg-primary-600 mx-2" />

            {isAuthenticated ? (
              <>
                {/* Rutas para usuarios autenticados */}
                <NavLink to="/profile">Perfil de {user?.username}</NavLink>

                {/* TODO: Mostrar solo si es admin */}
                {user?.role === 'admin' && (
                  <>
                    <NavLink to="/admin/posts/new">Crear Post</NavLink>
                    <NavLink to="/admin/users">Usuarios</NavLink>
                  </>
                )}

                <button
                  onClick={handleLogoutClick}
                  className="
                    px-3 py-2 text-sm font-medium text-primary-100 rounded-lg
                    transition-colors duration-200 hover:bg-primary-700 hover:text-accent-coral
                    focus:outline-none focus:ring-2 focus:ring-accent-coral
                    focus:ring-offset-2 focus:ring-offset-primary-800"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                {/* Rutas para usuarios no autenticados */}
                <NavLink to="/login">Login</NavLink>
                <NavLink to="/register">Registro</NavLink>
              </>
            )}

            {/* Separador visual */}
            <div className="h-6 w-px bg-primary-600 mx-2" />

            {/* Theme Toggle */}
            <ThemeToggle size={20} />
          </div>
        </div>
      </div>

      {/* Modal de confirmación de Logout */}
      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={confirmLogout}
        title="Cerrar Sesión"
        message="¿Estás seguro de que quieres cerrar sesión?"
        confirmText="Cerrar Sesión"
      />
    </nav>
  );
};

export default Navbar;

// ========================================
// COMPONENTE AUXILIAR: NavLink
// ========================================

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
}

/**
 * NavLink - Componente de enlace estilizado para el navbar
 * Reutilizable con estilos consistentes
 */
function NavLink({ to, children }: NavLinkProps) {
  return (
    <Link
      to={to}
      className="
        px-3 py-2
        text-sm font-medium
        text-primary-100
        rounded-lg
        transition-colors duration-200
        hover:bg-primary-700
        hover:text-accent-coral
        focus:outline-none
        focus:ring-2
        focus:ring-accent-coral
        focus:ring-offset-2
        focus:ring-offset-primary-800
      "
    >
      {children}
    </Link>
  );
}

/**
 * NOTAS DE IMPLEMENTACIÓN FUTURA:
 * 
 * 1. Autenticación:
 *    Usar un hook useAuth() para mostrar/ocultar enlaces:
 *    
 *    const { isAuthenticated, user } = useAuth();
 *    
 *    {isAuthenticated && <NavLink to="/profile">Perfil</NavLink>}
 *    {user?.role === 'admin' && <NavLink to="/admin">Admin</NavLink>}
 * 
 * 2. Active Link:
 *    Usar useLocation() para destacar la ruta activa:
 *    
 *    const location = useLocation();
 *    const isActive = location.pathname === to;
 *    
 *    className={`... ${isActive ? 'bg-primary-700 text-accent-coral' : ''}`}
 * 
 * 3. Mobile Menu:
 *    Agregar menú hamburger para móviles:
 *    
 *    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
 *    
 *    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
 *      <Menu size={24} />
 *    </button>
 * 
 * 4. User Dropdown:
 *    Menú desplegable con avatar y opciones de usuario:
 *    
 *    <UserDropdown>
 *      <DropdownItem to="/profile">Perfil</DropdownItem>
 *      <DropdownItem to="/settings">Configuración</DropdownItem>
 *      <DropdownItem onClick={logout}>Cerrar sesión</DropdownItem>
 *    </UserDropdown>
 */