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
import Creators from '../pages/Creators'; // ⬅️ NUEVA IMPORTACIÓN

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
  // RUTAS DE AUTENTICACIÓN (sin Navbar, con Footer)
  // Backend: POST /api/auth/login y POST /api/auth/register
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
      { 
        index: true, 
        element: <Home /> 
      },

      // ============================================
      // 📚 RUTAS DE POSTS
      // Backend: GET /api/posts
      // ============================================
      { 
        path: 'posts', 
        element: <PostList /> 
      },
      
      // ============================================
      // 📄 DETALLE DE POST (público)
      // Backend: GET /api/posts/:id
      // ============================================
      { 
        path: 'posts/:id', 
        element: <PostDetail /> 
      },

      // ============================================
      // 🔒 RUTAS PROTEGIDAS (requieren autenticación)
      // ============================================
      {
        element: <ProtectedRoute />,
        children: [
          // ✏️ CREAR POST
          // Backend: POST /api/posts (requiere verifyToken)
          { 
            path: 'posts/new',
            element: <CreatePost />
          },
          
          // ✏️ EDITAR POST
          // Backend: PUT /api/posts/:id (requiere verifyToken + ser autor o admin)
          { 
            path: 'posts/:id/edit',
            element: <EditPost />
          },

          // 👤 PERFIL DE USUARIO
          {
            path: 'profile',
            element: <Profile />
          },

          // ============================================
          // 👑 RUTAS DE ADMINISTRACIÓN (requieren rol admin)
          // ============================================
          {
            path: 'admin',
            element: <AdminRoute />,
            children: [
              { 
                path: 'users',
                element: <UserManagement />
              }
            ]
          },
        ]
      },

      // ============================================
      // ⚠️ Página 404
      // ============================================
      { 
        path: '*', 
        element: <NotFound /> 
      },
    ],
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;