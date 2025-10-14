/**
 * App - Componente raíz con layout principal y ThemeProvider
 * 
 * Estructura:
 * - ThemeProvider: maneja el tema claro/oscuro
 * - Navbar: navegación principal (siempre visible)
 * - Outlet: renderiza las rutas hijas definidas en router/index.tsx
 * - Footer: información adicional
 */

import { Outlet } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './layout/navbar';

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <div className="min-h-screen flex flex-col bg-theme-primary text-theme-primary">
        <Navbar />
        
        {/* AÑADE style={{ minHeight: 'calc(100vh - 200px)' }} */}
        <main className="flex-1" style={{ minHeight: 'calc(100vh - 200px)' }}>
          <Outlet />
        </main>
        
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

export default App;

/**
 * NOTAS DE IMPLEMENTACIÓN:
 * 
 * ✅ ThemeProvider ya implementado
 * 
 * PRÓXIMOS PASOS:
 * 1. Añadir ThemeToggle en Navbar
 * 2. AuthProvider para autenticación
 * 3. ToastProvider para notificaciones
 * 
 * Ejemplo futuro en main.tsx:
 * <AuthProvider>
 *   <ToastProvider>
 *     <RouterProvider router={router} />
 *   </ToastProvider>
 * </AuthProvider>
 */