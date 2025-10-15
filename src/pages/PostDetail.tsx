import { useState, useEffect } from 'react';
import { Heart, MessageCircle, ChevronDown } from 'lucide-react';

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

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, []);

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
        image_url: '/public/montana.jpg',
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
    } catch (error) {
      console.error('Error:', error);
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
        <div className="text-xl text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
          {isLoading ? 'Cargando...' : 'Post no encontrado'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Playfair Display', serif" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="text-right mb-4">
          <span className="text-white text-lg">📍 {post.location}</span>
        </div>

        <div className="mb-6 rounded-2xl overflow-hidden">
          <img 
            src={post.image_url} 
            alt={post.title}
            className="w-full h-[400px] object-cover"
          />
        </div>

        <h1 className="text-white text-4xl md:text-5xl font-bold mb-4">
          {post.title}
        </h1>

        <p className="text-white text-lg md:text-xl italic mb-8 opacity-80">
          {post.summary}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          
          <div className="lg:col-span-3">
            <div className="lg:sticky lg:top-4">
              <div className="relative">
                <button
                  onClick={() => setMoreInfoOpen(!moreInfoOpen)}
                  className="w-full py-3 px-6 rounded-full flex items-center justify-between text-white text-lg font-semibold transition-all hover:scale-105"
                  style={{ backgroundColor: 'rgba(72, 169, 166, 0.9)' }}
                >
                  Más Información
                  <ChevronDown 
                    className={`transform transition-transform ${moreInfoOpen ? 'rotate-180' : ''}`} 
                    size={20} 
                  />
                </button>

                {moreInfoOpen && (
                  <div 
                    className="mt-2 rounded-2xl p-4 space-y-3 text-white"
                    style={{ backgroundColor: 'rgba(72, 169, 166, 0.5)' }}
                  >
                    <div>
                      <p className="text-sm opacity-70">Fecha de Descubrimiento</p>
                      <p className="font-semibold">{formatDate(post.discovery_date)}</p>
                    </div>
                    <div>
                      <p className="text-sm opacity-70">Paleontólogo</p>
                      <p className="font-semibold">{post.paleontologist}</p>
                    </div>
                    <div>
                      <p className="text-sm opacity-70">Periodo Geológico</p>
                      <p className="font-semibold">{post.geological_period}</p>
                    </div>
                    <div>
                      <p className="text-sm opacity-70">Tipo de Fósil</p>
                      <p className="font-semibold">{fossilTypeLabels[post.fossil_type]}</p>
                    </div>
                    {post.latitude && post.longitude && (
                      <>
                        <div>
                          <p className="text-sm opacity-70">Latitud</p>
                          <p className="font-semibold">{post.latitude.toFixed(6)}°</p>
                        </div>
                        <div>
                          <p className="text-sm opacity-70">Longitud</p>
                          <p className="font-semibold">{post.longitude.toFixed(6)}°</p>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-9">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-end gap-4 mb-6">
              
              <div className="relative">
                <button
                  onClick={() => setLikesOpen(!likesOpen)}
                  className="flex items-center gap-2 py-2 px-4 rounded-full text-white transition-all hover:scale-105"
                  style={{ backgroundColor: 'rgba(141, 170, 145, 0.5)' }}
                >
                  <Heart size={20} fill="white" />
                  <span className="font-semibold">{post.likes_count}</span>
                </button>

                {likesOpen && post.liked_by.length > 0 && (
                  <div 
                    className="absolute right-0 mt-2 w-64 rounded-xl p-3 space-y-2 z-10"
                    style={{ backgroundColor: 'rgba(141, 170, 145, 0.95)' }}
                  >
                    <p className="text-white font-semibold mb-2">Les gusta a:</p>
                    {post.liked_by.map(user => (
                      <div key={user.id} className="flex items-center gap-2">
                        <img 
                          src={user.avatar} 
                          alt={user.username}
                          className="w-8 h-8 rounded-full"
                        />
                        <span className="text-white">{user.username}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div 
                className="flex items-center gap-3 py-2 px-4 rounded-full"
                style={{ backgroundColor: 'rgba(70, 46, 27, 0.6)' }}
              >
                <img 
                  src={post.author.profile_image} 
                  alt={post.author.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="text-white font-semibold">
                  {post.author.username}
                </span>
              </div>
            </div>

            <div 
              className="rounded-2xl p-8 mb-8"
              style={{ backgroundColor: 'rgba(70, 46, 27, 0.4)' }}
            >
              <div className="text-white space-y-4 leading-relaxed text-lg">
                {post.post_content.split('\n\n').map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <div className="flex items-center gap-3 mb-6">
            <MessageCircle size={28} className="text-white" />
            <h2 className="text-white text-3xl font-bold">Comentarios</h2>
          </div>

          <div className="space-y-4">
            {comments.map(comment => (
              <div 
                key={comment.id}
                className="rounded-xl p-6"
                style={{ backgroundColor: 'rgba(139, 107, 77, 0.5)' }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <img 
                    src={comment.user.avatar} 
                    alt={comment.user.username}
                    className="w-10 h-10 rounded-full"
                  />
                  <span className="text-white font-semibold text-lg">
                    {comment.user.username}
                  </span>
                </div>
                <p className="text-white text-lg leading-relaxed">
                  {comment.content}
                </p>
              </div>
            ))}
          </div>

          <div 
            className="mt-6 rounded-xl p-6"
            style={{ backgroundColor: 'rgba(139, 107, 77, 0.3)' }}
          >
            <textarea 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escribe tu comentario..."
              className="w-full bg-transparent text-white placeholder-gray-300 border-b border-white/30 py-3 px-2 focus:outline-none focus:border-white/60 transition-colors resize-none"
              rows={3}
              style={{ fontFamily: "'Playfair Display', serif" }}
            />
            <button 
              onClick={handleSubmitComment}
              className="mt-4 py-2 px-8 rounded-full text-white font-semibold transition-all hover:scale-105"
              style={{ backgroundColor: 'rgba(72, 169, 166, 0.9)' }}
            >
              Publicar Comentario
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;