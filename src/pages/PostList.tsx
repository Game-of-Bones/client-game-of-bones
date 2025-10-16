import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePostStore } from '../stores/postStore';
import type { Post, FossilType } from '../types/post.types';

const PostList = () => {
  const { posts, isLoading, error, fetchPosts } = usePostStore();

  const [filters, setFilters] = useState({
    search: '',
    fossilType: 'all' as 'all' | FossilType,
    status: 'published' as const,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;

  // Cargar posts al montar el componente
  useEffect(() => {
    fetchPosts({
      status: 'published',
      page: currentPage,
      limit: postsPerPage,
      ...(filters.fossilType !== 'all' && { fossil_type: filters.fossilType }),
    });
  }, [currentPage, filters.fossilType]);

  // Filtrado local por búsqueda (porque el backend puede no tenerlo implementado)
  const filteredPosts = posts.filter(post => {
    if (!filters.search) return true;
    
    const searchLower = filters.search.toLowerCase();
    return (
      post.title.toLowerCase().includes(searchLower) ||
      post.summary.toLowerCase().includes(searchLower) ||
      post.location?.toLowerCase().includes(searchLower) ||
      post.paleontologist?.toLowerCase().includes(searchLower)
    );
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, search: e.target.value });
  };

  const handleFossilTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, fossilType: e.target.value as any });
    setCurrentPage(1);
  };

  const fossilTypeLabels = {
    bones_teeth: 'Huesos y Dientes',
    shell_exoskeletons: 'Conchas y Exoesqueletos',
    plant_impressions: 'Impresiones de Plantas',
    tracks_traces: 'Huellas y Rastros',
    amber_insects: 'Insectos en Ámbar'
  };

  return (
    <div className="min-h-screen py-8" style={{ fontFamily: "'Playfair Display', serif" }}>
      <div className="container mx-auto px-4">
        
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: '#FFFFFF' }}>
            Explora Descubrimientos Fósiles
          </h1>
          
          {/* Búsqueda */}
          <div className="max-w-2xl">
            <input
              type="text"
              placeholder="Buscar por título, ubicación, paleontólogo..."
              value={filters.search}
              onChange={handleSearchChange}
              className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
              style={{
                backgroundColor: 'rgba(139, 107, 77, 0.3)',
                color: '#FFFFFF',
                borderColor: 'rgba(201, 168, 117, 0.3)',
              }}
            />
          </div>
        </div>

        {/* FILTROS */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#C9A875' }}>
              Tipo de Fósil
            </label>
            <select
              value={filters.fossilType}
              onChange={handleFossilTypeChange}
              className="px-4 py-2 rounded focus:outline-none focus:ring-2"
              style={{
                backgroundColor: 'rgba(139, 107, 77, 0.3)',
                color: '#FFFFFF',
                borderColor: 'rgba(201, 168, 117, 0.3)',
              }}
            >
              <option value="all">Todos</option>
              <option value="bones_teeth">Huesos y Dientes</option>
              <option value="shell_exoskeletons">Conchas y Exoesqueletos</option>
              <option value="plant_impressions">Impresiones de Plantas</option>
              <option value="tracks_traces">Huellas y Rastros</option>
              <option value="amber_insects">Insectos en Ámbar</option>
            </select>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-500/20 border border-red-400 text-red-200 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* LOADING */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="rounded-lg p-4 animate-pulse" style={{ backgroundColor: 'rgba(139, 107, 77, 0.2)' }}>
                <div className="bg-gray-600/30 h-48 rounded mb-4"></div>
                <div className="bg-gray-600/30 h-6 rounded mb-2"></div>
                <div className="bg-gray-600/30 h-4 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* GRID DE POSTS */}
            {filteredPosts.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map(post => (
                  <article 
                    key={post.id} 
                    className="rounded-lg overflow-hidden hover:shadow-lg transition"
                    style={{ backgroundColor: 'rgba(139, 107, 77, 0.3)' }}
                  >
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
                      {/* Badge */}
                      <div className="flex gap-2 mb-2">
                        <span 
                          className="text-xs px-2 py-1 rounded"
                          style={{ backgroundColor: 'rgba(72, 169, 166, 0.3)', color: '#48a9a6' }}
                        >
                          {fossilTypeLabels[post.fossil_type]}
                        </span>
                        {post.geological_period && (
                          <span 
                            className="text-xs px-2 py-1 rounded"
                            style={{ backgroundColor: 'rgba(141, 170, 145, 0.3)', color: '#8DAA91' }}
                          >
                            {post.geological_period}
                          </span>
                        )}
                      </div>

                      {/* Título */}
                      <Link to={`/posts/${post.id}`}>
                        <h2 className="text-xl font-semibold mb-2 hover:opacity-80 transition" style={{ color: '#FFFFFF' }}>
                          {post.title}
                        </h2>
                      </Link>

                      {/* Summary */}
                      <p className="text-sm mb-3 line-clamp-2" style={{ color: '#E8D9B8' }}>
                        {post.summary}
                      </p>

                      {/* Metadata */}
                      <div className="text-xs space-y-1" style={{ color: '#C9A875' }}>
                        {post.location && <p>📍 {post.location}</p>}
                        {post.paleontologist && <p>👤 {post.paleontologist}</p>}
                        {post.author && <p>✍️ Por {post.author.username}</p>}
                      </div>

                      {/* Botón */}
                      <Link
                        to={`/posts/${post.id}`}
                        className="mt-4 inline-block text-sm font-medium hover:underline"
                        style={{ color: '#48a9a6' }}
                      >
                        Leer más →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg mb-4" style={{ color: '#E8D9B8' }}>
                  No se encontraron posts
                </p>
                <button
                  onClick={() => setFilters({ search: '', fossilType: 'all', status: 'published' })}
                  className="px-6 py-2 rounded-full transition hover:scale-105"
                  style={{ backgroundColor: '#48a9a6', color: '#FFFFFF' }}
                >
                  Limpiar filtros
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PostList;
