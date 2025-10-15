// Página de lista de posts con filtros y búsqueda

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// TODO: Importar servicios cuando estén disponibles
// import { getPosts } from '../services/postService';

/**
 * PostList - Página de listado de posts
 * 
 * Funcionalidad:
 * - Mostrar todos los posts publicados (status: 'published')
 * - Filtrado por fossil_type
 * - Búsqueda por título/contenido
 * - Ordenamiento (recientes, más antiguos, por período geológico)
 * - Paginación
 * - Vista de tarjetas con preview
 */

// Tipos basados en el modelo Post del backend
interface Post {
  id: number;
  title: string;
  summary: string;
  post_content: string;
  image_url?: string | null;
  discovery_date?: Date | null;
  location?: string | null;
  paleontologist?: string | null;
  fossil_type: 'bones_teeth' | 'shell_exoskeletons' | 'plant_impressions' | 'tracks_traces' | 'amber_insects';
  geological_period?: string | null;
  author_id: number;
  status: 'draft' | 'published';
  source?: string | null;
  createdAt: Date;
  updatedAt: Date;
  author?: {
    id: number;
    username: string;
    // ... otros campos del User
  };
}

const PostList = () => {
  // Estado para los posts
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Estado para filtros
  const [filters, setFilters] = useState({
    search: '',
    fossilType: 'all' as 'all' | Post['fossil_type'],
    sortBy: 'newest' as 'newest' | 'oldest' | 'period'
  });

  // Estado para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const postsPerPage = 9;

  /**
   * Cargar posts desde el backend
   */
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError('');

      try {
        // TODO: Implementar cuando el servicio esté listo
        // const params = new URLSearchParams({
        //   page: currentPage.toString(),
        //   limit: postsPerPage.toString(),
        //   status: 'published',
        //   ...(filters.fossilType !== 'all' && { fossil_type: filters.fossilType }),
        //   ...(filters.search && { search: filters.search }),
        //   sort: filters.sortBy
        // });
        // const response = await getPosts(params);
        // setPosts(response.data);
        // setTotalPages(response.totalPages);

        // MOCK temporal - ELIMINAR cuando el servicio esté listo
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const mockPosts: Post[] = [
          {
            id: 1,
            title: "Descubrimiento del Tyrannosaurus Rex",
            summary: "Uno de los hallazgos más importantes en paleontología",
            post_content: "Contenido completo del post...",
            image_url: "https://via.placeholder.com/400x200",
            discovery_date: new Date('1990-08-12'),
            location: "Hell Creek Formation, Montana",
            paleontologist: "Barnum Brown",
            fossil_type: "bones_teeth",
            geological_period: "Cretácico Superior",
            author_id: 1,
            status: "published",
            createdAt: new Date(),
            updatedAt: new Date(),
            author: { id: 1, username: "paleofan" }
          },
          // ... más posts mock
        ];
        
        setPosts(mockPosts);
        setTotalPages(3);

      } catch (err: any) {
        setError(err.message || 'Error al cargar los posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage, filters]);

  /**
   * Manejar cambio en búsqueda
   */
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, search: e.target.value });
    setCurrentPage(1); // Reset a primera página
  };

  /**
   * Manejar cambio en filtro de tipo de fósil
   */
  const handleFossilTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, fossilType: e.target.value as any });
    setCurrentPage(1);
  };

  /**
   * Manejar cambio en ordenamiento
   */
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, sortBy: e.target.value as any });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header con título y búsqueda */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Explora Descubrimientos Fósiles</h1>
        
        {/* Barra de búsqueda */}
        <div className="max-w-2xl">
          <input
            type="text"
            placeholder="Buscar posts por título, ubicación, paleontólogo..."
            value={filters.search}
            onChange={handleSearchChange}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Filtros y ordenamiento */}
      <div className="flex flex-wrap gap-4 mb-6">
        {/* Filtro por tipo de fósil */}
        <div>
          <label className="block text-sm font-medium mb-1">Tipo de Fósil</label>
          <select
            value={filters.fossilType}
            onChange={handleFossilTypeChange}
            className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todos</option>
            <option value="bones_teeth">Huesos y Dientes</option>
            <option value="shell_exoskeletons">Conchas y Exoesqueletos</option>
            <option value="plant_impressions">Impresiones de Plantas</option>
            <option value="tracks_traces">Huellas y Rastros</option>
            <option value="amber_insects">Insectos en Ámbar</option>
          </select>
        </div>

        {/* Ordenamiento */}
        <div>
          <label className="block text-sm font-medium mb-1">Ordenar por</label>
          <select
            value={filters.sortBy}
            onChange={handleSortChange}
            className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">Más Recientes</option>
            <option value="oldest">Más Antiguos</option>
            <option value="period">Período Geológico</option>
          </select>
        </div>
      </div>

      {/* Mostrar error si existe */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="border rounded-lg p-4 animate-pulse">
              <div className="bg-gray-300 h-48 rounded mb-4"></div>
              <div className="bg-gray-300 h-6 rounded mb-2"></div>
              <div className="bg-gray-300 h-4 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Grid de posts */}
          {posts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map(post => (
                <article key={post.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition">
                  {/* Imagen */}
                  {post.image_url && (
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  
                  {/* Contenido */}
                  <div className="p-4">
                    {/* Badges */}
                    <div className="flex gap-2 mb-2">
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                        {post.fossil_type.replace('_', ' ')}
                      </span>
                      {post.geological_period && (
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
                          {post.geological_period}
                        </span>
                      )}
                    </div>

                    {/* Título */}
                    <Link to={`/posts/${post.id}`}>
                      <h2 className="text-xl font-semibold mb-2 hover:text-blue-600 transition">
                        {post.title}
                      </h2>
                    </Link>

                    {/* Summary */}
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {post.summary}
                    </p>

                    {/* Metadata */}
                    <div className="text-xs text-gray-500 space-y-1">
                      {post.location && (
                        <p>📍 {post.location}</p>
                      )}
                      {post.paleontologist && (
                        <p>👤 {post.paleontologist}</p>
                      )}
                      {post.author && (
                        <p>✍️ Por {post.author.username}</p>
                      )}
                    </div>

                    {/* Botón leer más */}
                    <Link
                      to={`/posts/${post.id}`}
                      className="mt-4 inline-block text-blue-600 hover:underline text-sm font-medium"
                    >
                      Leer más →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No se encontraron posts con estos filtros</p>
              <button
                onClick={() => setFilters({ search: '', fossilType: 'all', sortBy: 'newest' })}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Limpiar filtros
              </button>
            </div>
          )}

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Anterior
              </button>
              
              <span className="px-4 py-2">
                Página {currentPage} de {totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PostList;

/**
 * NOTAS DE IMPLEMENTACIÓN FUTURA:
 * 
 * 1. Endpoint del backend (GET /api/posts):
 *    Query params:
 *    - page: número de página
 *    - limit: posts por página
 *    - status: 'published' (solo mostrar publicados)
 *    - fossil_type: filtrar por tipo
 *    - search: búsqueda en título/contenido/location/paleontologist
 *    - sort: 'newest', 'oldest', 'period'
 *    
 *    Respuesta esperada:
 *    {
 *      data: Post[],
 *      page: number,
 *      totalPages: number,
 *      totalPosts: number
 *    }
 * 
 * 2. Servicio de posts (src/services/postService.ts):
 *    export const getPosts = async (params: URLSearchParams) => {
 *      const response = await fetch(`/api/posts?${params}`);
 *      if (!response.ok) throw new Error('Failed to fetch posts');
 *      return response.json();
 *    };
 * 
 * 3. Mejoras de UX:
 *    - Debounce en el buscador (esperar 500ms después de que deje de escribir)
 *    - Scroll to top al cambiar de página
 *    - Skeleton loading más bonito
 *    - Animaciones de entrada con Framer Motion
 * 
 * 4. Filtros avanzados:
 *    - Rango de fechas de descubrimiento
 *    - Filtro por período geológico
 *    - Filtro por continente/país
 * 
 * 5. Vista alternativa:
 *    - Botón para cambiar entre vista de grid y vista de lista
 *    - Vista de mapa mostrando ubicaciones
 * 
 * 6. Favoritos:
 *    - Permitir marcar posts como favoritos (requiere autenticación)
 *    - Botón de corazón en cada tarjeta
 * 
 * 7. Compartir:
 *    - Botones para compartir en redes sociales
 *    - Copy link to clipboard
 * 
 * 8. Performance:
 *    - Implementar infinite scroll como alternativa a paginación
 *    - Lazy loading de imágenes
 *    - Cache de resultados de búsqueda
 */


