/**
 * ThemeContext - Context para manejar el tema (light/dark) de la aplicación
 * 
 * Funcionalidades:
 * - Toggle entre modo claro y oscuro
 * - Persistencia en localStorage
 * - Detección del tema del sistema
 * - Aplicación automática del atributo data-theme en el HTML
 */

import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

// ========================================
// TIPOS
// ========================================

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

// ========================================
// CONSTANTES
// ========================================

const STORAGE_KEY = 'game-of-bones-theme';

// ========================================
// CONTEXT
// ========================================

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// ========================================
// PROVIDER
// ========================================

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
}

export function ThemeProvider({ children, defaultTheme = 'light' }: ThemeProviderProps) {
  // Estado del tema
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [isInitialized, setIsInitialized] = useState(false);

  // ========================================
  // INICIALIZACIÓN: Cargar tema guardado o detectar del sistema
  // ========================================
  useEffect(() => {
    const initializeTheme = () => {
      // 1. Intentar cargar desde localStorage
      const savedTheme = localStorage.getItem(STORAGE_KEY) as Theme | null;
      
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setThemeState(savedTheme);
      } else {
        // 2. Si no hay tema guardado, detectar preferencia del sistema
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setThemeState(prefersDark ? 'dark' : 'light');
      }
      
      setIsInitialized(true);
    };

    initializeTheme();
  }, []);

  // ========================================
  // APLICAR TEMA AL DOM
  // ========================================
  useEffect(() => {
    if (!isInitialized) return;

    const root = document.documentElement;

    // Remover el tema anterior
    root.removeAttribute('data-theme');
    
    // Aplicar el nuevo tema
    root.setAttribute('data-theme', theme);
    
    // Guardar en localStorage
    localStorage.setItem(STORAGE_KEY, theme);

    // Aplicar clase para darkMode de Tailwind (opcional, ya tenemos data-theme)
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme, isInitialized]);

  // ========================================
  // ESCUCHAR CAMBIOS EN LA PREFERENCIA DEL SISTEMA
  // ========================================
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Solo actualizar si no hay preferencia guardada
      const savedTheme = localStorage.getItem(STORAGE_KEY);
      if (!savedTheme) {
        setThemeState(e.matches ? 'dark' : 'light');
      }
    };

    // Usar addEventListener si está disponible, sino addListener (Safari antiguo)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      // Fallback para navegadores antiguos
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  // ========================================
  // FUNCIONES
  // ========================================

  const toggleTheme = () => {
    setThemeState((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  // ========================================
  // VALUE DEL CONTEXT
  // ========================================

  const value: ThemeContextType = {
    theme,
    toggleTheme,
    setTheme,
  };

  // No renderizar hasta que esté inicializado para evitar flash
  if (!isInitialized) {
    return null;
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// ========================================
// CUSTOM HOOK
// ========================================

/**
 * Hook personalizado para usar el contexto del tema
 * 
 * @example
 * ```tsx
 * const { theme, toggleTheme } = useTheme();
 * 
 * return (
 *   <button onClick={toggleTheme}>
 *     Cambiar a {theme === 'light' ? 'oscuro' : 'claro'}
 *   </button>
 * );
 * ```
 */
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme debe ser usado dentro de un ThemeProvider');
  }
  
  return context;
}

// ========================================
// EXPORTS
// ========================================

export type { Theme, ThemeContextType };