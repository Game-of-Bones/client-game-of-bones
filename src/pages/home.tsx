// Home.tsx
import { Link } from 'react-router-dom';
import MapComponent from '../components/ui/MapComponent';

const Home = () => {
  return (
    <>
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section - SIN bg-gray-100 */}
        <section className="text-center py-12 rounded-lg mb-8 backdrop-blur-sm bg-white/10 border border-white/20">
          <h1 className="text-4xl font-bold mb-4">
            Bienvenido a Game of Bones
          </h1>
          <p className="text-xl mb-6" style={{ color: 'var(--text-secondary)' }}>
            Comparte y descubre historias épicas
          </p>
          <div className="space-x-4">
            <Link
              to="/posts"
              className="inline-block px-6 py-3 rounded transition"
              style={{ 
                backgroundColor: 'var(--color-teal)',
                color: 'var(--text-inverse)'
              }}
            >
              Ver Posts
            </Link>
            <Link
              to="/register"
              className="inline-block px-6 py-3 rounded transition"
              style={{ 
                backgroundColor: 'var(--color-coral)',
                color: 'var(--text-inverse)'
              }}
            >
              Únete Ahora
            </Link>
          </div>
        </section>

        {/* Mapa */}
        <section className="mb-8" style={{ minHeight: '800px' }}>
          <h2 className="text-3xl font-bold mb-4 text-center">
            Mapa de Descubrimientos
          </h2>
          <MapComponent />
        </section>

        {/* Features - Con backdrop blur para efecto glassmorphism */}
        <section className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 rounded-lg text-center backdrop-blur-sm bg-white/10 border border-white/20">
            <h3 className="text-xl font-semibold mb-2">📝 Crea Posts</h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Comparte tus historias con la comunidad
            </p>
          </div>
          <div className="p-6 rounded-lg text-center backdrop-blur-sm bg-white/10 border border-white/20">
            <h3 className="text-xl font-semibold mb-2">💬 Comenta</h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Participa en discusiones interesantes
            </p>
          </div>
          <div className="p-6 rounded-lg text-center backdrop-blur-sm bg-white/10 border border-white/20">
            <h3 className="text-xl font-semibold mb-2">⭐ Explora</h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Descubre contenido increíble
            </p>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;