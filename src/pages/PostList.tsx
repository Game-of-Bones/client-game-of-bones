import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PostService from "../services/postService";
import type { Post } from "../types/post.types";
import Navbar from "../layout/navbar";


const PostList = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await PostService.getAllPosts();
        setPosts(data);
      } catch (err: any) {
        setError(err.message || "Error al cargar los posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <p className="p-4 text-gray-500">Cargando posts...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  if (posts.length === 0) {
    return (
      <>
        <Navbar />
        <p className="p-4 text-gray-400">No hay posts todavía 🦴</p>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#3B2616] text-white font-[Playfair_Display]">
      <Navbar />

      <section className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-bold mb-10 text-center">Publicaciones</h1>

        {/* GRID DE TARJETAS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.map((post) => (
            <article
              key={post.id}
              onClick={() => navigate(`/posts/${post.id}`)}
              className="cursor-pointer group overflow-hidden rounded-2xl shadow-lg bg-[#462E1B] hover:scale-[1.02] transition-transform duration-300"
            >
              {/* Imagen */}
              <div className="w-full h-60 overflow-hidden">
                <img
                  src={post.image_url || "/default-fossil.jpg"}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Contenido */}
              <div className="p-5 space-y-2">
                <p className="italic text-sm opacity-80">
                  {post.location} · {post.fossil_type.replace("_", " ")}
                </p>

                <h2 className="text-2xl font-semibold leading-snug">
                  {post.title}
                </h2>

                <p className="text-base opacity-90">{post.summary}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PostList;
