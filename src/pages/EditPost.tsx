import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EditPostForm from '../components/forms/EditPostForm';
import { usePostStore } from '../stores/postStore';
import type { Post } from '../types/post.types';

const EditPostPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // ✅ Obtener funciones del store
  const fetchPostById = usePostStore((state) => state.fetchPostById);
  const clearCurrentPost = usePostStore((state) => state.clearCurrentPost);
  
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPost = async () => {
      if (!id) {
        setError('ID de post inválido');
        setLoading(false);
        return;
      }

      try {
        console.log('🔄 Cargando post con ID:', id);
        const postData = await fetchPostById(Number(id));
        console.log('✅ Post cargado:', postData);
        setPost(postData);
        setError('');
      } catch (err: any) {
        console.error('❌ Error al cargar post:', err);
        setError(err.message || 'No se pudo cargar el post');
      } finally {
        setLoading(false);
      }
    };

    loadPost();

    // 🧹 Limpiar al desmontar
    return () => {
      clearCurrentPost();
    };
  }, [id, fetchPostById, clearCurrentPost]);

  // 🔄 LOADING STATE
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        fontFamily: 'Cinzel, serif',
        color: '#C0B39A',
        fontSize: '18px'
      }}>
        Cargando post...
      </div>
    );
  }

  // ❌ ERROR STATE
  if (error) {
    return (
      <div style={{ 
        maxWidth: '600px', 
        margin: '40px auto', 
        padding: '24px',
        backgroundColor: 'rgba(247, 108, 94, 0.1)',
        borderRadius: '8px',
        textAlign: 'center',
        color: '#F76C5E',
        fontFamily: 'Playfair Display, serif'
      }}>
        <p style={{ marginBottom: '16px', fontSize: '16px' }}>{error}</p>
        <button
          onClick={() => navigate('/profile')}
          style={{
            padding: '12px 24px',
            backgroundColor: '#6DA49C',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontFamily: 'Cinzel, serif',
            fontSize: '13px',
            letterSpacing: '0.5px'
          }}
        >
          Volver al Perfil
        </button>
      </div>
    );
  }

  // ⏳ WAITING FOR DATA
  if (!post || !id) {
    return null;
  }

  // ✅ RENDER FORM (solo cuando post existe)
  return (
    <div>
      <EditPostForm postId={id} initialData={post} />
    </div>
  );
};

export default EditPostPage;