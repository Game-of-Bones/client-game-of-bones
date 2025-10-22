import React from 'react';
import { Link } from 'react-router-dom';

// Componentes de Iconos Inline SVG para máxima robustez
// Tipado explícito de 'props'
const HomeIcon = (props: React.ComponentProps<'svg'>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-home">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
);

// Tipado explícito de 'props'
const SearchIcon = (props: React.ComponentProps<'svg'>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
    </svg>
);


/**
 * NotFound - Página 404
 * * Estilo renovado: Utiliza variables de color y clases CSS del sistema de temas (global.css)
 * para garantizar la compatibilidad con Dark/Light Mode y mantener la estética de Figma.
 */
const NotFound = () => {
    
    // NOTA: Usamos clases de utilidad basadas en las variables CSS definidas en global.css
    
    /**
     * Función tipada para manejar el error de carga de imagen.
     */
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const target = e.currentTarget;
        
        target.onerror = null; // Previene bucles de error infinitos
        target.src = "/gob_logo.png"; // Fallback: Carga el logo
        target.alt = "Logo Game of Bones - 404";
    }

    return (
        // El fondo del body ya es manejado por global.css con --bg-primary.
        <div className="min-h-screen flex flex-col items-center justify-center p-6 sm:p-10">
            
            {/* Aplica el efecto de cristal y fondo semitransparente */}
            <div className="max-w-xl w-full text-center p-8 rounded-2xl shadow-xl card-glass animate-scale-in">
                
                {/* Imagen del cráneo de Triceratops */}
                <div className="mb-6 mx-auto w-32 h-32 sm:w-48 sm:h-48">
                    <img 
                        src="/Triceratops_Skull_in_Earthy_Brown.png" 
                        alt="Cráneo de Triceratops - 404"
                        className="w-full h-full object-contain"
                        onError={handleImageError} 
                    />
                </div>
                
                {/* Título de Error */}
                {/* Utilizamos font-cinzel para un estilo destacado y text-gradient */}
                <h1 
                    className={`text-7xl sm:text-9xl font-extrabold mb-4 text-gradient`}
                    // Corrección: Usamos estilo inline para forzar la fuente Cinzel
                    style={{ fontFamily: `'Cinzel', serif` }}
                >
                    404
                </h1>
                
                {/* Mensaje Temático */}
                <h2 
                    className={`text-2xl sm:text-3xl font-semibold mb-4`} 
                    style={{ color: 'var(--text-primary)', fontFamily: `'Cinzel', serif` }}
                >
                    ¡Territorio Inexplorado!
                </h2>
                
                {/* Mensaje Descriptivo */}
                {/* La fuente Playfair ya se aplica por defecto al body, pero la aseguramos aquí si es necesario */}
                <p 
                    className={`text-base sm:text-lg mb-10`} 
                    style={{ color: 'var(--text-secondary)', fontFamily: `'Playfair Display', serif` }}
                >
                    La ruta que buscas ha desaparecido sin dejar rastro. Es hora de volver a la civilización.
                </p>

                {/* Botones de Navegación */}
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link
                        to="/"
                        // Botón principal con el color de acento
                        className="btn btn-primary w-full sm:w-auto px-8 py-3 uppercase tracking-wider"
                        style={{ fontFamily: `'Cinzel', serif` }}
                    >
                        {/* El color del ícono debe ser el color de texto inverso del botón primario */}
                        <HomeIcon className="w-5 h-5 mr-2" style={{ color: 'var(--text-inverse)' }} />
                        Volver a la Base
                    </Link>
                    
                    <Link
                        to="/posts"
                        // Botón secundario
                        className="btn btn-secondary w-full sm:w-auto px-8 py-3"
                        style={{ fontFamily: `'Cinzel', serif` }}
                    >
                        {/* El color del ícono debe ser el color de texto principal del botón secundario */}
                        <SearchIcon className="w-5 h-5 mr-2" style={{ color: 'var(--text-primary)' }} />
                        Explorar Posts
                    </Link>
                </div>
                
                {/* Espacio para la futura Búsqueda */}
                {/* Usamos border-color: var(--border-light) para el modo oscuro/claro */}
                <div className="mt-12 pt-6 border-t" style={{ borderColor: 'var(--border-color)' }}>
                    <p 
                        className={`text-sm font-light`} 
                        // Corregido a var(--text-secondary) o var(--text-primary) para mejor contraste en modo claro
                        style={{ color: 'var(--text-secondary)', fontFamily: `'Playfair Display', serif` }}
                    >
                        Estamos trabajando en un radar de búsqueda avanzado para estos casos.
                    </p>
                </div>

            </div>
        </div>
    );
};

export default NotFound;
