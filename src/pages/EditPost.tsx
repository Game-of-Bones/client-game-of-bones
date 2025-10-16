import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EditPostForm from '../components/forms/EditPostForm';
import type { Post } from '../types/post.types';

const EditPost = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  /**
   * Cargar post al montar el componente
   */
  useEffect(() => {
    if (!id) {
      navigate('/posts');
      return;
    }
    
    fetchPost();
  }, [id]);

  /**
   * Obtener datos del post (MOCK temporal)
   */
  const fetchPost = async () => {
    setIsLoading(true);
    setError('');

    try {
      // TODO: Implementar cuando el backend esté conectado
      // const response = await fetch(`http://localhost:3001/posts/${id}`);
      // const data = await response.json();
      // setPost(data);

      // ⏳ MOCK temporal - Simular carga de red
      await new Promise(resolve => setTimeout(resolve, 500));

      // 📦 DATOS MOCK para testing
      const mockPost: Post = {
        id: Number(id),
        title: 'Descubrimiento de Triceratops en Montana',
        summary: 'Un hallazgo extraordinario que cambiará la paleontología',
        post_content: `En las vastas llanuras de Montana, un equipo de paleontólogos ha descubierto restos fósiles excepcionalmente bien preservados de un Triceratops adulto.

Este hallazgo es particularmente significativo porque incluye el cráneo completo con sus tres cuernos característicos intactos, algo extremadamente raro en el registro fósil.

Los investigadores estiman que este ejemplar vivió hace aproximadamente 66 millones de años, justo antes de la extinción masiva del Cretácico-Paleógeno.

El estado de preservación permitirá realizar estudios detallados sobre la estructura ósea, patrones de crecimiento y posibles comportamientos sociales de esta icónica especie.`,
        image_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
        paleontologist: 'Dr. María González',
        location: 'Hell Creek Formation, Montana',
        latitude: 47.5284,
        longitude: -107.4907,
        fossil_type: 'bones_teeth',
        geological_period: 'Cretácico Superior',
        discovery_date: '2024-03-15T00:00:00.000Z',
        source: 'https://doi.org/10.1234/ejemplo-referencia',
        status: 'published',
        author_id: 1,
        created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
        updated_at: new Date(Date.now() - 86400000 * 5).toISOString(),
        author: {
          id: 1,
          username: 'paleontologist_master',
          email: 'paleo@example.com'
        }
      };

      setPost(mockPost);

    } catch (err: any) {
      console.error('Error fetching post:', err);
      setError('Error al cargar el post. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  // ⏳ Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col justify-center items-center py-20">
          <div
            className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4"
            style={{ 
              borderTopColor: 'var(--color-primary)',
              borderBottomColor: 'var(--color-primary)'
            }}
          />
          <p className="mt-4 text-lg" style={{ color: 'var(--text-secondary)' }}>
            Cargando post para edición...
          </p>
        </div>
      </div>
    );
  }

  // ❌ Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div 
          className="p-6 rounded-lg text-center"
          style={{ 
            backgroundColor: 'var(--bg-danger-light)', 
            color: 'var(--color-danger)',
            border: '2px solid var(--color-danger)'
          }}
        >
          <h2 className="text-2xl font-bold mb-4">Error al cargar el post</h2>
          <p className="mb-6">{error}</p>
          <div className="space-x-4">
            <button
              onClick={() => fetchPost()}
              className="btn btn-primary"
            >
              Reintentar
            </button>
            <button
              onClick={() => navigate('/posts')}
              className="btn btn-secondary-outline"
            >
              Volver a Posts
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ⚠️ Post no encontrado
  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div 
          className="p-6 rounded-lg text-center"
          style={{ 
            backgroundColor: 'var(--bg-warning-light)', 
            color: 'var(--color-warning)',
            border: '2px solid var(--color-warning)'
          }}
        >
          <h2 className="text-2xl font-bold mb-4">Post no encontrado</h2>
          <p className="mb-6">No se encontró ningún post con el ID: {id}</p>
          <button
            onClick={() => navigate('/posts')}
            className="btn btn-primary"
          >
            Volver a Posts
          </button>
        </div>
      </div>
    );
  }

  // ✅ Renderizar formulario con datos del post
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <EditPostForm postId={id!} initialData={post} />
    </div>
  );
};

export default EditPost;

/**
 * 📝 NOTAS PARA CUANDO CONECTES CON EL BACKEND:
 * 
 * 1. Reemplazar el MOCK en fetchPost() con:
 *    ```typescript
 *    const token = localStorage.getItem('token'); // si usas auth
 *    const response = await fetch(`http://localhost:3001/posts/${id}`, {
 *      headers: {
 *        'Content-Type': 'application/json',
 *        'Authorization': `Bearer ${token}` // si usas auth
 *      }
 *    });
 *    
 *    if (!response.ok) {
 *      throw new Error(`Error ${response.status}: No se pudo cargar el post`);
 *    }
 *    
 *    const data = await response.json();
 *    setPost(data);
 *    ```
 * 
 * 2. Verificar permisos de edición:
 *    - Solo el autor o admin puede editar
 *    - Añadir verificación antes de mostrar el formulario
 * 
 * 3. Manejo de errores:
 *    - 401: No autenticado → redirigir a /login
 *    - 403: Sin permisos → mostrar mensaje
 *    - 404: Post no encontrado
 *    - 500: Error del servidor
 */