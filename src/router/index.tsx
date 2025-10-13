// // Este archivo centraliza toda la configuración de rutas de la aplicación

// import { createBrowserRouter, RouterProvider } from 'react-router-dom';
// import App from '../App';

// // Importar páginas públicas
// import Home from '../pages/home';
// import Login from '../pages/Login';
// import Register from '../pages/Register';
// // import PostList from '../pages/';
// // import PostDetail from '../pages/';
// // import NotFound from '../pages/NotFound';

// // Importar páginas protegidas
// import Profile from '../pages/Profile';

// // Importar páginas de administrador
// import CreatePost from '../pages/CreatePost';
// // import EditPost from '../pages/EditPost';
// // import UserManagement from '../pages/UserManagement';

// // Importar componentes de protección de rutas
// import ProtectedRoute from '../components/common/ProtectedRoute';
// // import AdminRoute from '../components/common/AdminRoute';

// /**
//  * Configuración de rutas de la aplicación usando React Router v6
//  *
//  * Estructura:
//  * - Rutas públicas: accesibles sin autenticación
//  * - Rutas protegidas: requieren autenticación (ProtectedRoute)
//  * - Rutas admin: requieren rol de administrador (AdminRoute)
//  */
// export const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <App />, // Layout principal con Navbar y Outlet para renderizar rutas hijas
//     // errorElement: <NotFound />, // Captura errores de navegación
//     children: [
//       // ============ RUTAS PÚBLICAS ============
//       {
//         index: true, // Ruta principal '/'
//         element: <Home />
//       },
//       {
//         path: 'login',
//         element: <Login />
//       },
//       {
//         path: 'register',
//         element: <Register />
//       },
//       {
//         path: 'posts',
//         element: <PostList />
//       },
//       {
//         path: 'posts/:id', // Parámetro dinámico para el ID del post
//         element: <PostDetail />
//       },

//       // ============ RUTAS PROTEGIDAS (requieren autenticación) ============
//       {
//         path: 'profile',
//         element: (
//           <ProtectedRoute>
//             <Profile />
//           </ProtectedRoute>
//         )
//       },

//       // ============ RUTAS DE ADMINISTRADOR ============
//       {
//         path: 'admin',
//         children: [
//           {
//             path: 'posts/new',
//             element: (
//               <AdminRoute>
//                 <CreatePost />
//               </AdminRoute>
//             )
//           },
//           {
//             path: 'posts/:id/edit',
//             element: (
//               <AdminRoute>
//                 <EditPost />
//               </AdminRoute>
//             )
//           },
//           {
//             path: 'users',
//             element: (
//               <AdminRoute>
//                 <UserManagement />
//               </AdminRoute>
//             )
//           }
//         ]
//       },

//       // ============ RUTA 404 ============
//       {
//         path: '*', // Captura todas las rutas no definidas
//         element: <NotFound />
//       }
//     ]
//   }
// ]);

// /**
//  * Componente que provee el router a toda la aplicación
//  * Este será usado en main.tsx en lugar de App directamente
//  */
// export const AppRouter = () => {
//   return <RouterProvider router={router} />;
// };
// src/router/index.tsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from '../App';

// Páginas existentes
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';

// (Temporal) NotFound mínimo
function NotFound() {
  return <div className="p-8">404 - Not Found</div>;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },

      // 🔒 Cuando tengas estos componentes, los descomentas:
      // { path: 'posts', element: <PostList /> },
      // { path: 'posts/:id', element: <PostDetail /> },
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

      { path: '*', element: <NotFound /> },
    ],
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
