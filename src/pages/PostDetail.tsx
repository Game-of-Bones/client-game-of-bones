import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Heart, MessageCircle, ChevronDown, Trash2, Edit2 } from 'lucide-react';
import PostService from '../services/PostService';

// Modal de confirmación de eliminación
interface DeleteConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

const DeleteConfirmModal = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  isDeleting = false
}: DeleteConfirmModalProps) => {
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
        {/* Imagen del Triceratops */}
        <div className="flex justify-center mb-6">
          <div className="w-32 h-32 relative">
            <img 
              src="/Triceratops_Skull_in_Earthy_Brown.png" 
              alt="Triceratops Skull" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>
        
        {/* Título */}
        <h3 
          className="text-2xl sm:text-3xl font-bold text-center mb-3"
          style={{ fontFamily: "'Playfair Display', serif", color: '#FFFFFF' }}
        >
          {title}
        </h3>
        
        {/* Mensaje */}
        <p 
          className="text-center mb-8 text-base sm:text-lg"
          style={{ fontFamily: "'Playfair Display', serif", color: '#FFFFFF' }}
        >
          {message}
        </p>
        
        {/* Botones */}
        <div className="flex justify-center gap-4">
          <button 
            onClick={onCancel} 
            disabled={isDeleting}
            className="py-3 px-8 rounded-full text-white font-semibold transition-all hover:scale-105 active:scale-95 disabled:opacity-50 text-lg"
            style={{ 
              backgroundColor: '#F76C5E',
              fontFamily: "'Playfair Display', serif"
            }}
          >
            Cancelar
          </button>
          <button 
            onClick={onConfirm} 
            disabled={isDeleting}
            className="py-3 px-8 rounded-full text-white font-semibold transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            style={{ 
              backgroundColor: '#8DAA91',
              fontFamily: "'Playfair Display', serif"
            }}
          >
            {isDeleting ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
};

interface Post {
  id: string;
  title: string;
  summary: string;
  post_content: string;
  image_url: string;
  location: string;
  discovery_date: string;
  paleontologist: string;
  geological_period: string;
  fossil_type: 'bones_teeth' | 'shell_exoskeletons' | 'plant_impressions' | 'tracks_traces' | 'amber_insects';
  latitude: number | null;
  longitude: number | null;
  author: {
    id: string;
    username: string;
    profile_image: string;
  };
  likes_count: number;
  liked_by: Array<{ id: string; username: string; avatar: string }>;
}

interface Comment {
  id: string;
  user: { username: string; avatar: string };
  content: string;
  created_at: string;
}

const PostDetail = () => {
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [moreInfoOpen, setMoreInfoOpen] = useState(false);
  const [likesOpen, setLikesOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteType, setDeleteType] = useState<'post' | 'comment'>('post');
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();


  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]); // ✅ Ahora dependemos del id


  const fetchPost = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockPost: Post = {
        id: '1',
        title: 'Descubrimiento de Tyrannosaurus Rex en Montana',
        summary: 'Un espécimen excepcionalmente bien conservado revela nuevos secretos sobre el depredador más temido del Cretácico',
        post_content: `En las áridas llanuras de Montana, un equipo de paleontólogos ha desenterrado uno de los ejemplares de Tyrannosaurus Rex más completos jamás encontrados.

El fósil, apodado "Sue II" en honor al famoso espécimen anterior, se encuentra en un estado de preservación extraordinario. Los huesos muestran detalles que rara vez sobreviven al proceso de fosilización.

El Dr. Marcus Thompson, líder de la expedición, explica que este hallazgo es extraordinario no solo por su completitud, sino por lo que nos puede enseñar sobre el comportamiento social de estos animales.

El análisis preliminar indica que el ejemplar era un adulto joven, de aproximadamente 20 años de edad al momento de su muerte. Los sedimentos circundantes sugieren que el animal murió cerca de un antiguo lecho de río.`,
        image_url: 'https://images.unsplash.com/photo-1565012618935-9def2a0b9b7e?w=800',
        location: 'Montana, Estados Unidos',
        discovery_date: '2023-07-15',
        paleontologist: 'Dr. Marcus Thompson',
        geological_period: 'Cretácico Superior',
        fossil_type: 'bones_teeth',
        latitude: 46.8797,
        longitude: -110.3626,
        author: {
          id: 'author1',
          username: 'paleontologist_master',
          profile_image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'
        },
        likes_count: 24,
        liked_by: [
          { id: '1', username: 'fossil_hunter', avatar: 'https://i.pravatar.cc/150?img=1' },
          { id: '2', username: 'dino_enthusiast', avatar: 'https://i.pravatar.cc/150?img=2' },
          { id: '3', username: 'science_lover', avatar: 'https://i.pravatar.cc/150?img=3' }
        ]
      };
      
      setPost(mockPost);

      
      // ✅ NUEVO - obtener post real del backend
        
      const fetchedPost = await PostService.getPostById(Number(id));
        setPost(fetchedPost);
      
    } catch (error) {
      console.error('Error al obtener el post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchComments = async () => {

    const mockComments: Comment[] = [
      {
        id: '1',
        user: { username: 'fossil_hunter', avatar: 'https://i.pravatar.cc/150?img=1' },
        content: '¡Increíble descubrimiento! Me encantaría visitar el sitio algún día.',
        created_at: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        user: { username: 'dino_enthusiast', avatar: 'https://i.pravatar.cc/150?img=2' },
        content: 'La preservación es asombrosa. ¿Cuándo publicarán el estudio completo?',
        created_at: '2024-01-15T14:22:00Z'
      }
    ];
    
    setComments(mockComments);
  };

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;
    
    const comment: Comment = {
      id: Date.now().toString(),
      user: { username: 'current_user', avatar: 'https://i.pravatar.cc/150?img=10' },
      content: newComment,
      created_at: new Date().toISOString()
    };
    
    setComments([...comments, comment]);
    setNewComment('');
  };

  //NUEVO ✅
  const handleDeletePost = async () => {
  setIsDeleting(true);
  try {
    await PostService.deletePost(Number(id));
    console.log('Post eliminado desde backend');
    alert('Post eliminado exitosamente');
    navigate('/posts');
  } catch (error) {
    console.error('Error al eliminar:', error);
    alert('No se pudo eliminar el post');
  } finally {
    setIsDeleting(false);
    setDeleteModalOpen(false);
  }
};


  const handleDeleteComment = async () => {
    if (!commentToDelete) return;
    
    setIsDeleting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setComments(comments.filter(c => c.id !== commentToDelete));
      console.log('Comentario eliminado:', commentToDelete);
    } catch (error) {
      console.error('Error al eliminar:', error);
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
      setCommentToDelete(null);
    }
  };

  const openDeletePostModal = () => {
    setDeleteType('post');
    setDeleteModalOpen(true);
  };

  const openDeleteCommentModal = (commentId: string) => {
    setDeleteType('comment');
    setCommentToDelete(commentId);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteType === 'post') {
      handleDeletePost();
    } else {
      handleDeleteComment();
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setCommentToDelete(null);
  };

  const handleEditPost = () => {
    navigate(`/posts/${post?.id}/edit`); // ✅ CAMBIO REALIZADO AQUÍ
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

  if (isLoading || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl" style={{ fontFamily: "'Playfair Display', serif", color: '#FFFFFF' }}>
          {isLoading ? 'Cargando...' : 'Post no encontrado'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        
        <div className="text-right mb-3 sm:mb-4">
          <span className="text-base sm:text-lg md:text-xl" style={{ color: '#FFFFFF' }}>📍 {post.location}</span>
        </div>

        <div className="mb-4 sm:mb-6 rounded-xl sm:rounded-2xl overflow-hidden">
          <img 
            src={post.image_url} 
            alt={post.title}
            className="w-full h-[250px] sm:h-[350px] md:h-[400px] lg:h-[500px] object-cover"
          />
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 px-2 sm:px-0" style={{ color: '#FFFFFF' }}>
          {post.title}
        </h1>

        <p className="text-base sm:text-lg md:text-xl italic mb-6 sm:mb-8 opacity-80 px-2 sm:px-0 leading-relaxed" style={{ color: '#FFFFFF' }}>
          {post.summary}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 mb-6 sm:mb-8">
          
          <div className="lg:col-span-3 order-2 lg:order-1">
            <div className="lg:sticky lg:top-4">
              <div className="relative px-2 sm:px-0">
                <button
                  onClick={() => setMoreInfoOpen(!moreInfoOpen)}
                  className="w-full py-2.5 sm:py-3 px-4 sm:px-6 rounded-full flex items-center justify-between text-base sm:text-lg font-semibold transition-all hover:scale-105 active:scale-95"
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
                    className="mt-2 rounded-xl sm:rounded-2xl p-3 sm:p-4 space-y-2 sm:space-y-3 animate-slide-down"
                    style={{ backgroundColor: 'rgba(72, 169, 166, 0.5)', color: '#FFFFFF' }}
                  >
                    <div>
                      <p className="text-xs sm:text-sm opacity-70" style={{ color: '#FFFFFF' }}>Fecha de Descubrimiento</p>
                      <p className="font-semibold text-sm sm:text-base" style={{ color: '#FFFFFF' }}>{formatDate(post.discovery_date)}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm opacity-70" style={{ color: '#FFFFFF' }}>Paleontólogo</p>
                      <p className="font-semibold text-sm sm:text-base" style={{ color: '#FFFFFF' }}>{post.paleontologist}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm opacity-70" style={{ color: '#FFFFFF' }}>Periodo Geológico</p>
                      <p className="font-semibold text-sm sm:text-base" style={{ color: '#FFFFFF' }}>{post.geological_period}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm opacity-70" style={{ color: '#FFFFFF' }}>Tipo de Fósil</p>
                      <p className="font-semibold text-sm sm:text-base" style={{ color: '#FFFFFF' }}>{fossilTypeLabels[post.fossil_type]}</p>
                    </div>
                    {post.latitude && post.longitude && (
                      <>
                        <div>
                          <p className="text-xs sm:text-sm opacity-70" style={{ color: '#FFFFFF' }}>Latitud</p>
                          <p className="font-semibold text-sm sm:text-base" style={{ color: '#FFFFFF' }}>{post.latitude.toFixed(6)}°</p>
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm opacity-70" style={{ color: '#FFFFFF' }}>Longitud</p>
                          <p className="font-semibold text-sm sm:text-base" style={{ color: '#FFFFFF' }}>{post.longitude.toFixed(6)}°</p>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-9 order-1 lg:order-2">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4 mb-4 sm:mb-6 px-2 sm:px-0">
              
              <div className="relative w-full sm:w-auto">
                <button
                  onClick={() => setLikesOpen(!likesOpen)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 py-2 px-4 rounded-full transition-all hover:scale-105 active:scale-95"
                  style={{ backgroundColor: 'rgba(141, 170, 145, 0.5)', color: '#FFFFFF' }}
                >
                  <Heart size={18} fill="white" />
                  <span className="font-semibold">{post.likes_count}</span>
                </button>

                {likesOpen && post.liked_by.length > 0 && (
                  <div 
                    className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-full sm:w-64 rounded-xl p-3 space-y-2 z-10 animate-slide-down"
                    style={{ backgroundColor: 'rgba(141, 170, 145, 0.95)' }}
                  >
                    <p className="font-semibold mb-2 text-sm sm:text-base" style={{ color: '#FFFFFF' }}>Les gusta a:</p>
                    {post.liked_by.map(user => (
                      <div key={user.id} className="flex items-center gap-2">
                        <img 
                          src={user.avatar} 
                          alt={user.username}
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full"
                        />
                        <span className="text-sm sm:text-base" style={{ color: '#FFFFFF' }}>{user.username}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div 
                className="w-full sm:w-auto flex items-center justify-center gap-2 sm:gap-3 py-2 px-4 rounded-full"
                style={{ backgroundColor: 'rgba(70, 46, 27, 0.6)' }}
              >
                <img 
                  src={post.author.profile_image} 
                  alt={post.author.username}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                />
                <span className="font-semibold text-sm sm:text-base" style={{ color: '#FFFFFF' }}>
                  {post.author.username}
                </span>
              </div>
            </div>

            <div 
              className="rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 mx-2 sm:mx-0 relative"
              style={{ backgroundColor: 'rgba(70, 46, 27, 0.4)' }}
            >
              <div className="space-y-3 sm:space-y-4 leading-relaxed text-base sm:text-lg" style={{ color: '#FFFFFF' }}>
                {post.post_content.split('\n\n').map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
              
              {/* Botones de editar y eliminar post */}
              <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 flex gap-2">
                <button
                  onClick={handleEditPost}
                  className="p-2 rounded-full hover:bg-opacity-20 transition-all group"
                  style={{ backgroundColor: 'rgba(72, 169, 166, 0.1)' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(72, 169, 166, 0.2)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(72, 169, 166, 0.1)'}
                  title="Editar"
                >
                  <Edit2 size={20} style={{ color: '#48a9a6' }} />
                  <span className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Editar
                  </span>
                </button>
                
                <button
                  onClick={openDeletePostModal}
                  className="p-2 rounded-full hover:bg-red-500/20 transition-all group"
                  title="Eliminar"
                >
                  <Trash2 size={20} className="text-red-400 group-hover:text-red-300" />
                  <span className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Eliminar
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 sm:mt-12 px-2 sm:px-0">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <MessageCircle size={24} className="sm:w-7 sm:h-7" style={{ color: '#FFFFFF' }} />
            <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: '#FFFFFF' }}>Comentarios</h2>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {comments.map(comment => (
              <div 
                key={comment.id}
                className="rounded-xl p-4 sm:p-6 relative"
                style={{ backgroundColor: 'rgba(139, 107, 77, 0.5)' }}
              >
                {/* Botón eliminar comentario */}
                <button
                  onClick={() => openDeleteCommentModal(comment.id)}
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 rounded-full hover:bg-red-500/20 transition-all group"
                  title="Eliminar"
                >
                  <Trash2 size={18} className="text-red-400 group-hover:text-red-300" />
                  <span className="absolute top-full right-0 mt-2 px-3 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Eliminar
                  </span>
                </button>
                
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <img 
                    src={comment.user.avatar} 
                    alt={comment.user.username}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
                  />
                  <span className="font-semibold text-base sm:text-lg" style={{ color: '#FFFFFF' }}>
                    {comment.user.username}
                  </span>
                </div>
                <p className="text-base sm:text-lg leading-relaxed pr-8" style={{ color: '#FFFFFF' }}>
                  {comment.content}
                </p>
              </div>
            ))}
          </div>

          <div 
            className="mt-4 sm:mt-6 rounded-xl p-4 sm:p-6"
            style={{ backgroundColor: 'rgba(139, 107, 77, 0.3)' }}
          >
            <textarea 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escribe tu comentario..."
              className="w-full bg-transparent border-b border-white/30 py-2 sm:py-3 px-2 focus:outline-none focus:border-white/60 transition-colors resize-none text-base sm:text-lg placeholder-gray-300"
              rows={3}
              style={{ fontFamily: "'Playfair Display', serif", color: '#FFFFFF' }}
            />
            <button 
              onClick={handleSubmitComment}
              className="mt-3 sm:mt-4 py-2 px-6 sm:px-8 rounded-full font-semibold transition-all hover:scale-105 active:scale-95 w-full sm:w-auto text-base sm:text-lg"
              style={{ backgroundColor: 'rgba(72, 169, 166, 0.9)', color: '#FFFFFF' }}
            >
              Publicar Comentario
            </button>
          </div>
        </div>
      </div>

      {/* Modal de confirmación de eliminación */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        title={deleteType === 'post' ? '¡¿ELIMINAR PUBLICACIÓN?!' : '¡¿ELIMINAR COMENTARIO?!'}
        message="Esta acción no se puede deshacer. ¿Estás seguro de ello?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default PostDetail;