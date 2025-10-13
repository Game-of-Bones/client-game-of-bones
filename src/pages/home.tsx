// Home.tsx
import { Link } from 'react-router-dom';
import MapComponent from '../components/ui/MapComponent'; // Ajusta la ruta según tu estructura

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center py-12 bg-gray-100 rounded-lg mb-8">
        <h1 className="text-4xl font-bold mb-4">
          Bienvenido a Game of Bones
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Comparte y descubre historias épicas
        </p>
        <div className="space-x-4">
          <Link
            to="/posts"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Ver Posts
          </Link>
          <Link
            to="/register"
            className="inline-block px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Únete Ahora
          </Link>
        </div>
      </section>

      {/* 🗺️ MAPA DE DESCUBRIMIENTOS */}
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-center">
          Mapa de Descubrimientos
        </h2>
        <MapComponent />
      </section>

      {/* Sección de Features */}
      <section className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 border rounded-lg text-center">
          <h3 className="text-xl font-semibold mb-2">📝 Crea Posts</h3>
          <p className="text-gray-600">
            Comparte tus historias con la comunidad
          </p>
        </div>
        <div className="p-6 border rounded-lg text-center">
          <h3 className="text-xl font-semibold mb-2">💬 Comenta</h3>
          <p className="text-gray-600">
            Participa en discusiones interesantes
          </p>
        </div>
        <div className="p-6 border rounded-lg text-center">
          <h3 className="text-xl font-semibold mb-2">⭐ Explora</h3>
          <p className="text-gray-600">
            Descubre contenido increíble
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;