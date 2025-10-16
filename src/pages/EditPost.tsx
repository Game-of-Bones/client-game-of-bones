import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import EditPostForm from '../components/forms/EditPostForm';
import type { Post } from '../types/post.types';
const EditPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    console.log('🔍 EditPost cargando - ID:', id);
    // Simular carga de datos
    const loadPost = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock post data
      const mockPost: Post = {
        id: Number(id),
        title: 'Descubrimiento de Tyrannosaurus Rex en Montana',
        summary: 'Un espécimen excepcionalmente bien conservado revela nuevos secretos sobre el depredador más temido del Cretácico',
        post_content: `En las áridas llanuras de Montana, un equipo de paleontólogos ha desenterrado uno de los ejemplares de Tyrannosaurus Rex más completos jamás encontrados.
El fósil, apodado "Sue II" en honor al famoso espécimen anterior, se encuentra en un estado de preservación extraordinario. Los huesos muestran detalles que rara vez sobreviven al proceso de fosilización.
El Dr. Marcus Thompson, líder de la expedición, explica que este hallazgo es extraordinario no solo por su completitud, sino por lo que nos puede enseñar sobre el comportamiento social de estos animales.
El análisis preliminar indica que el ejemplar era un adulto joven, de aproximadamente 20 años de edad al momento de su muerte. Los sedimentos circundantes sugieren que el animal murió cerca de un antiguo lecho de río.`,
        image_url: 'https://images.unsplash.com/photo-1578269174936-2709b6aeb913?w=800',
        location: 'Montana, Estados Unidos',
        discovery_date: '2023-07-15',
        paleontologist: 'Dr. Marcus Thompson',
        geological_period: 'Cretácico Superior',
        fossil_type: 'bones_teeth',
        latitude: 46.8797,
        longitude: -110.3626,
        status: 'published',
        source: 'https://example.com/scientific-paper',
        author_id: 1,
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z',
        author: {
          id: 1,
          username: 'paleontologist_master',
          email: 'paleontologist@example.com'
        }
      };
      console.log('✅ Mock post cargado:', mockPost);
      setPost(mockPost);
      setIsLoading(false);
    };

    loadPost();
  }, [id]);
  if (isLoading) {
    return (
      <div style={{
        minHeight: 'calc(100vh - 200px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Cinzel', serif",
        color: '#C0B39A',
        fontSize: '18px'
      }}>
        Cargando post para editar...
      </div>
    );
  }
  if (!post) {
    return (
      <div style={{
        minHeight: 'calc(100vh - 200px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Cinzel', serif",
        color: '#C0B39A',
        fontSize: '18px',
        gap: '16px',
        padding: '20px'
      }}>
        <p style={{ fontSize: '24px', marginBottom: '8px' }}>Post no encontrado</p>
        <a
          href="/posts"
          style={{
            color: '#6DA49C',
            textDecoration: 'none',
            padding: '12px 24px',
            border: '1px solid #6DA49C',
            borderRadius: '6px',
            marginTop: '8px',
            fontFamily: "'Cinzel', serif",
            letterSpacing: '0.5px'
          }}
        >
          Volver a Posts
        </a>
      </div>
    );
  }
  console.log('✅ Renderizando EditPostForm con post:', post);
  return <EditPostForm postId={id!} initialData={post} />;
};
export default EditPost;