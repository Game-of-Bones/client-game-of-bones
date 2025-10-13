// Componente principal de la aplicación con layout y Outlet para rutas
import { BrowserRouter, Outlet, Routes, Route } from 'react-router-dom';
import Navbar from './layout/navbar';
import Login from './pages/Login'; // Asegúrate de que el nombre del archivo es Login.tsx (mayúscula)
// TODO: Importar el AuthProvider cuando esté creado
// import { AuthProvider } from './context/AuthContext';

/**
 * Layout - Componente de la estructura principal de la página.
 * Contiene los elementos que se repiten en todas las vistas, como la Navbar y el Footer.
 * El <Outlet /> es el marcador de posición donde se renderizarán las rutas hijas.
 */
const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar - barra de navegación principal */}
      <Navbar />
      {/* Main Content - aquí se renderizan las páginas */}
      <main className="flex-1">
        <Outlet />
      </main>
      {/* Footer opcional */}
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
  );
};

/**
 * App - Componente raíz con layout principal
 */
function App() {
  return (
    // TODO: Envolver con AuthProvider cuando esté listo
    // <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Ruta principal que usa el Layout */}
          <Route path="/" element={<Layout />}>
            {/* Rutas hijas que se renderizarán dentro del <Outlet> del Layout */}
            <Route index element={<div>Página de Inicio</div>} />
            <Route path="login" element={<Login />} />
            {/* Aquí irían otras rutas como /register, /posts, etc. */}
            {/* <Route path="register" element={<Register />} /> */}
          </Route>
        </Routes>
      </BrowserRouter>
    // </AuthProvider>
  );
}

export default App;

/**
 * NOTAS DE IMPLEMENTACIÓN FUTURA:
 * 
 * 1. Context Providers:
 *    Envolver App con providers necesarios:
 *    - AuthProvider: para manejar autenticación
 *    - ThemeProvider: para tema claro/oscuro
 *    - ToastProvider: para notificaciones
 *    
 *    Ejemplo en main.tsx:
 *    <AuthProvider>
 *      <ThemeProvider>
 *        <ToastProvider>
 *          <RouterProvider router={router} />
 *        </ToastProvider>
 *      </ThemeProvider>
 *    </AuthProvider>
 * 
 * 2. Footer mejorado:
 *    - Links a páginas importantes (Términos, Privacidad, Contacto)
 *    - Redes sociales
 *    - Newsletter signup
 * 
 * 3. Sidebar (opcional):
 *    - Para navegación adicional
 *    - Widgets (posts populares, tags)
 */