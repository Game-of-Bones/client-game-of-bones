import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from '../App';
import AuthLayout from '../layout/AuthLayout';
import PostList from '../pages/PostList';

// Páginas de autenticación (sin Navbar, con Footer)
import Login from '../pages/Login';
import Register from '../pages/Register';

// Páginas principales (con Navbar y Footer)
import Home from '../pages/home';
import Profile from '../pages/Profile'; 
import PostList from '../pages/PostList';
import PostDetail from '../pages/PostDetail';

// Páginas de admin
import CreatePost from '../pages/CreatePost';
import EditPost from '../pages/EditPost';
import UserManagement from '../pages/UserManagement';

// HOCs de protección
import ProtectedRoute from '../components/auth/ProtectedRoute'; 
import AdminRoute from '../components/common/AdminRoute';

// NotFound temporal
import NotFound from '../pages/NotFound';

export const router = createBrowserRouter([
  // ============================================
  // RUTAS DE AUTENTICACIÓN (sin Navbar, con Footer y botón de tema)
  // ============================================
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/register',
        element: <Register />
      },
    ]
  },

  // ============================================
  // RUTAS PRINCIPALES (con Navbar y Footer)
  // ============================================
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },

      // 📚 RUTAS DE POSTS (SIN PROTECCIÓN TEMPORAL PARA TESTING)
      { path: 'posts', element: <PostList /> },
      
      // ✏️ CREAR POST (temporal sin protección)
      { path: 'posts/new', element: <CreatePost /> },
      
      // ✏️ EDITAR POST (temporal sin protección) - DEBE IR ANTES DE posts/:id
      { path: 'posts/:id/edit', element: <EditPost /> },
      
      // 📄 DETALLE DE POST - DEBE IR AL FINAL
      { path: 'posts/:id', element: <PostDetail /> },

      // 🔒 Rutas protegidas (requieren autenticación)
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'profile', element: <Profile /> },
        ]
      },

      // 👑 RUTAS DE ADMINISTRACIÓN (COMENTADAS TEMPORALMENTE)
      // Cuando quieras activar la protección, descomenta esto:
      /*
      {
        path: 'admin',
        children: [
          { 
            path: 'users',
            element: (
              <AdminRoute>
                <UserManagement />
              </AdminRoute>
            )
          }
        ]
      },
      */

      // ⚠️ Página 404
      { path: '*', element: <NotFound /> },
    ],
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;