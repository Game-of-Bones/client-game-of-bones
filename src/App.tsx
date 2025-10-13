import { Outlet } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './layout/navbar';

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <div className="min-h-screen flex flex-col bg-theme-primary text-theme-primary">
        {/* Navbar - barra de navegación principal */}
        <Navbar />
        
        {/* Main Content - aquí se renderizan las páginas */}
        <main className="flex-1">
          <Outlet />
        </main>
        
        {/* Footer */}
        <footer className="bg-primary-800 text-primary-50 py-6 mt-auto">
          <div className="container-custom text-center">
            <p className="text-sm">
              © 2024 Game of Bones - Blog de Paleontología
            </p>
            <p className="text-xs text-primary-200 mt-2">
              Hecho con 🦴 y React
            </p>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
}

/**
 * App - Componente raíz con layout principal
 */
function App() {
  return <Layout />;
}

export default App;
