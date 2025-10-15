import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sun, Moon, User } from "lucide-react";

interface UserProfile {
  name: string;
  image: string;
}

interface NavbarProps {
  user?: UserProfile;
  theme?: "light" | "dark";
  onThemeToggle?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, theme = "dark", onThemeToggle }) => {
  const navigate = useNavigate();
  const menuColor = theme === "dark" ? "#8DDA91" : "#8B6B4D";

  return (
    <header className="w-full bg-transparent" style={{ fontFamily: "'Cinzel', serif" }}>
      <div className="flex items-center justify-between px-8 py-4">

        {/* Logo reducido y clickeable */}
        <Link 
          to="/" 
          className="flex-shrink-0 hover:opacity-80 transition-opacity"
        >
          <img
            src="/gob_logo.png"
            alt="Game of Bones Logo"
            className="object-contain"
            style={{ height: "80px", width: "auto" }}
          />
        </Link>

        {/* Navegación central */}
        <nav className="flex items-center gap-8 text-lg uppercase tracking-wider">
          <Link
            to="/"
            className="hover:opacity-70 transition-opacity whitespace-nowrap"
            style={{ color: menuColor, fontWeight: 500 }}
          >
            HOME
          </Link>

          <Link
            to="/creators"
            className="hover:opacity-70 transition-opacity whitespace-nowrap"
            style={{ color: menuColor, fontWeight: 500 }}
          >
            ABOUT
          </Link>

          {/* Theme Toggle */}
          {onThemeToggle && (
            <button
              onClick={onThemeToggle}
              className="flex items-center justify-center hover:opacity-70 transition-opacity p-1"
              style={{ 
                background: "none", 
                border: "none", 
                cursor: "pointer", 
                color: menuColor 
              }}
              aria-label="Cambiar tema"
            >
              {theme === "dark" ? (
                <Sun size={20} strokeWidth={1.5} />
              ) : (
                <Moon size={20} strokeWidth={1.5} />
              )}
            </button>
          )}
        </nav>

        {/* User/Login */}
        <div className="flex items-center flex-shrink-0">
          {!user ? (
            <Link
              to="/login"
              className="flex items-center gap-2 hover:opacity-75 transition-opacity text-lg uppercase tracking-wider whitespace-nowrap"
              style={{ color: menuColor, fontWeight: 500 }}
            >
              <User size={20} strokeWidth={1.5} />
              <span>INICIAR SESIÓN</span>
            </Link>
          ) : (
            <button
              onClick={() => navigate("/profile")}
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <img 
                src={user.image} 
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover border-2"
                style={{ borderColor: menuColor }}
              />
              <span 
                className="text-lg whitespace-nowrap"
                style={{ color: menuColor, fontWeight: 500 }}
              >
                {user.name}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Línea decorativa más cercana */}
      <div
        className="mx-8"
        style={{
          height: "1px",
          backgroundColor: menuColor,
          opacity: 0.6
        }}
      />
    </header>
  );
};

export default Navbar;