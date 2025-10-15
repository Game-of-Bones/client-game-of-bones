import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from '../App';
import AuthLayout from '../layout/AuthLayout';

// Páginas de autenticación (sin Navbar, con Footer)
import Login from '../pages/Login';
import Register from '../pages/Register';

// Páginas principales (con Navbar y Footer)
import Home from '../pages/home';
import PostDetail from '../pages/PostDetail';

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

      // 🦴 Página de detalle de post
      { path: 'posts/:id', element: <PostDetail /> },

      // 🔒 Rutas futuras (descomenta cuando las tengas):
      // { path: 'posts', element: <PostList /> },
      // {
      //   path: 'profile',
      //   element: (
      //     <ProtectedRoute>
      //       <Profile />
      //     </ProtectedRoute>
      //   ),
      // },
      // {
      //   path: 'admin',
      //   children: [
      //     {
      //       path: 'posts/new',
      //       element: (
      //         <AdminRoute>
      //           <CreatePost />
      //         </AdminRoute>
      //       )
      //     },
      //     {
      //       path: 'posts/:id/edit',
      //       element: (
      //         <AdminRoute>
      //           <EditPost />
      //         </AdminRoute>
      //       )
      //     },
      //     {
      //       path: 'users',
      //       element: (
      //         <AdminRoute>
      //           <UserManagement />
      //         </AdminRoute>
      //       )
      //     }
      //   ]
      // },

      // ⚠️ Página 404
      { path: '*', element: <NotFound /> },
    ],
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
