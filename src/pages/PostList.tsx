import { useEffect, useState } from 'react';
import PostService from '../services/postService';
import type { Post } from '../types/post.types';



const PostList = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ===============================
  // Cargar los posts al montar el componente
  // ===============================
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await PostService.getAllPosts();
        setPosts(data);
      } catch (err: any) {
        setError(err.message || 'Error al cargar los posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // ===============================
  // Renderizado condicional
  // ===============================
  if (loading) return <p className="p-4 text-gray-500">Cargando posts...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  if (posts.length === 0) {
    return <p className="p-4 text-gray-400">No hay posts todavía 🦴</p>;
  }

  return (
    <section className="p-6">
      <h1 className="text-2xl font-bold mb-4">Publicaciones</h1>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <li
            key={post.id}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4 hover:shadow-lg transition"
          >
            <img
              src={post.image_url || '/default-fossil.jpg'}
              alt={post.title}
              className="w-full h-48 object-cover rounded-xl mb-3"
            />
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">{post.summary}</p>
            <p className="text-xs text-gray-400 mt-2">
              {post.fossil_type.replace('_', ' ')} • {post.status}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default PostList;