import { Link } from 'react-router-dom';

/**
 * Navbar - Componente de navegación principal
 * Contiene enlaces básicos para la navegación de la aplicación.
 * * NOTA: Este es un componente funcional básico. El estilo será añadido
 * posteriormente por el equipo de frontend.
 */
const Navbar = () => {
  // Las clases de Tailwind CSS añadidas son mínimas (flex, gap) 
  // para que los enlaces se vean uno al lado del otro.
  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex items-center justify-between">
        
        {/* Logo/Título principal */}
        <Link to="/" className="text-xl font-bold hover:text-blue-400 transition-colors">
          Game of Bones 🦴
        </Link>

        {/* Enlaces de navegación */}
        <div className="flex space-x-6">
          
          {/* Rutas Públicas */}
          <Link to="/" className="hover:text-gray-300">
            Home
          </Link>
          <Link to="/posts" className="hover:text-gray-300">
            Posts
          </Link>

          {/* Rutas de Autenticación */}
          <Link to="/login" className="hover:text-gray-300">
            Login
          </Link>
          <Link to="/register" className="hover:text-gray-300">
            Registro
          </Link>

          {/* Rutas Protegidas/Admin (Requieren Lógica de Visibilidad) */}
          <Link to="/profile" className="hover:text-gray-300">
            Perfil
          </Link>
          <Link to="/admin/posts/new" className="hover:text-gray-300">
            Crear Post
          </Link>
          <Link to="/admin/users" className="hover:text-gray-300">
            Admin Usuarios
          </Link>
          {/* NOTA: Las rutas /profile y /admin/* están protegidas 
               y solo serán visibles si el usuario está autenticado/es admin.
               La lógica de visibilidad se implementará en el futuro. */}

        </div>
      </div>
    </nav>
  );
};

export default Navbar;