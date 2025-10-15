import { Outlet } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './layout/navbar';

/**
 * Layout - Componente de la estructura principal de la página.
 * Contiene los elementos que se repiten en todas las vistas, como la Navbar y el Footer.
 * El <Outlet /> es el marcador de posición donde se renderizarán las rutas hijas.
 */
const Layout = () => {
  return (
    <ThemeProvider defaultTheme="light">
      <div className="min-h-screen flex flex-col bg-gray-50 text-theme-primary">
        {/* Navbar - barra de navegación principal */}
        <Navbar />
        
        {/* AÑADE style={{ minHeight: 'calc(100vh - 200px)' }} */}
        <main className="flex-1" style={{ minHeight: 'calc(100vh - 200px)' }}>
          <Outlet />
        </main>
        
        {/* Footer */}
        <footer className="bg-gray-800 text-white py-6 mt-auto">
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

/**
 * App - Componente raíz con layout principal
 */
function App() {
  return <Layout />;
}

export default App;
