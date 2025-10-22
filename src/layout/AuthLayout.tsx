import { Outlet } from 'react-router-dom';
import { ThemeProvider } from '../context/ThemeContext';
import ThemeToggle from '../components/ui/ThemeToggles';
import Footer from './footer';  // 👈 AÑADE ESTA LÍNEA

/**
 * AuthLayout - Layout para páginas de autenticación (Login/Register)
 * 
 * Características:
 * - Sin Navbar
 * - Con Footer consistente
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

        {/* Footer consistente en toda la web */}
        <Footer />  {/*REEMPLAZA todo el footer antiguo con esta línea */}
      </div>
    </ThemeProvider>
  );
};

export default AuthLayout;