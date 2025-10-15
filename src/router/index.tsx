import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from '../App';
import AuthLayout from '../layout/AuthLayout';

// Páginas de autenticación (sin Navbar, con Footer)
import Login from '../pages/Login';
import Register from '../pages/Register';

// Páginas principales (con Navbar y Footer)
import Home from '../pages/home';
import PostList from '../pages/PostList';
import PostDetail from '../pages/PostDetail';
import Creators from '../pages/Creators';
import Profile from '../pages/Profile';

// Páginas de admin
import CreatePost from '../pages/CreatePost';
import EditPost from '../pages/EditPost';
import UserManagement from '../pages/UserManagement';

// Página 404
import NotFound from '../pages/NotFound';

// HOCs de protección
import ProtectedRoute from '../pages/ProtectedRoute';
import AdminRoute from '../components/common/AdminRoute';

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
      // 🏠 HOME - Página principal
      { index: true, element: <Home /> },

      // 📝 POSTS - Lista de posts (enlazado con "POSTS" en Navbar)
      { path: 'posts', element: <PostList /> },

      // 📄 POST DETAIL - Detalle de un post individual
      { path: 'posts/:id', element: <PostDetail /> },

      // 👥 CREATORS - Sobre nosotros (enlazado con "ABOUT" en Navbar)
      { path: 'creators', element: <Creators /> },

      // 🔒 RUTAS PROTEGIDAS (requieren autenticación)
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'profile', element: <Profile /> },
        ]
      },

      // 🔒 RUTAS DE ADMINISTRACIÓN (requieren rol admin)
      {
        path: 'admin',
        children: [
          {
            path: 'posts/new',
            element: (
              <AdminRoute>
                <CreatePost />
              </AdminRoute>
            )
          },
          {
            path: 'posts/:id/edit',
            element: (
              <AdminRoute>
                <EditPost />
              </AdminRoute>
            )
          },
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

      // ⚠️ Página 404 - Cualquier ruta no encontrada
      { path: '*', element: <NotFound /> },
    ],
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;