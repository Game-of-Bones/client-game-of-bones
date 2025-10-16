// Home.tsx
import { Link } from 'react-router-dom';
import MapComponent from '../components/ui/MapComponent';
import RecentPostsCarousel from '../components/ui/RecentPostsCarousel';

const Home = () => {
  return (
    <>
      <div className="container mx-auto px-4 py-8 relative">
  {/* 🔘 Botón lateral derecho flotante */}
  <Link
    to="/posts/new"
    className="fixed top-28 right-8 z-50 px-5 py-3 rounded-lg uppercase font-[Cinzel] text-sm tracking-wider shadow-lg backdrop-blur-sm transition-transform hover:scale-105"
    style={{
      backgroundColor: 'rgba(141, 170, 145, 0.7)', // color 8DAA91 al 70%
      border: '0.5px solid #1D4342',
      color: '#FFFFFF', // ← ahora el texto es blanco puro
    }}
  >
    Crear nuevo Post
  </Link>


        {/* Mapa */}
        <section className="mb-8" style={{ minHeight: '800px' }}>
          <h2 className="text-3xl font-bold mb-4 text-center">
            Mapa de Descubrimientos
          </h2>
          <MapComponent />
        </section>

        <RecentPostsCarousel />

        {/* Features */}
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
