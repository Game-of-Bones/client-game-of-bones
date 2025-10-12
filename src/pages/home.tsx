// Página principal / Landing page de la aplicación

import { Link } from 'react-router-dom';

/**
 * Home - Página principal de Game of Bones
 * 
 * Contenido sugerido para el futuro:
 * - Hero section con mensaje de bienvenida
 * - Lista de posts destacados (últimos 3-5 posts)
 * - Estadísticas de la comunidad (total posts, usuarios, etc)
 * - Call to action para registrarse
 */
const Home = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center py-12 bg-gray-100 rounded-lg mb-8">
        <h1 className="text-4xl font-bold mb-4">
          Bienvenido a Game of Bones
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Comparte y descubre historias épicas
        </p>
        <div className="space-x-4">
          <Link
            to="/posts"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Ver Posts
          </Link>
          <Link
            to="/register"
            className="inline-block px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Únete Ahora
          </Link>
        </div>
      </section>

      {/* Sección de Features */}
      <section className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 border rounded-lg text-center">
          <h3 className="text-xl font-semibold mb-2">📝 Crea Posts</h3>
          <p className="text-gray-600">
            Comparte tus historias con la comunidad
          </p>
        </div>
        <div className="p-6 border rounded-lg text-center">
          <h3 className="text-xl font-semibold mb-2">💬 Comenta</h3>
          <p className="text-gray-600">
            Participa en discusiones interesantes
          </p>
        </div>
        <div className="p-6 border rounded-lg text-center">
          <h3 className="text-xl font-semibold mb-2">⭐ Explora</h3>
          <p className="text-gray-600">
            Descubre contenido increíble
          </p>
        </div>
      </section>

      {/* TODO: Agregar sección de posts destacados */}
      {/* 
      <section>
        <h2 className="text-2xl font-bold mb-4">Posts Destacados</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>
      */}

      {/* TODO: Agregar sección de estadísticas */}
      {/*
      <section className="mt-8 p-6 bg-gray-100 rounded-lg">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-3xl font-bold">{stats.totalPosts}</p>
            <p className="text-gray-600">Posts Publicados</p>
          </div>
          <div>
            <p className="text-3xl font-bold">{stats.totalUsers}</p>
            <p className="text-gray-600">Usuarios Activos</p>
          </div>
          <div>
            <p className="text-3xl font-bold">{stats.totalComments}</p>
            <p className="text-gray-600">Comentarios</p>
          </div>
        </div>
      </section>
      */}
    </div>
  );
};

export default Home;

/**
 * NOTAS DE IMPLEMENTACIÓN FUTURA:
 * 
 * 1. Posts destacados:
 *    - Llamar al endpoint GET /posts?limit=5&sort=popular
 *    - Usar un componente PostCard reutilizable
 *    - Agregar skeleton loading mientras carga
 * 
 * 2. Estadísticas:
 *    - Crear endpoint en backend GET /stats que devuelva:
 *      { totalPosts, totalUsers, totalComments }
 *    - Actualizar en tiempo real o con polling
 * 
 * 3. Animaciones:
 *    - Usar Framer Motion para animaciones suaves
 *    - Fade in de secciones al hacer scroll
 * 
 * 4. SEO:
 *    - Agregar meta tags apropiadas
 *    - Considerar usar React Helmet para manejar <head>
 */