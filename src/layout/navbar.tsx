import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Menu, X, LogOut } from "lucide-react"; // ← AÑADIDO LogOut
import { ThemeToggleCompact } from "../components/ui/ThemeToggles";
import { useTheme } from "../context/ThemeContext";
import { useAuthStore } from "../stores/authStore"; // ← AÑADIDO

const Navbar: React.FC = () => { // ← QUITADO props, ahora lee de Zustand
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ← AÑADIDO: Leer auth desde Zustand
  const { user, isAuthenticated, logout } = useAuthStore();

  // Color de letra según el tema
  const menuColor = theme === "dark" ? "#98b189" : "#462e1b";

  // ← AÑADIDO: Función de logout
  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="w-full bg-transparent" style={{ fontFamily: "'Cinzel', serif" }}>
      {/* Contenedor con márgenes laterales */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Contenedor principal: espacio entre izquierda (logo+menu) y derecha (user) */}
        <div className="flex items-center justify-between py-3">

          {/* ---------- IZQUIERDA: logo + hamburger (mobile) ---------- */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex-shrink-0 hover:opacity-80 transition-opacity">
              <img
                src="/gob_logo.png"
                alt="Game of Bones Logo"
                className="object-contain h-80 sm:h-80 md:h-90 lg:h-96 xl:h-[500px] w-auto"
              />
            </Link>

            {/* Botón hamburger - solo visible en mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:opacity-70 transition-opacity"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X size={24} style={{ color: menuColor }} />
              ) : (
                <Menu size={24} style={{ color: menuColor }} />
              )}
            </button>
          </div>

          {/* ---------- CENTRO: Nav desktop (oculto en mobile) ---------- */}
          <nav className="hidden lg:flex items-center gap-6 text-base xl:text-lg uppercase tracking-wider">
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

            <Link
              to="/posts"
              className="hover:opacity-70 transition-opacity whitespace-nowrap"
              style={{ color: menuColor, fontWeight: 500 }}
            >
              POSTS
            </Link>

            <div>
              <ThemeToggleCompact />
            </div>
          </nav>

          {/* ---------- DERECHA: usuario / login ---------- */}
          <div className="hidden lg:flex items-center gap-4">
            {!isAuthenticated ? ( // ← CAMBIADO
              <Link
                to="/login"
                className="flex items-center gap-2 hover:opacity-75 transition-opacity text-base xl:text-lg uppercase tracking-wider whitespace-nowrap"
                style={{ color: menuColor, fontWeight: 500 }}
              >
                <User size={20} strokeWidth={1.5} />
                <span>INICIAR SESIÓN</span>
              </Link>
            ) : (
              <> {/* ← AÑADIDO: Perfil + Logout */}
                <button
                  onClick={() => navigate("/profile")}
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                >
                  {user?.avatar_url ? ( // ← CAMBIADO
                    <img
                      src={user.avatar_url}
                      alt={user.username}
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border-2"
                      style={{ borderColor: menuColor }}
                    />
                  ) : (
                    <div
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2 font-semibold"
                      style={{ borderColor: menuColor, color: menuColor }}
                    >
                      {user?.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="hidden xl:inline" style={{ color: menuColor, fontWeight: 500 }}>
                    {user?.username} {/* ← CAMBIADO */}
                  </span>
                </button>

                {/* ← AÑADIDO: Botón Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 hover:opacity-75 transition-opacity text-base xl:text-lg uppercase tracking-wider whitespace-nowrap"
                  style={{ color: menuColor, fontWeight: 500 }}
                  title="Cerrar sesión"
                >
                  <LogOut size={20} strokeWidth={1.5} />
                  <span className="hidden xl:inline">SALIR</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Línea decorativa con márgenes laterales */}
        <div
          className="w-full"
          style={{ height: "1px", backgroundColor: menuColor, opacity: 0.6 }}
        />
      </div>

      {/* ---------- MENÚ MOBILE (slidedown) ---------- */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-transparent animate-slide-down">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col gap-4">
            {/* Links */}
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:opacity-70 transition-opacity uppercase tracking-wider text-center"
              style={{ color: menuColor, fontWeight: 500 }}
            >
              HOME
            </Link>

            <Link
              to="/creators"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:opacity-70 transition-opacity uppercase tracking-wider text-center"
              style={{ color: menuColor, fontWeight: 500 }}
            >
              ABOUT
            </Link>

            <Link
              to="/posts"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:opacity-70 transition-opacity uppercase tracking-wider text-center"
              style={{ color: menuColor, fontWeight: 500 }}
            >
              POSTS
            </Link>

            {/* Separador */}
            <div
              className="w-full my-2"
              style={{ height: "1px", backgroundColor: menuColor, opacity: 0.3 }}
            />

            {/* Theme toggle y user */}
            <div className="flex items-center justify-center gap-4">
              <ThemeToggleCompact />

              {!isAuthenticated ? ( // ← CAMBIADO
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 hover:opacity-75 transition-opacity uppercase tracking-wider"
                  style={{ color: menuColor, fontWeight: 500 }}
                >
                  <User size={20} strokeWidth={1.5} />
                  <span>INICIAR SESIÓN</span>
                </Link>
              ) : (
                <> {/* ← AÑADIDO */}
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate("/profile");
                    }}
                    className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                  >
                    {user?.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={user.username}
                        className="w-8 h-8 rounded-full object-cover border-2"
                        style={{ borderColor: menuColor }}
                      />
                    ) : (
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center border-2 font-semibold"
                        style={{ borderColor: menuColor, color: menuColor }}
                      >
                        {user?.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span style={{ color: menuColor, fontWeight: 500 }}>
                      {user?.username}
                    </span>
                  </button>

                  {/* ← AÑADIDO: Logout mobile */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 hover:opacity-75 transition-opacity uppercase tracking-wider"
                    style={{ color: menuColor, fontWeight: 500 }}
                  >
                    <LogOut size={20} strokeWidth={1.5} />
                    <span>SALIR</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;