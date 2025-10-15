import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sun, Moon } from "lucide-react";

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
      <div className="flex items-center justify-between px-8 py-6">

        {/* Logo grande */}
        <div
          className="flex-shrink-0 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src="/gob_logo.png"
            alt="Game of Bones Logo"
            className="object-contain"
            style={{ height: "300px", width: "auto" }}
          />
        </div>

        {/* Enlaces + toggle */}
        <div className="flex items-center gap-6 text-xl uppercase tracking-wider flex-1 justify-center">
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
              className="flex items-center justify-center hover:opacity-70 transition-opacity"
              style={{ background: "none", border: "none", cursor: "pointer", color: menuColor, padding: 0 }}
              aria-label="Cambiar tema"
            >
              {theme === "dark" ? <Sun size={24} strokeWidth={1.5} /> : <Moon size={24} strokeWidth={1.5} />}
            </button>
          )}
        </div>

        {/* LOGIN o usuario */}
        <div className="flex items-center flex-shrink-0">
          {!user ? (
            <Link
              to="/login"
              className="hover:opacity-75 transition-opacity text-xl uppercase tracking-wider whitespace-nowrap"
              style={{ color: menuColor, fontWeight: 500 }}
            >
              LOGIN
            </Link>
          ) : (
            <div
              onClick={() => navigate("/profile")}
              className="cursor-pointer hover:opacity-80 transition-opacity text-xl whitespace-nowrap"
              style={{ color: menuColor, fontWeight: 500 }}
            >
              {user.name}
            </div>
          )}
        </div>
      </div>

      {/* Línea decorativa */}
      <div
        className="mx-auto mt-2"
        style={{
          width: "calc(100% - 64px)",
          height: "1px",
          backgroundColor: menuColor,
          opacity: 0.6
        }}
      />
    </header>
  );
};

export default Navbar;