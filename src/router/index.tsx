import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from '../App';
import AuthLayout from '../layout/AuthLayout';

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
function NotFound() {
  return <div className="p-8">404 - Not Found</div>;
}

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

      // 📚 RUTAS PÚBLICAS DE POSTS (TEMPORALMENTE AQUÍ PARA DISEÑO)
      { path: 'posts', element: <PostList /> },
      { path: 'posts/new', element: <CreatePost /> }, // 👈 MOVIDA AQUÍ TEMPORALMENTE
      { path: 'posts/:id', element: <PostDetail /> }, // RUTA GENÉRICA (DEBE IR ÚLTIMA)


      // 🔒 Rutas protegidas (requieren autenticación)
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'profile', element: <Profile /> },

          // 👑 RUTAS DE ADMINISTRACIÓN (Se mantienen las rutas protegidas que sí necesitan permisos)
          {
            path: 'admin',
            children: [
              { // RUTA DE EDICIÓN (ESPECÍFICA: posts/:id/edit)
                path: 'posts/:id/edit',
                element: (
                  <AdminRoute>
                    <EditPost />
                  </AdminRoute>
                )
              },
              { // RUTA DE GESTIÓN DE USUARIOS
                path: 'users',
                element: (
                  <AdminRoute>
                    <UserManagement />
                  </AdminRoute>
                )
              }
            ]
          },
        ]
      },

      // ⚠️ Página 404
      { path: '*', element: <NotFound /> },
    ],
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;