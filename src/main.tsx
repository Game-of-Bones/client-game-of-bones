/**
 * Punto de entrada de la aplicación
 * 
 * - RouterProvider: maneja el enrutamiento
 * - globals.css: estilos globales + Tailwind CSS
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router/index.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import '../src/styles/globals.css';


/**
 * Renderiza la aplicación con React Router
 * 
 * Usando RouterProvider porque estamos usando createBrowserRouter
 * (data router de React Router v6.4+)
 */
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);

/**
 * NOTAS DE IMPLEMENTACIÓN FUTURA:
 * 
 * 1. Providers adicionales:
 *    Cuando implementes más contextos, envolver RouterProvider:
 *    
 *    <React.StrictMode>
 *      <AuthProvider>
 *        <ToastProvider>
 *          <RouterProvider router={router} />
 *        </ToastProvider>
 *      </AuthProvider>
 *    </React.StrictMode>
 * 
 *    NOTA: ThemeProvider ya está en App.tsx
 * 
 * 2. Error Boundary:
 *    Agregar error boundary para capturar errores globales
 * 
 * 3. Performance monitoring:
 *    - Integrar analytics (Google Analytics, Mixpanel)
 *    - Error tracking (Sentry)
 */