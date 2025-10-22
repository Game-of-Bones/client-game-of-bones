import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";

interface CreatePostButtonProps {
  to?: string;
  className?: string;
}

const CreatePostButton = ({ 
  to = "/posts/new", 
  className = "" 
}: CreatePostButtonProps) => {
  return (
    <Link
      to={to}
      className={`
        fixed bottom-6 right-6 z-50
        flex items-center justify-center gap-2
        px-5 py-3 sm:px-6 sm:py-3
        rounded-full
        bg-[rgb(29_67_66/0.85)]
        text-white font-serif text-sm tracking-wider uppercase
        shadow-[0_8px_20px_rgba(0,0,0,0.25)]
        backdrop-blur-md border border-[rgb(141_170_145/0.6)]
        hover:scale-105 hover:bg-[rgb(29_67_66/0.95)]
        hover:shadow-[0_10px_30px_rgba(29,67,66,0.5)]
        transition-all duration-300 ease-out
        active:scale-95
        ${className}
      `}
      style={{
        fontFamily: "Cinzel, serif",
        letterSpacing: "0.05em",
      }}
      aria-label="Crear nuevo post"
    >
      {/* Ícono */}
      <PlusCircle 
        size={22} 
        className="transition-transform duration-300 group-hover:rotate-90" 
      />

      {/* Texto solo visible en pantallas medianas o mayores */}
      <span className="hidden sm:inline-block">Crear Post</span>
    </Link>
  );
};

export default CreatePostButton;
