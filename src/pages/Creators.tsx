// Página "Sobre Nosotras" - Las creadoras del proyecto

/**
 * Creators - Página de presentación del equipo
 * 
 * Esta página presenta a las creadoras del proyecto Game of Bones,
 * sus roles, habilidades y enlaces a redes sociales/portfolios.
 * 
 * INSTRUCCIONES PARA ACTUALIZAR:
 * 1. Reemplazar los datos mock con información real de cada creadora
 * 2. Agregar fotos reales (avatar_url)
 * 3. Actualizar enlaces de LinkedIn, GitHub, portfolio, etc.
 * 4. Personalizar las descripciones y especialidades
 */

interface Creator {
    id: number;
    name: string;
    role: string;
    avatar_url: string;
    bio: string;
    specialties: string[];
    social: {
      github?: string;
      linkedin?: string;
      portfolio?: string;
      twitter?: string;
      email?: string;
    };
  }
  
  const Creators = () => {
    // TODO: REEMPLAZAR con datos reales del equipo
    const creators: Creator[] = [
      {
        id: 1,
        name: "María García",
        role: "Full Stack Developer & Project Lead",
        avatar_url: "https://via.placeholder.com/200", // CAMBIAR por foto real
        bio: "Apasionada por el desarrollo web y la paleontología. Lidero el equipo técnico y me encargo de la arquitectura del backend.",
        specialties: ["Node.js", "TypeScript", "Express", "Sequelize", "PostgreSQL"],
        social: {
          github: "https://github.com/usuario1", // CAMBIAR
          linkedin: "https://linkedin.com/in/usuario1", // CAMBIAR
          email: "maria@gameofbones.com" // CAMBIAR
        }
      },
      {
        id: 2,
        name: "Ana Martínez",
        role: "Frontend Developer & UI/UX Designer",
        avatar_url: "https://via.placeholder.com/200", // CAMBIAR por foto real
        bio: "Especializada en crear interfaces intuitivas y atractivas. Me encargo del diseño y desarrollo del frontend.",
        specialties: ["React", "TypeScript", "Tailwind CSS", "Figma", "UX Design"],
        social: {
          github: "https://github.com/usuario2", // CAMBIAR
          linkedin: "https://linkedin.com/in/usuario2", // CAMBIAR
          portfolio: "https://portfolio-ana.com" // CAMBIAR
        }
      },
      {
        id: 3,
        name: "Laura Rodríguez",
        role: "Backend Developer & Database Architect",
        avatar_url: "https://via.placeholder.com/200", // CAMBIAR por foto real
        bio: "Experta en bases de datos y optimización de consultas. Diseño y mantengo la estructura de datos del proyecto.",
        specialties: ["PostgreSQL", "Sequelize", "API Design", "Testing", "DevOps"],
        social: {
          github: "https://github.com/usuario3", // CAMBIAR
          linkedin: "https://linkedin.com/in/usuario3", // CAMBIAR
          email: "laura@gameofbones.com" // CAMBIAR
        }
      }
    ];
  
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">Conoce al Equipo</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Somos un equipo de desarrolladoras apasionadas por la tecnología y la paleontología.
              Creamos Game of Bones para compartir el fascinante mundo de los fósiles con la comunidad.
            </p>
          </div>
  
          {/* Cards de creadoras */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {creators.map(creator => (
              <div key={creator.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
                {/* Avatar */}
                <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                  <img
                    src={creator.avatar_url}
                    alt={creator.name}
                    className="w-32 h-32 rounded-full border-4 border-white object-cover"
                  />
                </div>
  
                {/* Contenido */}
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-1">{creator.name}</h2>
                  <p className="text-blue-600 font-medium mb-3">{creator.role}</p>
                  <p className="text-gray-600 mb-4">{creator.bio}</p>
  
                  {/* Especialidades */}
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Especialidades:</p>
                    <div className="flex flex-wrap gap-2">
                      {creator.specialties.map((specialty, index) => (
                        <span
                          key={index}
                          className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
  
                  {/* Redes sociales */}
                  <div className="flex gap-3 pt-4 border-t">
                    {creator.social.github && (
                      <a
                        href={creator.social.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-900"
                        title="GitHub"
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                        </svg>
                      </a>
                    )}
                    {creator.social.linkedin && (
                      <a
                        href={creator.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-blue-600"
                        title="LinkedIn"
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </a>
                    )}
                    {creator.social.portfolio && (
                      <a
                        href={creator.social.portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-purple-600"
                        title="Portfolio"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                      </a>
                    )}
                    {creator.social.email && (
                      <a
                        href={`mailto:${creator.social.email}`}
                        className="text-gray-600 hover:text-red-600"
                        title="Email"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
  
          {/* Sección del proyecto */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold mb-4">Sobre el Proyecto</h2>
            <div className="prose max-w-none text-gray-600">
              <p className="mb-4">
                <strong>Game of Bones</strong> nació de nuestra pasión compartida por la tecnología
                y la paleontología. Queríamos crear una plataforma donde los entusiastas de los fósiles
                pudieran compartir descubrimientos, aprender sobre nuevas especies y conectar con
                otros paleofrikis.
              </p>
              <p className="mb-4">
                El proyecto combina tecnologías modernas como React, TypeScript, Node.js y PostgreSQL
                para ofrecer una experiencia rápida, intuitiva y escalable. Implementamos mejores
                prácticas de desarrollo, testing exhaustivo y diseño responsive.
              </p>
              
              {/* Stack tecnológico */}
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-3">Stack Tecnológico</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Frontend:</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>React 18 con TypeScript</li>
                      <li>React Router para navegación</li>
                      <li>Tailwind CSS para estilos</li>
                      <li>Vite como bundler</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Backend:</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Node.js + Express</li>
                      <li>TypeScript</li>
                      <li>Sequelize ORM</li>
                      <li>PostgreSQL</li>
                      <li>JWT Authentication</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          {/* CTA para contribuir */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">¿Quieres Contribuir?</h2>
            <p className="mb-6 max-w-2xl mx-auto">
              Game of Bones es un proyecto open source. Si te apasiona la paleontología y el
              desarrollo web, ¡nos encantaría contar contigo!
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="https://github.com/tu-repo/game-of-bones" // CAMBIAR por repo real
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Ver en GitHub
              </a>
              <a
                href="mailto:team@gameofbones.com" // CAMBIAR por email real
                className="px-6 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
              >
                Contactar al Equipo
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Creators;
  
  /**
   * INSTRUCCIONES DE PERSONALIZACIÓN:
   * 
   * 1. DATOS DE LAS CREADORAS:
   *    - Actualizar nombres reales
   *    - Cambiar roles según responsabilidades reales
   *    - Escribir bios personalizadas (2-3 líneas)
   *    - Listar especialidades técnicas reales
   * 
   * 2. FOTOS:
   *    - Subir fotos profesionales a /public/images/team/
   *    - Formato recomendado: JPG/PNG, 400x400px mínimo
   *    - Actualizar avatar_url con las rutas reales
   *    - Alternativamente, usar servicios como Gravatar
   * 
   * 3. REDES SOCIALES:
   *    - Agregar enlaces reales de GitHub
   *    - Agregar perfiles de LinkedIn
   *    - Enlaces a portfolios personales (si existen)
   *    - Emails profesionales o del proyecto
   * 
   * 4. INFORMACIÓN DEL PROYECTO:
   *    - Actualizar descripción con la historia real del proyecto
   *    - Agregar fecha de inicio
   *    - Mencionar inspiraciones o motivaciones reales
   *    - Actualizar stack tecnológico si cambia
   * 
   * 5. ENLACES:
   *    - Reemplazar URL del repositorio GitHub
   *    - Actualizar email de contacto del equipo
   *    - Agregar documentación del proyecto si existe
   * 
   * 6. MEJORAS FUTURAS:
   *    - Agregar animaciones de entrada (Framer Motion)
   *    - Timeline del desarrollo del proyecto
   *    - Estadísticas del proyecto (commits, PRs, issues)
   *    - Testimoniales de usuarios
   *    - Roadmap público del proyecto
   *    - Blog posts sobre el desarrollo
   *    - Sección de agradecimientos/contributors
   * 
   * 7. CONSIDERACIONES:
   *    - Esta página es excelente para SEO (agregar meta tags)
   *    - Considerar agregar structured data (JSON-LD) para personas
   *    - Mantener información actualizada
   *    - Links funcionando y sin errores 404
   */