import React from 'react';
import { useTheme } from '../context/ThemeContext';

const Footer: React.FC = () => {
  const { theme } = useTheme();

  // Gradientes según el tema
  const gradientLight = 'linear-gradient(to right, #8d6a4e 23%, #f5e6cc 100%)';
  const gradientDark = 'linear-gradient(to right, #2b1a0f 0%, #75573b 100%)';

  return (
    <footer 
      className="w-full mt-auto"
      style={{
        background: theme === 'dark' ? gradientDark : gradientLight,
        fontFamily: "'Cinzel', serif"
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          {/* Texto */}
          <p 
            className="text-white text-center text-xs sm:text-sm md:text-base lg:text-lg uppercase tracking-wide"
            style={{ fontWeight: 500 }}
          >
            Este proyecto ha sido realizado por estudiantes de desarrollo Fullstack en:
          </p>
          
          {/* Logo de Factoría F5 */}
          <a 
            href="https://factoriaf5.org/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex-shrink-0 hover:opacity-80 transition-opacity"
            aria-label="Visitar Factoría F5"
          >
            <img 
              src="/logo-factoriaf5.png" 
              alt="Factoría F5 Logo" 
              className="h-8 sm:h-10 md:h-12 lg:h-14 w-auto object-contain"
            />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;