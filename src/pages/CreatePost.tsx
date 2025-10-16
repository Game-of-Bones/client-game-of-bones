import { useNavigate } from 'react-router-dom';
import CreatePostForm from '../components/forms/CreatePostForm';
import { useAuthStore } from '../stores/authStore';

const CreatePostPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  // 🔒 Protección: Si no hay usuario, redirigir
  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div>
      {/* ✅ Este componente YA TIENE TODO (Document 1) */}
      <CreatePostForm />
    </div>
  );
};

export default CreatePostPage;