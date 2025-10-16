import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Post {
  id: number;
  title: string;
  image_url: string;
}

const RecentPostsCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Datos de ejemplo - reemplazar con fetch del backend
  const recentPosts: Post[] = [
    {
      id: 1,
      title: "Descubrimiento de Tyrannosaurus Rex en Montana",
      image_url: "/public/montana.jpg"
    },
    {
      id: 2,
      title: "Fósiles de Trilobites del Período Cámbrico",
      image_url: "/public/trilobites.jpg"
    },
    {
      id: 3,
      title: "Huellas de Dinosaurio en Formación Morrison",
      image_url: "/public/footprint.jpg"
    },
    {
      id: 4,
      title: "Excavación de Mamut Lanudo en Siberia",
      image_url: "/public/Woolly_mammoth.jpg"
    },
    {
      id: 5,
      title: "Ámbar con Insectos del Cretácico",
      image_url: "/public/ambar.webp"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % recentPosts.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + recentPosts.length) % recentPosts.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentSlide, isAutoPlaying]);

  return (
    <div className="w-full mx-auto mb-8">
      <h2 className="text-3xl font-bold text-center mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
        Últimos Descubrimientos
      </h2>
      
      <div 
        className="relative"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        {/* Carousel Container */}
        <div className="relative overflow-hidden rounded-lg backdrop-blur-sm bg-white/10 border border-white/20">
          <div 
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {recentPosts.map((post) => (
              <div key={post.id} className="min-w-full relative">
                <div className="relative h-96">
                  {/* Image */}
                  <img 
                    src={post.image_url} 
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  
                  {/* Title */}
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <h3 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg" style={{ fontFamily: 'Playfair Display, serif' }}>
                      {post.title}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-200"
            style={{
              backgroundColor: 'rgba(152, 177, 137, 0.3)',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(152, 177, 137, 0.5)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(152, 177, 137, 0.3)'}
            aria-label="Anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-200"
            style={{
              backgroundColor: 'rgba(152, 177, 137, 0.3)',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(152, 177, 137, 0.5)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(152, 177, 137, 0.3)'}
            aria-label="Siguiente"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {recentPosts.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === index 
                  ? 'w-8' 
                  : 'w-2'
              }`}
              style={{
                backgroundColor: currentSlide === index 
                  ? 'rgba(152, 177, 137, 0.9)' 
                  : 'rgba(152, 177, 137, 0.3)'
              }}
              onMouseEnter={(e) => {
                if (currentSlide !== index) {
                  e.currentTarget.style.backgroundColor = 'rgba(152, 177, 137, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                if (currentSlide !== index) {
                  e.currentTarget.style.backgroundColor = 'rgba(152, 177, 137, 0.3)';
                }
              }}
              aria-label={`Ir al slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentPostsCarousel;