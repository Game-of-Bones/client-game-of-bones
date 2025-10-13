// Página que muestra el detalle completo de un post

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

/**
 * Interface para el tipo Post
 */
interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    username: string;
  };
  createdAt: string;
  updatedAt?: string;
  commentsCount: number;
}

/**
 * PostDetail - Página de detalle de un post
 * 
 * Funcionalidad:
 * - Mostrar post completo
 * - Información del autor
 * - Sección de comentarios
 * - Botones de editar/eliminar (si es el autor o admin)
 */
const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Mock de usuario actual
  const userStr = localStorage.getItem('user');
  const currentUser = userStr ? JSON.parse(userStr) : null;

  /**
   * Cargar post al montar el componente
   */
  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  /**
   * Obtener datos del post
   */
  const fetchPost = async () => {
    setIsLoading(true);
    setError('');

    try {
      // TODO: Implementar cuando el servicio esté listo
      // const response = await getPostById(id);
      // setPost(response);

      // MOCK temporal - ELIMINAR cuando el servicio esté listo
      await new Promise(resolve => setTimeout(resolve, 800));

      const mockPost: Post = {
        id: id!,
        title: 'El increíble descubrimiento en las montañas',
        content: `En las profundidades de las montañas, un equipo de paleontólogos ha descubierto restos fósiles que podrían cambiar nuestra comprensión de la historia prehistórica.

Los huesos encontrados pertenecen a una especie hasta ahora desconocida que vivió hace aproximadamente 65 millones de años, justo en el período de la extinción masiva que acabó con los dinosaurios.

Este hallazgo es particularmente significativo porque los restos están excepcionalmente bien preservados, lo que permitirá a los científicos estudiar detalles que normalmente se pierden en el proceso de fossilización.

El equipo planea continuar las excavaciones en los próximos meses, con la esperanza de encontrar más evidencia que ayude a completar el rompecabezas evolutivo de esta fascinante especie.`,
        author: {
          id: 'author1',
          username: 'paleontologist_master'
        },
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
        commentsCount: 15
      };

      setPost(mockPost);

    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('Post no encontrado');
      } else {
        setError('Error al cargar el post');
      }
      console.error('Error fetching post:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Eliminar post (solo autor o admin)
   */
  const handleDelete = async () => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este post?')) {
      return;
    }

    try {
      // TODO: Implementar cuando el servicio esté listo
      // await deletePost(id);

      console.log('Deleting post:', id);
      alert('Post eliminado correctamente');
      navigate('/posts');

    } catch (err: any) {
      alert('Error al eliminar el post');
      console.error('Error deleting post:', err);
    }
  };

  /**
   * Formatea la fecha
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /**
   * Verifica si el usuario actual puede editar/eliminar
   */
  const canModify = currentUser && (
    currentUser.id === post?.author.id || 
    currentUser.role === 'admin'
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando post...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error || 'Post no encontrado'}
        </div>
        <Link to="/posts" className="text-blue-600 hover:underline">
          ← Volver a la lista de posts
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Breadcrumb / Back button */}
      <Link to="/posts" className="text-blue-600 hover:underline mb-6 inline-block">
        ← Volver a posts
      </Link>

      {/* Post Content */}
      <article className="bg-white rounded-lg shadow-md p-8 mb-6">
        {/* Header */}
        <header className="mb-6 pb-4 border-b">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

          {/* Metadata */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-4">
              <Link
                to={`/users/${post.author.id}`}
                className="font-medium hover:text-blue-600 transition"
              >
                Por {post.author.username}
              </Link>
              <span>•</span>
              <span>{formatDate(post.createdAt)}</span>
              {post.updatedAt && post.updatedAt !== post.createdAt && (
                <>
                  <span>•</span>
                  <span className="text-gray-500">Editado</span>
                </>
              )}
            </div>

            <span>💬 {post.commentsCount} comentarios</span>
          </div>
        </header>

        {/* Botones de acción (si puede modificar) */}
        {canModify && (
          <div className="mb-6 flex gap-3">
            <Link
              to={`/admin/posts/${post.id}/edit`}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              ✏️ Editar
            </Link>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              🗑️ Eliminar
            </button>
          </div>
        )}

        {/* Contenido del post */}
        <div className="prose max-w-none">
          {post.content.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4 text-gray-800 leading-relaxed">
              {paragraph || <br />}
            </p>
          ))}
        </div>
      </article>

      {/* Sección de comentarios */}
      <section className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6">
          Comentarios ({post.commentsCount})
        </h2>

        {/* TODO: Implementar sistema de comentarios */}
        <div className="text-center py-8 text-gray-500">
          <p>Sistema de comentarios en desarrollo...</p>
          <p className="text-sm mt-2">Próximamente podrás comentar en los posts</p>
        </div>

        {/* 
        MOCK de cómo se verían los comentarios:
        
        <div className="space-y-4">
          <div className="border-b pb-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold">usuario123</span>
                  <span className="text-sm text-gray-500">hace 2 horas</span>
                </div>
                <p className="text-gray-700">
                  ¡Increíble descubrimiento! Me encantaría saber más detalles...
                </p>
              </div>
            </div>
          </div>
        </div>

        {currentUser && (
          <div className="mt-6">
            <textarea
              placeholder="Escribe tu comentario..."
              className="w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
            <button className="mt-2 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
              Comentar
            </button>
          </div>
        )}
        */}
      </section>
    </div>
  );
};

export default PostDetail;

/**
 * NOTAS DE IMPLEMENTACIÓN FUTURA:
 * 
 * 1. Sistema de comentarios:
 *    - Crear componente Comments.tsx
 *    - Endpoint GET /posts/:id/comments
 *    - Endpoint POST /posts/:id/comments
 *    - Paginación de comentarios
 *    - Editar/eliminar propios comentarios
 * 
 * 2. Acciones adicionales:
 *    - Botón de "Me gusta" / Like
 *    - Compartir en redes sociales
 *    - Guardar/Bookmark post
 *    - Reportar contenido inapropiado
 * 
 * 3. Markdown/Rich text rendering:
 *    - Si el contenido está en Markdown, usar react-markdown
 *    - Syntax highlighting para code blocks
 *    - Renderizar imágenes inline
 * 
 * 4. Related posts:
 *    - Sección al final con posts relacionados
 *    - Basado en tags o contenido similar
 * 
 * 5. SEO:
 *    - Meta tags dinámicos con react-helmet
 *    - Open Graph para compartir en redes sociales
 */