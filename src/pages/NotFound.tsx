// Página 404 - Ruta no encontrada

import { Link } from 'react-router-dom';

/**
 * NotFound - Página 404
 * 
 * Se muestra cuando el usuario accede a una ruta que no existe
 * 
 * Funcionalidad:
 * - Mensaje claro de error
 * - Botones para volver a rutas principales
 * - Diseño amigable y no intimidante
 */
const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        {/* Ilustración o emoji grande */}
        <div className="text-9xl mb-4">🦴</div>
        
        {/* Título con mensaje temático de Game of Bones */}
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          ¡Estos huesos no existen!
        </h2>
        
        {/* Mensaje descriptivo */}
        <p className="text-gray-600 mb-8">
          La página que buscas parece estar enterrada en capas geológicas inexploradas.
          Puede que haya sido un error de URL o que la página ya no exista.
        </p>

        {/* Botones de navegación */}
        <div className="space-y-4">
          <Link
            to="/"
            className="block w-full px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Volver al Inicio
          </Link>
          
          <Link
            to="/posts"
            className="block w-full px-6 py-3 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
          >
            Ver Todos los Posts
          </Link>
        </div>

        {/* TODO: Agregar búsqueda rápida */}
        {/*
        <div className="mt-8">
          <p className="text-sm text-gray-600 mb-2">¿Buscabas algo específico?</p>
          <input
            type="text"
            placeholder="Buscar posts..."
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        */}

        {/* TODO: Agregar sugerencias de contenido popular */}
        {/*
        <div className="mt-8 text-left">
          <p className="text-sm font-semibold text-gray-700 mb-2">
            Contenido popular:
          </p>
          <ul className="space-y-2">
            {popularPosts.map(post => (
              <li key={post.id}>
                <Link to={`/posts/${post.id}`} className="text-blue-600 hover:underline">
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        */}
      </div>
    </div>
  );
};

export default NotFound;

/**
 * NOTAS DE IMPLEMENTACIÓN FUTURA:
 * 
 * 1. Tracking de 404s:
 *    - Enviar evento a analytics cuando se carga esta página
 *    - Registrar la URL que causó el 404 para detectar enlaces rotos
 *    - Endpoint sugerido: POST /api/analytics/404
 * 
 * 2. Búsqueda desde 404:
 *    - Permitir al usuario buscar desde esta página
 *    - Sugerir resultados mientras escribe
 *    - Usar endpoint GET /api/posts?search=query
 * 
 * 3. Contenido sugerido:
 *    - Mostrar 3-5 posts más populares o recientes
 *    - Endpoint: GET /api/posts?limit=5&sort=popular
 * 
 * 4. Animaciones:
 *    - Fade in del contenido
 *    - Animación del emoji/ilustración
 *    - Usar Framer Motion o similar
 * 
 * 5. SEO:
 *    - Asegurar que retorna status code 404 real (importante para SEO)
 *    - Meta tags apropiadas
 */