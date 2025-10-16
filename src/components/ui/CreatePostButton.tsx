// src/components/ui/CreatePostButton.tsx
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';

interface CreatePostButtonProps {
  to?: string;
  className?: string;
  variant?: 'fixed' | 'inline';
}

const CreatePostButton = ({ 
  to = '/posts/new', 
  className = '',
  variant = 'fixed' 
}: CreatePostButtonProps) => {
  const baseStyles = "group relative px-6 py-3 rounded-lg uppercase text-sm tracking-wider shadow-lg backdrop-blur-sm transition-all duration-300 overflow-hidden inline-flex items-center gap-2";
  
  const variantStyles = variant === 'fixed' 
    ? "fixed top-28 right-8 z-50" 
    : "inline-block";

  return (
    <Link
      to={to}
      className={`${baseStyles} ${variantStyles} ${className}`}
      style={{
        backgroundColor: 'rgba(141, 170, 145, 0.85)',
        border: '1.5px solid #1D4342',
        color: '#FFFFFF',
        fontFamily: 'Cinzel, serif',
        letterSpacing: '0.05em'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(29, 67, 66, 0.4)';
        e.currentTarget.style.backgroundColor = '#8DAA91';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1) translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 15px rgba(29, 67, 66, 0.2)';
        e.currentTarget.style.backgroundColor = 'rgba(141, 170, 145, 0.85)';
      }}
    >
      {/* Efecto de brillo animado */}
      <span 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.2) 50%, transparent 70%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 2s infinite',
        }}
      />
      
      {/* Icono */}
      <PlusCircle 
        size={18} 
        className="transition-transform duration-300 group-hover:rotate-90 relative z-10"
      />
      
      {/* Texto */}
      <span className="relative z-10">
        Crear nuevo Post
      </span>

      {/* Estilo CSS para la animación */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </Link>
  );
};

export default CreatePostButton;