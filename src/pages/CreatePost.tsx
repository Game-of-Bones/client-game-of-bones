// src/pages/CreatePost.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CreatePostForm from '../components/forms/CreatePostForm';
import { useAuthStore } from '../stores/authStore';

const CreatePostPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  // 🔒 Protección: Si no hay usuario, redirigir (dentro de useEffect)
  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  // Mientras verificamos la autenticación, mostramos un loader
  if (!user) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh' 
      }}>
        <div 
          className="animate-spin rounded-full h-12 w-12 border-b-2" 
          style={{ borderColor: '#6DA49C' }}
        ></div>
      </div>
    );
  }

  return (
    <div>
      <CreatePostForm />
    </div>
  );
};

export default CreatePostPage;