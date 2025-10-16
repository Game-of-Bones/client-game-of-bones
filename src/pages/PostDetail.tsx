import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Heart, MessageCircle, ChevronDown, Trash2, Edit2 } from 'lucide-react';
import { getPostById, deletePost } from '../services';
import type { Post } from '../types/post.types';

// Modal de confirmación (mantén el componente DeleteConfirmModal igual)
const DeleteConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, isDeleting }: any) => {
  if (!isOpen) return null;
  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(29, 67, 66, 0.67)' }}
      onClick={onCancel}
    >
      <div 
        className="rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
        style={{ backgroundColor: 'rgba(29, 67, 66, 0.95)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center mb-6">
          <div className="w-32 h-32 relative">
            <img 
              src="/Triceratops_Skull_in_Earthy_Brown.png" 
              alt="Triceratops Skull" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>
        
        <h3 
          className="text-2xl sm:text-3xl font-bold text-center mb-3"
          style={{ fontFamily: "'Playfair Display', serif", color: '#FFFFFF' }}
        >
          {title}
        </h3>
        
        <p 
          className="text-center mb-8 text-base sm:text-lg"
          style={{ fontFamily: "'Playfair Display', serif", color: '#FFFFFF' }}
        >
          {message}
        </p>
        
        <div className="flex justify-center gap-4">
          <button 
            onClick={onCancel} 
            disabled={isDeleting}
            className="py-3 px-8 rounded-full text-white font-semibold transition-all hover:scale-105"
            style={{ backgroundColor: '#F76C5E', fontFamily: "'Playfair Display', serif" }}
          >
            Cancelar
          </button>
          <button 
            onClick={onConfirm} 
            disabled={isDeleting}
            className="py-3 px-8 rounded-full text-white font-semibold transition-all hover:scale-105"
            style={{ backgroundColor: '#8DAA91', fontFamily: "'Playfair Display', serif" }}
          >
            {isDeleting ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
};

const PostDetail = () => {
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [moreInfoOpen, setMoreInfoOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const fetchedPost = await getPostById(Number(id));
      console.log('✅ Post obtenido:', fetchedPost);
      setPost(fetchedPost);
    } catch (err: any) {
      console.error('❌ Error al obtener el post:', err);
      setError(err.message || 'No se pudo cargar el post');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePost = async () => {
    setIsDeleting(true);
    try {
      await deletePost(Number(id));
      console.log('✅ Post eliminado exitosamente');
      navigate('/posts');
    } catch (err: any) {
      console.error('❌ Error al eliminar:', err);
      alert(`Error: ${err.message || 'No se pudo eliminar el post'}`);
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  const handleEditPost = () => {
    navigate(`/posts/${post?.id}/edit`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const fossilTypeLabels = {
    bones_teeth: 'Huesos y Dientes',
    shell_exoskeletons: 'Conchas y Exoesqueletos',
    plant_impressions: 'Impresiones de Plantas',
    tracks_traces: 'Huellas y Rastros',
    amber_insects: 'Insectos en Ámbar'
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl" style={{ fontFamily: "'Playfair Display', serif", color: '#FFFFFF' }}>
          Cargando...
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <div className="text-xl text-red-400" style={{ fontFamily: "'Playfair Display', serif" }}>
          {error || 'Post no encontrado'}
        </div>
        <button
          onClick={() => navigate('/posts')}
          className="px-6 py-2 rounded-full"
          style={{ backgroundColor: '#48a9a6', color: '#FFFFFF' }}
        >
          Volver a Posts
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        
        <div className="text-right mb-3 sm:mb-4">
          <span className="text-base sm:text-lg md:text-xl" style={{ color: '#FFFFFF' }}>
            📍 {post.location || 'Ubicación no especificada'}
          </span>
        </div>

        {post.image_url && (
          <div className="mb-4 sm:mb-6 rounded-xl sm:rounded-2xl overflow-hidden">
            <img 
              src={post.image_url} 
              alt={post.title}
              className="w-full h-[250px] sm:h-[350px] md:h-[400px] lg:h-[500px] object-cover"
            />
          </div>
        )}

        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 px-2 sm:px-0" style={{ color: '#FFFFFF' }}>
          {post.title}
        </h1>

        <p className="text-base sm:text-lg md:text-xl italic mb-6 sm:mb-8 opacity-80 px-2 sm:px-0 leading-relaxed" style={{ color: '#FFFFFF' }}>
          {post.summary}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 mb-6 sm:mb-8">
          
          {/* SIDEBAR */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            <div className="lg:sticky lg:top-4">
              <div className="relative px-2 sm:px-0">
                <button
                  onClick={() => setMoreInfoOpen(!moreInfoOpen)}
                  className="w-full py-2.5 sm:py-3 px-4 sm:px-6 rounded-full flex items-center justify-between text-base sm:text-lg font-semibold transition-all hover:scale-105"
                  style={{ backgroundColor: 'rgba(72, 169, 166, 0.9)', color: '#FFFFFF' }}
                >
                  <span>Más Información</span>
                  <ChevronDown 
                    className={`transform transition-transform ${moreInfoOpen ? 'rotate-180' : ''}`} 
                    size={18} 
                  />
                </button>

                {moreInfoOpen && (
                  <div 
                    className="mt-2 rounded-xl sm:rounded-2xl p-3 sm:p-4 space-y-2 sm:space-y-3"
                    style={{ backgroundColor: 'rgba(72, 169, 166, 0.5)', color: '#FFFFFF' }}
                  >
                    {post.discovery_date && (
                      <div>
                        <p className="text-xs sm:text-sm opacity-70">Fecha de Descubrimiento</p>
                        <p className="font-semibold text-sm sm:text-base">{formatDate(post.discovery_date)}</p>
                      </div>
                    )}
                    {post.paleontologist && (
                      <div>
                        <p className="text-xs sm:text-sm opacity-70">Paleontólogo</p>
                        <p className="font-semibold text-sm sm:text-base">{post.paleontologist}</p>
                      </div>
                    )}
                    {post.geological_period && (
                      <div>
                        <p className="text-xs sm:text-sm opacity-70">Periodo Geológico</p>
                        <p className="font-semibold text-sm sm:text-base">{post.geological_period}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs sm:text-sm opacity-70">Tipo de Fósil</p>
                      <p className="font-semibold text-sm sm:text-base">{fossilTypeLabels[post.fossil_type]}</p>
                    </div>
                    {post.latitude && post.longitude && (
                      <>
                        <div>
                          <p className="text-xs sm:text-sm opacity-70">Latitud</p>
                          <p className="font-semibold text-sm sm:text-base">{post.latitude.toFixed(6)}°</p>
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm opacity-70">Longitud</p>
                          <p className="font-semibold text-sm sm:text-base">{post.longitude.toFixed(6)}°</p>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* CONTENT */}
          <div className="lg:col-span-9 order-1 lg:order-2">
            {post.author && (
              <div className="flex items-center justify-end gap-3 mb-4">
                <span className="font-semibold" style={{ color: '#FFFFFF' }}>
                  {post.author.username}
                </span>
              </div>
            )}

            <div 
              className="rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 mx-2 sm:mx-0 relative"
              style={{ backgroundColor: 'rgba(70, 46, 27, 0.4)' }}
            >
              <div className="space-y-3 sm:space-y-4 leading-relaxed text-base sm:text-lg" style={{ color: '#FFFFFF' }}>
                {/* ✅ FIX: Manejar cuando post_content sea undefined o vacío */}
                {post.post_content ? (
                  post.post_content.split('\n\n').map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))
                ) : (
                  <p className="italic opacity-70">Sin contenido disponible</p>
                )}
              </div>
              
              <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 flex gap-2">
                <button
                  onClick={handleEditPost}
                  className="p-2 rounded-full hover:bg-opacity-20 transition-all"
                  style={{ backgroundColor: 'rgba(72, 169, 166, 0.1)' }}
                  title="Editar"
                >
                  <Edit2 size={20} style={{ color: '#48a9a6' }} />
                </button>
                
                <button
                  onClick={() => setDeleteModalOpen(true)}
                  className="p-2 rounded-full hover:bg-red-500/20 transition-all"
                  title="Eliminar"
                >
                  <Trash2 size={20} className="text-red-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        title="¡¿ELIMINAR PUBLICACIÓN?!"
        message="Esta acción no se puede deshacer. ¿Estás seguro?"
        onConfirm={handleDeletePost}
        onCancel={() => setDeleteModalOpen(false)}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default PostDetail;