/**
 * ThemeToggle - Componente para cambiar entre modo claro y oscuro
 * 
 * Características:
 * - Toggle animado entre sol (☀️) y luna (🌙)
 * - Tooltip descriptivo
 * - Transiciones suaves
 * - Accesible (aria-label)
 * - Responsive
 */

import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

// ========================================
// TIPOS
// ========================================

interface ThemeToggleProps {
  /** Tamaño del icono (en píxeles) */
  size?: number;
  /** Mostrar label al lado del icono */
  showLabel?: boolean;
  /** Clase adicional para customización */
  className?: string;
}

// ========================================
// COMPONENTE
// ========================================

export default function ThemeToggle({ 
  size = 20, 
  showLabel = false,
  className = '' 
}: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  // Determinar el icono y el texto según el tema actual
  const Icon = theme === 'light' ? Moon : Sun;
  const label = theme === 'light' ? 'Modo oscuro' : 'Modo claro';
  const ariaLabel = `Cambiar a ${label.toLowerCase()}`;

  return (
    <button
      onClick={toggleTheme}
      className={`
        group
        inline-flex items-center gap-2
        px-3 py-2
        rounded-lg
        transition-all duration-200
        hover:bg-theme-hover
        focus:outline-none focus:ring-2 focus:ring-accent-coral focus:ring-offset-2
        ${className}
      `}
      aria-label={ariaLabel}
      title={ariaLabel}
      type="button"
    >
      {/* Icono con animación de rotación */}
      <span 
        className="
          inline-flex items-center justify-center
          transition-transform duration-300
          group-hover:rotate-12
          group-active:scale-90
        "
      >
        <Icon 
          size={size} 
          className="text-theme-secondary"
          strokeWidth={2}
        />
      </span>

      {/* Label opcional */}
      {showLabel && (
        <span className="text-sm font-medium text-theme-secondary">
          {label}
        </span>
      )}
    </button>
  );
}

// ========================================
// VARIANTES DEL COMPONENTE
// ========================================

/**
 * ThemeToggleCompact - Versión compacta sin label
 * Ideal para navbars o toolbars
 */
export function ThemeToggleCompact() {
  return <ThemeToggle size={20} showLabel={false} />;
}

/**
 * ThemeToggleWithLabel - Versión con label 
 */
export function ThemeToggleWithLabel() {
  return <ThemeToggle size={20} showLabel={true} />;
}

/**
 * ThemeToggleLarge - Versión grande para configuración
 */
export function ThemeToggleLarge() {
  return (
    <ThemeToggle 
      size={24} 
      showLabel={true}
      className="px-4 py-3 text-base"
    />
  );
}

/**
 * ThemeToggleSwitch - Versión switch con iconos laterales 
 */
export function ThemeToggleSwitch() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="flex items-center gap-2">
      <Sun 
        size={16} 
        className={`transition-colors ${
          theme === 'light' ? 'text-accent-amber' : 'text-neutral-400'
        }`}
      />
      <button
        onClick={toggleTheme}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full
          transition-colors duration-300
          focus:outline-none focus:ring-2 focus:ring-accent-coral focus:ring-offset-2
          ${theme === 'dark' ? 'bg-primary-600' : 'bg-primary-300'}
        `}
        aria-label={`Cambiar a modo ${theme === 'light' ? 'oscuro' : 'claro'}`}
        type="button"
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white
            transition-transform duration-300
            shadow-sm
            ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
      </button>
      <Moon 
        size={16} 
        className={`transition-colors ${
          theme === 'dark' ? 'text-primary-200' : 'text-neutral-400'
        }`}
      />
    </div>
  );
}