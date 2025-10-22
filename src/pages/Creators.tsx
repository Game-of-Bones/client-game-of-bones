import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';

interface Creator {
  name: string;
  role: string;
  image: string;
  github?: string;
  linkedin?: string;
  email?: string;
}

// Componente de tarjeta individual para reutilización
const CreatorCard: React.FC<{ creator: Creator }> = ({ creator }) => {
  return (
    <div
      className="relative rounded-2xl overflow-hidden shadow-xl 
                 transition-all duration-500 hover:scale-105 hover:shadow-2xl
                 hover:-rotate-1 group cursor-pointer
                 card-glass w-full"
      style={{
        borderWidth: '2px',
        borderColor: 'var(--border-color)',
        borderStyle: 'solid'
      }}
    >
      {/* Efecto de brillo animado */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
                    translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
      
      {/* Imagen con efecto parallax */}
      <div className="relative h-64 sm:h-72 md:h-80 lg:h-72 overflow-hidden">
        <div className="absolute inset-0 z-10 group-hover:opacity-50 transition-opacity duration-500" 
             style={{
               background: 'linear-gradient(to bottom, transparent, rgba(45, 31, 19, 0.8))'
             }} />
        <img
          src={creator.image}
          alt={creator.name}
          className="w-full h-full object-cover transition-all duration-700 
                   group-hover:scale-125 group-hover:rotate-3 brightness-95 group-hover:brightness-110"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/300x400?text=Foto';
          }}
        />
        
        {/* Badge decorativo */}
        <div className="absolute top-4 right-4 px-3 py-1 rounded-full 
                      text-xs font-semibold uppercase tracking-wider z-20
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300"
             style={{ 
               fontFamily: 'Cinzel, serif',
               backgroundColor: 'var(--text-primary)',
               color: 'var(--text-inverse)'
             }}>
          Developer
        </div>
      </div>

      {/* Información con animaciones */}
      <div className="relative p-4 sm:p-6 z-20">
        {/* Línea decorativa superior */}
        <div className="w-16 h-1 mb-4 transition-all duration-500 group-hover:w-full"
             style={{
               background: 'linear-gradient(to right, var(--text-primary), transparent)'
             }} />
        
        <h3 
          className="text-lg sm:text-xl font-bold mb-2 
                   transition-all duration-300 group-hover:text-xl sm:group-hover:text-2xl group-hover:tracking-wider"
          style={{ 
            fontFamily: 'Cinzel, serif',
            color: 'var(--text-primary)'
          }}
        >
          {creator.name}
        </h3>
        
        <p 
          className="text-xs sm:text-sm mb-4 sm:mb-6 uppercase tracking-widest transition-colors duration-300"
          style={{ 
            fontFamily: 'Cinzel, serif', 
            fontWeight: 500,
            color: 'var(--text-secondary)'
          }}
        >
          {creator.role}
        </p>

        {/* Enlaces sociales con efectos mejorados */}
        <div className="flex justify-center gap-3 sm:gap-4">
          {creator.github && (
            <a
              href={creator.github}
              target="_blank"
              rel="noopener noreferrer"
              className="relative p-2 sm:p-3 rounded-full backdrop-blur-sm
                       transition-all duration-300 hover:scale-125 hover:rotate-12"
              style={{
                backgroundColor: 'rgba(139, 115, 85, 0.3)',
                color: 'var(--text-primary)',
                borderWidth: '1px',
                borderColor: 'var(--border-color)',
                borderStyle: 'solid'
              }}
              aria-label="GitHub"
            >
              <Github className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>
          )}
          {creator.linkedin && (
            <a
              href={creator.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="relative p-2 sm:p-3 rounded-full backdrop-blur-sm
                       transition-all duration-300 hover:scale-125 hover:rotate-12"
              style={{
                backgroundColor: 'rgba(139, 115, 85, 0.3)',
                color: 'var(--text-primary)',
                borderWidth: '1px',
                borderColor: 'var(--border-color)',
                borderStyle: 'solid'
              }}
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>
          )}
          {creator.email && (
            <a
              href={`mailto:${creator.email}`}
              className="relative p-2 sm:p-3 rounded-full backdrop-blur-sm
                       transition-all duration-300 hover:scale-125 hover:rotate-12"
              style={{
                backgroundColor: 'rgba(139, 115, 85, 0.3)',
                color: 'var(--text-primary)',
                borderWidth: '1px',
                borderColor: 'var(--border-color)',
                borderStyle: 'solid'
              }}
              aria-label="Email"
            >
              <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>
          )}
        </div>

        {/* Línea decorativa inferior */}
        <div className="w-0 h-1 mt-4 sm:mt-6 mx-auto transition-all duration-500 group-hover:w-full"
             style={{
               background: 'linear-gradient(to right, transparent, var(--text-primary))'
             }} />
      </div>

      {/* Partículas decorativas en las esquinas */}
      <div className="absolute top-0 left-0 w-16 h-16 sm:w-20 sm:h-20 border-t-2 border-l-2 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-500"
           style={{ borderColor: 'var(--border-color)' }} />
      <div className="absolute bottom-0 right-0 w-16 h-16 sm:w-20 sm:h-20 border-b-2 border-r-2 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-500"
           style={{ borderColor: 'var(--border-color)' }} />
    </div>
  );
};

const Creators: React.FC = () => {
  const creators: Creator[] = [
    {
      name: "Esther Tapias",
      role: "Full Stack Developer",
      image: "/Esther_Tapias.jpg",
      github: "https://github.com/EstherTapias",
      linkedin: "https://www.linkedin.com/in/esther-tapias-paez-camino/",
    },
    {
      name: "Ingrid Martinez",
      role: "Full Stack Developer",
      image: "/Ingrid.jpeg",
      github: "https://github.com/ingridD2707",
      linkedin: "https://www.linkedin.com/in/ingrid-m",
    },
    {
      name: "Nicole Guevara",
      role: "Full Stack Developer",
      image: "/Nicole_Guevara.jpg",
      github: "https://github.com/nicolegugu93",
      linkedin: "https://www.linkedin.com/in/nicoleguevaragutierrez/",
    },
    {
      name: "Ana Muruzábal",
      role: "Full Stack Developer",
      image: "/public/ana.jpg",
      github: "https://github.com/usuario3",
      linkedin: "https://linkedin.com/in/perfil3"
    },
    {
      name: "Maria Del Carmen Tajuelo",
      role: "Full Stack Developer",
      image: "/public/Carmen_Tajuelo.jpg",
      github: "https://github.com/CarmenTajuelo",
      linkedin: "https://www.linkedin.com/in/carmentajuelo/"
    }
  ];

  return (
    <div className="min-h-screen py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Texto introductorio */}
        <div className="mb-12 sm:mb-16 md:mb-20 lg:mb-24 px-2 sm:px-4">
          <div 
            className="text-center uppercase leading-relaxed sm:leading-loose space-y-4 sm:space-y-6"
            style={{ 
              fontFamily: 'Cinzel, serif', 
              fontSize: 'clamp(0.75rem, 1.5vw + 0.5rem, 1.125rem)', 
              fontWeight: 600,
              color: 'var(--text-primary)'
            }}
          >
            <p>
              Game of Bones es una web dedicada a la fascinante ciencia de la paleontología, 
              donde exploramos el pasado remoto de nuestro planeta, los secretos escondidos en 
              los fósiles y las criaturas que caminaron la Tierra hace millones de años.
            </p>
            <p>
              Este proyecto ha sido desarrollado por un equipo de estudiantes de Factoria F5, una 
              escuela de formación intensiva en desarrollo web y tecnología inclusiva. Unimos 
              nuestras habilidades en frontend y backend para crear una experiencia interactiva, 
              educativa y visualmente atractiva, pensada para todos los públicos: desde curiosos 
              aficionados hasta amantes de la ciencia.
            </p>
            <p>
              En Game of Bones, creemos que cada fósil cuenta una historia, y que la tecnología 
              puede ayudarnos a contarlas mejor. Nuestro objetivo es acercar la paleontología de 
              forma divertida y accesible, combinando el rigor científico con el poder del diseño 
              web moderno.
            </p>
          </div>
        </div>

        {/* Grid de creadores - 3 arriba, 2 abajo centrados */}
        <div className="space-y-6 sm:space-y-8">
          {/* Primera fila: 3 creadores */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {creators.slice(0, 3).map((creator, index) => (
              <CreatorCard key={index} creator={creator} />
            ))}
          </div>

          {/* Segunda fila: 2 creadores centrados */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 max-w-4xl mx-auto">
            {creators.slice(3, 5).map((creator, index) => (
              <CreatorCard key={index + 3} creator={creator} />
            ))}
          </div>
        </div>

        {/* Logo Factoria F5 */}
        <div className="mt-12 sm:mt-16 md:mt-20 text-center px-4">
          <p 
            className="text-xs sm:text-sm uppercase tracking-wider"
            style={{ 
              fontFamily: 'Cinzel, serif',
              color: 'var(--text-secondary)'
            }}
          >
            Desarrollado en
          </p>
          <div className="mt-3 sm:mt-4 flex justify-center">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold"
                 style={{ 
                   fontFamily: 'Cinzel, serif',
                   color: 'var(--text-primary)'
                 }}>
              FACTORÍA F5
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Creators;