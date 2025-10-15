import { Outlet } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './layout/navbar';

const Layout = () => {
  return (
    <ThemeProvider defaultTheme="light">
      {/* QUITA bg-gray-50 y text-theme-primary */}
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        {/* Añade background transparent */}
        <main className="flex-1 bg-transparent" style={{ minHeight: 'calc(100vh - 200px)' }}>
          <Outlet />
        </main>
        
        {/* Footer - este puede tener fondo sólido */}
        <footer className="bg-primary-800 text-primary-50 py-6 mt-auto">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm">
              © 2024 Game of Bones - Blog de Paleontología
            </p>
            <p className="text-xs opacity-70 mt-2">
              Hecho con 🦴 y React
            </p>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
};

function App() {
  return <Layout />;
}

export default App;