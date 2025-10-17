import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MessageCircle, ChevronDown, Trash2, Edit2, Send } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import type { Post } from '../types/post.types';
import { splitPostContent } from '../types/post.types';

// Tipos para comentarios
interface Comment {
  id: number;
  content: string;
  user_id: number;
  post_id: number;
  created_at: string;
  author?: {
    id: number;
    username: string;
  };
}

// Modal de confirmación
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
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [moreInfoOpen, setMoreInfoOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteCommentId, setDeleteCommentId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [userLiked, setUserLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    console.log('📍 ID recibido en PostDetail:', id);
    if (id) {
      loadAllData();
    }
  }, [id]);

  // Función para cargar todos los datos
  const loadAllData = async () => {
    await Promise.all([
      fetchPost(),
      fetchComments(),
      fetchLikes()
    ]);
  };

  const fetchPost = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:3001/api/posts/${id}`);
      if (!response.ok) throw new Error('Error al cargar el post');
      const result = await response.json();
      console.log('✅ Post obtenido:', result);

      const postData = result.data || result;
      setPost(postData);
    } catch (err: any) {
      console.error('❌ Error al obtener el post:', err);
      setError(err.message || 'No se pudo cargar el post');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/posts/${id}/comments`);

      if (!response.ok) {
        console.warn('⚠️ Error al cargar comentarios:', response.status);
        setComments([]);
        return;
      }

      const data = await response.json();
      console.log('✅ Comentarios obtenidos:', data);

      let commentsArray: Comment[] = [];

      if (Array.isArray(data)) {
        commentsArray = data;
      } else if (data.data && Array.isArray(data.data.comments)) {
        commentsArray = data.data.comments;
      } else if (data.data && Array.isArray(data.data)) {
        commentsArray = data.data;
      } else if (data.comments && Array.isArray(data.comments)) {
        commentsArray = data.comments;
      }

      setComments(commentsArray);

    } catch (err: any) {
      console.error('❌ Error al obtener comentarios:', err);
      setComments([]);
    }
  };

  const fetchLikes = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/posts/${id}`);

      if (!response.ok) {
        console.warn('⚠️ Error al cargar datos del post');
        setLikesCount(0);
        setUserLiked(false);
        return;
      }

      const result = await response.json();
      const postData = result.data || result;

      if (postData.likes_count !== undefined) {
        setLikesCount(postData.likes_count);
      }

      setUserLiked(false);

    } catch (err: any) {
      console.error('❌ Error al obtener likes:', err);
      setLikesCount(0);
      setUserLiked(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      alert('Debes iniciar sesión para dar like');
      return;
    }

    const previousLiked = userLiked;
    const previousCount = likesCount;
    
    setUserLiked(!userLiked);
    setLikesCount(userLiked ? likesCount - 1 : likesCount + 1);

    try {
      const response = await fetch(`http://localhost:3001/api/posts/${id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        setUserLiked(previousLiked);
        setLikesCount(previousCount);
        throw new Error('Error al procesar el like');
      }

      const result = await response.json();
      console.log('✅ Like toggle exitoso:', result);

      if (result.liked !== undefined) {
        setUserLiked(result.liked);
      }

      if (result.likes_count !== undefined) {
        setLikesCount(result.likes_count);
      }

    } catch (err: any) {
      console.error('❌ Error al dar like:', err);
      alert('Error al procesar el like. Inténtalo de nuevo.');
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert('Debes iniciar sesión para comentar');
      return;
    }

    if (!newComment.trim()) {
      alert('El comentario no puede estar vacío');
      return;
    }

    setIsSubmittingComment(true);

    try {
      const response = await fetch(`http://localhost:3001/api/posts/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ content: newComment })
      });

      if (!response.ok) throw new Error('Error al crear comentario');

      const result = await response.json();
      console.log('✅ Comentario creado:', result);

      await fetchComments();
      setNewComment('');

    } catch (err: any) {
      console.error('❌ Error al comentar:', err);
      alert('Error al publicar el comentario');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    setIsDeleting(true);

    try {
      const response = await fetch(`http://localhost:3001/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Error al eliminar comentario');

      console.log('✅ Comentario eliminado');

      await fetchComments();
      setDeleteCommentId(null);

    } catch (err: any) {
      console.error('❌ Error al eliminar comentario:', err);
      alert('Error al eliminar el comentario');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeletePost = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`http://localhost:3001/api/posts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Error al eliminar el post');

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

  const canDeletePost = user && post && (user.id === post.user_id || user.role === 'admin');

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

  // ✅ Separar el contenido en resumen corto y contenido detallado
  const { detailedContent } = splitPostContent(post.summary);

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

        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 px-2 sm:px-0" style={{ color: '#FFFFFF' }}>
          {post.title}
        </h1>

        {/* LIKES Y COMENTARIOS CONTADOR */}
        <div className="flex items-center gap-6 mb-6 px-2 sm:px-0">
          {user && (
            <button
              onClick={handleLike}
              className="flex items-center gap-2 transition-all hover:scale-110"
              title={userLiked ? "Quitar like" : "Dar like"}
            >
              <span
                style={{
                  fontSize: '28px',
                  filter: userLiked ? 'none' : 'grayscale(100%)',
                  opacity: userLiked ? 1 : 0.5,
                  transition: 'all 0.3s ease'
                }}
              >
                🦖
              </span>
              <span style={{ color: '#FFFFFF' }} className="font-semibold">
                {likesCount}
              </span>
            </button>
          )}

          <div className="flex items-center gap-2">
            <MessageCircle size={24} style={{ color: '#48a9a6' }} />
            <span style={{ color: '#FFFFFF' }} className="font-semibold">
              {comments.length}
            </span>
          </div>
        </div>

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
                {detailedContent ? (
                  detailedContent.split('\n\n').map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))
                ) : (
                  <p className="italic opacity-70">Sin contenido disponible</p>
                )}
              </div>

              {canDeletePost && (
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
              )}
            </div>

            {/* SECCIÓN DE COMENTARIOS */}
            <div
              className="rounded-xl sm:rounded-2xl p-4 sm:p-6 mx-2 sm:mx-0"
              style={{ backgroundColor: 'rgba(72, 169, 166, 0.2)' }}
            >
              <h3 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: '#FFFFFF' }}>
                Comentarios ({comments.length})
              </h3>

              {/* FORMULARIO DE COMENTARIO */}
              {user ? (
                <form onSubmit={handleSubmitComment} className="mb-6">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Escribe un comentario..."
                      className="flex-1 px-4 py-2 rounded-full"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        color: '#2D1F13',
                        border: 'none',
                        outline: 'none'
                      }}
                      disabled={isSubmittingComment}
                    />
                    <button
                      type="submit"
                      disabled={isSubmittingComment || !newComment.trim()}
                      className="p-2 rounded-full transition-all hover:scale-110"
                      style={{
                        backgroundColor: '#48a9a6',
                        opacity: (isSubmittingComment || !newComment.trim()) ? 0.5 : 1
                      }}
                    >
                      <Send size={20} style={{ color: '#FFFFFF' }} />
                    </button>
                  </div>
                </form>
              ) : (
                <div className="mb-6 text-center py-4" style={{ color: '#FFFFFF', opacity: 0.7 }}>
                  Inicia sesión para comentar
                </div>
              )}

              {/* LISTA DE COMENTARIOS */}
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <p className="text-center py-8" style={{ color: '#FFFFFF', opacity: 0.7 }}>
                    No hay comentarios aún. ¡Sé el primero en comentar!
                  </p>
                ) : (
                  comments.map(comment => {
                    const canDeleteComment = user && (user.id === comment.user_id || user.role === 'admin');

                    return (
                      <div
                        key={comment.id}
                        className="p-4 rounded-lg relative"
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="font-semibold mb-1" style={{ color: '#48a9a6' }}>
                              {comment.author?.username || 'Usuario'}
                            </p>
                            <p style={{ color: '#FFFFFF' }}>
                              {comment.content}
                            </p>
                            <p className="text-xs mt-2" style={{ color: '#FFFFFF', opacity: 0.6 }}>
                              {formatDate(comment.created_at)}
                            </p>
                          </div>

                          {canDeleteComment && (
                            <button
                              onClick={() => setDeleteCommentId(comment.id)}
                              className="p-1 rounded hover:bg-red-500/20 transition-all"
                              title="Eliminar comentario"
                            >
                              <Trash2 size={16} className="text-red-400" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para eliminar post */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        title="¡¿ELIMINAR PUBLICACIÓN?!"
        message="Esta acción no se puede deshacer. ¿Estás seguro?"
        onConfirm={handleDeletePost}
        onCancel={() => setDeleteModalOpen(false)}
        isDeleting={isDeleting}
      />

      {/* Modal para eliminar comentario */}
      <DeleteConfirmModal
        isOpen={deleteCommentId !== null}
        title="¡¿ELIMINAR COMENTARIO?!"
        message="Esta acción no se puede deshacer. ¿Estás seguro?"
        onConfirm={() => deleteCommentId && handleDeleteComment(deleteCommentId)}
        onCancel={() => setDeleteCommentId(null)}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default PostDetail;