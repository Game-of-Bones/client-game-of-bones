// Punto de entrada de la aplicación

import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router/index.tsx';
import './index.css';

/**
 * Renderiza la aplicación con React Router
 * 
 * Usando RouterProvider en lugar de BrowserRouter porque estamos
 * usando createBrowserRouter (data router de React Router v6.4+)
 */
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

/**
 * NOTAS DE IMPLEMENTACIÓN FUTURA:
 * 
 * 1. Providers adicionales:
 *    Cuando implementes los contextos, envolver RouterProvider:
 *    
 *    <React.StrictMode>
 *      <AuthProvider>
 *        <ThemeProvider>
 *          <RouterProvider router={router} />
 *        </ThemeProvider>
 *      </AuthProvider>
 *    </React.StrictMode>
 * 
 * 2. Error Boundary:
 *    Agregar error boundary para capturar errores globales
 * 
 * 3. Performance monitoring:
 *    - Integrar analytics (Google Analytics, Mixpanel)
 *    - Error tracking (Sentry)
 */

