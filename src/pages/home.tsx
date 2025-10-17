import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BookOpen, Sparkles } from 'lucide-react';
import MapComponent from '../components/ui/MapComponent';
import CreatePostButton from '../components/ui/CreatePostButton';
import { getAllPosts } from '../services/postService';

// Definimos el tipo Post basado en lo que REALMENTE devuelve tu API
interface Post {
  post_id: number;
  title: string;
  content: string;
  summary?: string;
  image_url?: string;
  images?: string[];  // Por si acaso tu API devuelve un array
  created_at: string;
  status: string;
  fossil_type?: string;
  location?: string;
  paleontologist?: string;
}

const Home = () => {
  const navigate = useNavigate();
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Obtener posts recientes
  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const data = await getAllPosts({ 
          status: 'published', 
          page: 1, 
          limit: 6 
        });
        
        // ✅ CORRECCIÓN: Asegurarnos de que data.posts existe
        if (data && data.posts) {
          setRecentPosts(data.posts);
          console.log('Posts cargados:', data.posts);
        } else {
          console.warn('No se encontraron posts en la respuesta');
          setRecentPosts([]);
        }
      } catch (error) {
        console.error('Error al cargar posts:', error);
        setRecentPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentPosts();
  }, []);

  // Auto-scroll del carousel
  useEffect(() => {
    if (recentPosts.length <= 3) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.max(1, recentPosts.length - 2));
    }, 5000);

    return () => clearInterval(interval);
  }, [recentPosts.length]);

  const handlePostClick = (postId: number) => {
    navigate(`/posts/${postId}`);
  };

  // ✅ Función helper para obtener la imagen del post
  const getPostImage = (post: Post): string | null => {
    // Prioridad: image_url > images[0] > null
    if (post.image_url) return post.image_url;
    if (post.images && post.images.length > 0) return post.images[0];
    return null;
  };

  return (
    <div className="container mx-auto px-4 py-8 relative">
      {/* Botón Crear Post */}
      <CreatePostButton variant="fixed" />

      {/* Mapa */}
      <section className="mb-12" style={{ minHeight: '800px' }}>
        <h2 
          className="text-4xl font-bold mb-6 text-center uppercase tracking-widest"
          style={{ 
            fontFamily: 'Cinzel, serif',
            color: 'var(--text-primary)',
            letterSpacing: '0.1em'
          }}
        >
          MAPA DE DESCUBRIMIENTOS
        </h2>
        <MapComponent />
      </section>

      {/* Carousel de Posts Recientes */}
      <section className="mb-12">
        <h2 
          className="text-3xl font-bold mb-8 text-center"
          style={{ 
            fontFamily: 'Cinzel, serif',
            color: 'var(--text-primary)'
          }}
        >
          Últimos Descubrimientos
        </h2>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div 
              className="animate-spin rounded-full h-12 w-12 border-b-2" 
              style={{ borderColor: '#8DAA91' }}
            ></div>
          </div>
        ) : recentPosts.length === 0 ? (
          <div className="text-center py-12">
            <p style={{ color: 'var(--text-secondary)' }} className="text-lg">
              No hay posts disponibles todavía
            </p>
          </div>
        ) : (
          <div className="relative px-12">
            {/* Carousel Container */}
            <div className="overflow-hidden rounded-xl">
              <div 
                className="flex transition-transform duration-700 ease-in-out"
                style={{ 
                  transform: `translateX(-${currentIndex * (100 / Math.min(recentPosts.length, 3))}%)`,
                  gap: '1.5rem'
                }}
              >
                {recentPosts.map((post) => {
                  const imageUrl = getPostImage(post);
                  
                  return (
                    <div
                      key={post.post_id}
                      onClick={() => handlePostClick(post.post_id)}
                      className="cursor-pointer group flex-shrink-0"
                      style={{ 
                        width: recentPosts.length >= 3 ? 'calc(33.333% - 1rem)' : 'calc(50% - 0.75rem)',
                        minWidth: recentPosts.length >= 3 ? 'calc(33.333% - 1rem)' : 'calc(50% - 0.75rem)'
                      }}
                    >
                      <div 
                        className="relative h-96 rounded-xl overflow-hidden shadow-lg transition-all duration-300"
                        style={{
                          border: '1px solid rgba(141, 170, 145, 0.3)',
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          backdropFilter: 'blur(10px)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.03) translateY(-8px)';
                          e.currentTarget.style.boxShadow = '0 20px 40px rgba(29, 67, 66, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1) translateY(0)';
                          e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
                        }}
                      >
                        {/* Imagen o placeholder */}
                        {imageUrl ? (
                          <img 
                            src={imageUrl} 
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div 
                            className="w-full h-full flex items-center justify-center"
                            style={{
                              background: 'linear-gradient(135deg, rgba(141, 170, 145, 0.2) 0%, rgba(29, 67, 66, 0.2) 100%)'
                            }}
                          >
                            <BookOpen size={80} style={{ opacity: 0.3, color: '#8DAA91' }} />
                          </div>
                        )}
                        
                        {/* Overlay con información */}
                        <div 
                          className="absolute inset-0 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{
                            background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 50%, transparent 100%)'
                          }}
                        >
                          <h3 className="text-white text-xl font-bold mb-2" style={{ fontFamily: 'Cinzel, serif' }}>
                            {post.title}
                          </h3>
                          <p className="text-white/90 text-sm line-clamp-2 mb-2">
                            {post.summary || post.content?.substring(0, 100) || 'Sin descripción'}...
                          </p>
                          <span className="text-white/70 text-xs">
                            📅 {new Date(post.created_at).toLocaleDateString('es-ES')}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Botones de navegación */}
            {recentPosts.length > 3 && (
              <>
                <button
                  onClick={() => setCurrentIndex(prev => 
                    prev === 0 ? Math.max(0, recentPosts.length - 3) : prev - 1
                  )}
                  className="absolute left-0 top-1/2 -translate-y-1/2 p-3 rounded-full shadow-xl transition-all duration-300"
                  style={{
                    backgroundColor: 'rgba(141, 170, 145, 0.9)',
                    color: 'white',
                    border: '2px solid #1D4342'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                    e.currentTarget.style.backgroundColor = '#8DAA91';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                    e.currentTarget.style.backgroundColor = 'rgba(141, 170, 145, 0.9)';
                  }}
                >
                  ←
                </button>
                <button
                  onClick={() => setCurrentIndex(prev => 
                    (prev + 1) % Math.max(1, recentPosts.length - 2)
                  )}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-3 rounded-full shadow-xl transition-all duration-300"
                  style={{
                    backgroundColor: 'rgba(141, 170, 145, 0.9)',
                    color: 'white',
                    border: '2px solid #1D4342'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                    e.currentTarget.style.backgroundColor = '#8DAA91';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                    e.currentTarget.style.backgroundColor = 'rgba(141, 170, 145, 0.9)';
                  }}
                >
                  →
                </button>
              </>
            )}
          </div>
        )}
      </section>

      {/* Features con Links */}
      <section className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Banner 1 - Link a CREAR POST */}
        <Link 
          to="/posts/new"
          className="group relative p-8 rounded-2xl text-center backdrop-blur-sm border-2 transition-all duration-300 overflow-hidden block"
          style={{
            background: 'linear-gradient(135deg, rgba(141, 170, 145, 0.1) 0%, rgba(29, 67, 66, 0.1) 100%)',
            borderColor: 'rgba(141, 170, 145, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.borderColor = 'rgba(141, 170, 145, 0.6)';
            e.currentTarget.style.boxShadow = '0 20px 40px rgba(29, 67, 66, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.borderColor = 'rgba(141, 170, 145, 0.3)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: 'linear-gradient(135deg, rgba(141, 170, 145, 0.05) 0%, transparent 100%)'
            }}
          ></div>
          <div className="relative z-10">
            <div 
              className="inline-block p-4 rounded-full mb-4 transition-transform duration-300 group-hover:scale-110"
              style={{
                backgroundColor: 'rgba(141, 170, 145, 0.2)'
              }}
            >
              <BookOpen size={40} style={{ color: '#8DAA91' }} />
            </div>
            <h3 
              className="text-2xl font-bold mb-3" 
              style={{ 
                fontFamily: 'Cinzel, serif',
                color: 'var(--text-primary)'
              }}
            >
              Publica Descubrimientos
            </h3>
            <p style={{ color: 'var(--text-secondary)' }} className="text-lg">
              Comparte las últimas noticias sobre descubrimientos paleontológicos del mundo
            </p>
          </div>
        </Link>

        {/* Banner 2 - Link a LISTA DE POSTS */}
        <Link 
          to="/posts"
          className="group relative p-8 rounded-2xl text-center backdrop-blur-sm border-2 transition-all duration-300 overflow-hidden block"
          style={{
            background: 'linear-gradient(135deg, rgba(29, 67, 66, 0.1) 0%, rgba(141, 170, 145, 0.1) 100%)',
            borderColor: 'rgba(29, 67, 66, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.borderColor = 'rgba(29, 67, 66, 0.6)';
            e.currentTarget.style.boxShadow = '0 20px 40px rgba(141, 170, 145, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.borderColor = 'rgba(29, 67, 66, 0.3)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: 'linear-gradient(135deg, rgba(29, 67, 66, 0.05) 0%, transparent 100%)'
            }}
          ></div>
          <div className="relative z-10">
            <div 
              className="inline-block p-4 rounded-full mb-4 transition-transform duration-300 group-hover:scale-110"
              style={{
                backgroundColor: 'rgba(29, 67, 66, 0.2)'
              }}
            >
              <Sparkles size={40} style={{ color: '#1D4342' }} />
            </div>
            <h3 
              className="text-2xl font-bold mb-3" 
              style={{ 
                fontFamily: 'Cinzel, serif',
                color: 'var(--text-primary)'
              }}
            >
              Explora el Pasado
            </h3>
            <p style={{ color: 'var(--text-secondary)' }} className="text-lg">
              Descubre fósiles increíbles y aprende sobre la historia de la vida en la Tierra
            </p>
          </div>
        </Link>
      </section>
    </div>
  );
};

export default Home;