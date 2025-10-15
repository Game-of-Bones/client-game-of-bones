import { Outlet } from 'react-router-dom';
import { ThemeProvider } from '../context/ThemeContext';
import ThemeToggle from '../components/ui/ThemeToggles';

/**
 * AuthLayout - Layout para páginas de autenticación (Login/Register)
 * 
 * Características:
 * - Sin Navbar
 * - Con Footer
 * - Botón de cambio de tema flotante
 */
const AuthLayout = () => {
  return (
    <ThemeProvider defaultTheme="light">
      <div className="relative min-h-screen flex flex-col">
        {/* Botón de tema flotante en la esquina superior derecha */}
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle size={24} />
        </div>

        {/* Contenido principal (Login o Register) */}
        <main className="flex-1">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-6">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm">
              © 2024 Game of Bones - Blog de Paleontología
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Hecho con 🦴 y React
            </p>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
};

export default AuthLayout;